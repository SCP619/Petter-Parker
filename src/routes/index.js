import Space from "../models/space.js";
import dateformat from "dateformat";
import User from "../models/user.js";

export default (router) => {
  // router.get('/login', async (req, res, next) => {
  //   res.render('login')
  // })

  // req.session.destroy((err) => {
  //   res.redirect('/') // will always fire after session is destroyed
  // })

  ///////////////////////////////
  //GENERAL Reg, LOGIN, PROFILE//
  ///////////////////////////////
  router.get("/register", async (req, res, next) => {
    if (req.session.userid) return res.redirect("/");

    res.render("pages/registration", {});
  });
  router.post("/register", async (req, res, next) => {
    if (req.session.userid) return res.redirect("/");

    const { name, email_address, password, location, type } = req.body;
    if (req.body.type) {
      User({
        name,
        email_address,
        password,
        location,
        type: "Merchant",
      }).save();
    } else {
      User({
        name,
        email_address,
        password,
        location,
        type: "Customer",
      }).save();
    }
    res.redirect("/login");
  });
  router.get("/login", async (req, res, next) => {
    if (req.session.userid) return res.redirect("/");

    res.render("pages/login", {});
  });
  router.post("/login", async (req, res, next) => {
    if (req.session.userid) return res.redirect("/");

    const { email, password } = req.body;
    const user = await User.findOne({ email_address: email });

    if (user) {
      if (user.password === password) {
        req.session.userid = user.id;
        req.session.name = user.name;
        req.session.email_address = user.email_address;
        req.session.location = user.location;
        req.session.type = user.type;

        if (user.type === "Merchant") res.redirect("/merchant-dashboard");
        else if (user.type === "Admin") res.redirect("/admin-manage");
        else res.redirect("/");
      }
    } else {
      res.render("pages/login", { error: "Wrong Email or Password" });
    }
  });

  router.get("/logout", async (req, res, next) => {
    if (!req.session.userid) return res.redirect("/login");

    req.session.destroy();
    return res.redirect("/login");
  });

  ///////Profiles///////

  router.get("/profile", async (req, res, next) => {
    if (!req.session.userid) return res.redirect("/login");
    const { name, email_address, location, type } = req.session;

    res.render("pages/profile", { name, type, email_address, location });
  });

  router.get("/merchant-profile", async (req, res, next) => {
    if (!req.session.userid) return res.redirect("/login");
    const { name, email_address, location, type } = req.session;

    res.render("pages/merchantProfile", {
      name,
      type,
      email_address,
      location,
    });
  });

  ///////////////////////////////
  /////////ADMIN STUFF///////////
  ///////////////////////////////
  // router.get("/login", async (req, res, next) => {
  //   res.render("pages/adminLogin", {});
  // });
  // router.post("/login", async (req, res, next) => {
  //   if (req.session.userid) return res.redirect("/");

  //   const { email, password } = req.body;
  //   const user = await User.findOne({ email_address: email });

  //   if (user) {
  //     if (user.password === password) {
  //       req.session.userid = user.id;
  //       req.session.name = user.name;
  //       req.session.email_address = user.email_address;
  //       req.session.location = user.location;
  //       req.session.type = user.type;

  //       if (user.type === "Admin") res.redirect("/admin-manage");
  //       else res.redirect("/");
  //     }
  //   } else {
  //     res.render("/login", { error: "Wrong Email or Password" });
  //   }
  // });
  router.get("/admin-manage", async (req, res, next) => {
    if (!req.session.userid) return res.redirect("/login");
    const spacesCreated = await Space.find({
      created_by: { $nin: [null, ""] },
      status: { $eq: "Pending" },
    });
    // console.log(
    //   "🚀 ~ file: index.js ~ line 86 ~ router.get ~ spacesCreated",
    //   spacesCreated
    // );
    res.render("pages/adminManage", { spacesCreated, dateformat });
  });

  ///////////////////////////////
  ////////MERCHANT STUFF/////////
  ///////////////////////////////
  router.get("/postparking", async (req, res, next) => {
    if (!req.session.userid) return res.redirect("/login");
    res.render("pages/postParking", {});
  });
  router.post("/postparking", async (req, res, next) => {
    if (!req.session.userid) return res.redirect("/login");
    const { name, address, location, img, price } = req.body;

    Space({
      name,
      created_by: req.session.name,
      img,
      address,
      price,
      location,
    }).save();

    res.redirect("/merchant-dashboard");
  });
  router.get("/parkingSpotM", async (req, res, next) => {
    if (!req.session.userid) return res.redirect("/login");
    const spacesBooked = await Space.find({
      payment_method: { $nin: [null, ""] },
    });
    const space = await Space.findById(req.params.id);
    res.render("pages/parkingSpotM", { space, spacesBooked, dateformat });
  });
  router.get("/parkingSpotM/:id", async (req, res, next) => {
    if (!req.session.userid) return res.redirect("/login");

    const space = await Space.findById(req.params.id);

    res.render("pages/parkingSpotM", { space, dateformat });
  });

  ///////////////////////////////
  //////CUSTOMER STUFF///////////
  ///////////////////////////////

  router.get("/parkingspot/:id", async (req, res, next) => {
    if (!req.session.userid) return res.redirect("/login");
    const space = await Space.findById(req.params.id);
    res.render("pages/parkingSpot", { space, dateformat });
  });

  router.post("/parkingspot", async (req, res, next) => {
    if (!req.session.userid) return res.redirect("/login");

    const { id } = req.body;
    await Space.findByIdAndUpdate(id, {
      rented_by: null,
      rented_time: null,
      rented_date: null,
      payment_method: null,
    });

    res.redirect("/");
  });

  router.get("/booking", async (req, res, next) => {
    if (!req.session.userid) return res.redirect("/login");
    res.render("pages/bookSpot", {});
  });

  router.get("/bookspot/:id", async (req, res, next) => {
    if (!req.session.userid) return res.redirect("/login");
    const space = await Space.findById(req.params.id);

    res.render("pages/bookSpot", { space, dateformat });
  });
  router.post("/bookspot", async (req, res, next) => {
    if (!req.session.userid) return res.redirect("/login");
    const { id, time } = req.body;

    await Space.findByIdAndUpdate(id, {
      rented_by: req.session.name,
      rented_time: time,
      rented_date: new Date(),
    });

    res.redirect("/pay/" + id);
  });
  router.get("/pay/:id", async (req, res, next) => {
    if (!req.session.userid) return res.redirect("/login");
    const space = await Space.findById(req.params.id);

    res.render("pages/pay", { space, dateformat });
  });
  router.post("/pay", async (req, res, next) => {
    if (!req.session.userid) return res.redirect("/login");
    const { id, payment_method } = req.body;

    await Space.findByIdAndUpdate(id, { payment_method });

    res.redirect("/dashboard");
  });

  ///////////////////////////////
  ////////DASHBORAD STUFF////////
  ///////////////////////////////

  router.get("/merchant-dashboard", async (req, res, next) => {
    if (!req.session.userid) return res.redirect("/login");
    const spacesCreated = await Space.find({
      created_by: req.session.name,
      status: "Approved",
    });
    const spacesBooked = await Space.find({
      payment_method: { $nin: [null, ""] },
    });

    res.render("pages/merchantDash", {
      spacesCreated,
      spacesBooked,
      dateformat,
    });
  });

  router.post("/change-status", async (req, res, next) => {
    const { id, status } = req.body;

    if (status === "Approved") {
      await Space.findByIdAndUpdate(id, { status: status });
    } else {
      await Space.findByIdAndDelete(id);
    }

    return res.redirect("/admin-manage");
  });

  router.get("/dashboard", async (req, res, next) => {
    if (!req.session.userid) return res.redirect("/login");
    const { search, location } = req.query;

    let params = {
      name: { $regex: new RegExp(search, "i") },
      location: { $regex: new RegExp(search, "i") },
    };
    Object.keys(params).forEach((key) => {
      if (params[key] === undefined) {
        delete params[key];
      }
    });
    console.log(params);
    const spacesAvail = await Space.find({
      rented_by: { $in: [null, ""] },
      ...params,
    });
    const spacesBooked = await Space.find({
      payment_method: { $nin: [null, ""] },
      rented_by: req.session.name,
    });

    res.render("pages/dashboard", { spacesAvail, spacesBooked, dateformat });
  });

  router.get("/", async (req, res, next) => {
    if (!req.session.userid) return res.redirect("/login");
    res.redirect("/dashboard");
  });
};
