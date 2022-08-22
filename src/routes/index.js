import Space from "../models/space.js";
import dateformat from "dateformat";
import User from "../models/user.js";

export default (router) => {
  // router.get('/login', async (req, res, next) => {
  //   res.render('login')
  // })
  // router.get('/event-maker', async (req, res, next) => {
  //   res.render('eventMaker')
  // })
  // router.get('/event/:id', async (req, res, next) => {
  //   res.render('event', {})
  // })

  ///////////////////////////////
  //GENERAL Reg, LOGIN, PROFILE//
  ///////////////////////////////
  router.get("/register", async (req, res, next) => {
    if (req.session.userid) return res.redirect("/");

    res.render("pages/registration", {});
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
        else res.redirect("/");
      }
    } else {
      res.render("pages/login", { error: "Wrong Email or Password" });
    }
  });

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
  router.get("/admin-login", async (req, res, next) => {
    res.render("pages/adminLogin", {});
  });
  router.get("/admin-manage", async (req, res, next) => {
    const spacesCreated = await Space.find({ created_by: { $in: [null, ""] } });
    res.render("pages/adminManage", { spacesCreated });
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
    const { id, name, address, location, img, price } = req.body;

    await Space.findByIdAndUpdate(id, {
      created_by: name,
      img: img,
      address: address,
      location: location,
      rented_time: time,
      price: price,
      rented_date: new Date(),
    });

    res.redirect("/merchant-dashboard");
  });
  router.get("/parkingSpotM", async (req, res, next) => {
    if (!req.session.userid) return res.redirect("/login");
    const spacesBooked = await Space.find({
      payment_method: { $nin: [null, ""] },
    });

    res.render("pages/parkingSpotM", { spacesBooked, dateformat });
  });

  ///////////////////////////////
  //////CUSTOMER STUFF///////////
  ///////////////////////////////

  router.get("/parkingspot", async (req, res, next) => {
    if (!req.session.userid) return res.redirect("/login");
    const spacesBooked = await Space.find({
      payment_method: { $nin: [null, ""] },
    });

    res.render("pages/parkingSpot", { spacesBooked, dateformat });
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
    console.log(req.session.userid);
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
    // console.log("🚀 ~ file: index.js ~ line 42 ~ router.post ~ id, payment_method", id, payment_method)

    await Space.findByIdAndUpdate(id, { payment_method });

    res.redirect("/dashboard");
  });

  ///////////////////////////////
  ////////DASHBORAD STUFF////////
  ///////////////////////////////

  router.get("/merchant-dashboard", async (req, res, next) => {
    if (!req.session.userid) return res.redirect("/login");
    const spacesCreated = await Space.find({ created_by: { $in: [null, ""] } });
    const spacesBooked = await Space.find({
      payment_method: { $nin: [null, ""] },
    });

    res.render("pages/merchantDash", {
      spacesCreated,
      spacesBooked,
      dateformat,
    });
  });

  router.get("/dashboard", async (req, res, next) => {
    if (!req.session.userid) return res.redirect("/login");

    const spacesAvail = await Space.find({ rented_by: { $in: [null, ""] } });
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
