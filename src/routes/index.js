import Space from '../models/space.js';

export default router => {
  // router.get('/login', async (req, res, next) => {
  //   res.render('login')
  // })
  // router.get('/event-maker', async (req, res, next) => {
  //   res.render('eventMaker')
  // })
  // router.get('/event/:id', async (req, res, next) => {
  //   res.render('event', {})
  // })
  router.get('/register', async (req, res, next) => {
    res.render('pages/registration', {})
  })
  router.get('/login', async (req, res, next) => {
    res.render('pages/login', {})
  })
  router.get('/admin/login', async (req, res, next) => {
    res.render('pages/adminEntry', {})
  })
  router.get('/admin', async (req, res, next) => {
    res.render('pages/adminManage', {})
  })
  router.get('/merchantdash', async (req, res, next) => {
    res.render('pages/merchantDash', {})
  })
  router.get('/postparking', async (req, res, next) => {
    res.render('pages/postSpace', {})
  })
  router.get('/pay', async (req, res, next) => {
    res.render('pages/pay', {})
  })
  router.get('/parkingspot', async (req, res, next) => {
    res.render('pages/parkingSpot', {})
  })
  router.get('/parkingSpotM', async (req, res, next) => {
    res.render('pages/parkingSpotM', {})
  })
  router.get('/booking', async (req, res, next) => {
    res.render('pages/bookSpot', {})
  })
  // 
  // 
  // 
  router.get('/bookspot/:id', async (req, res, next) => {
    const space = await Space.findById(req.params.id)

      res.render('pages/bookSpot', {space})
  })
  router.post('/bookspot', async (req, res, next) => {
    const {id, time, user} = req.body

    await Space.findByIdAndUpdate(id, {rented_by: user, rented_time: time, rented_date: new Date()})
    
    res.redirect('/pay')
  })
  // 
  // 
  // 
  router.get('/dashboard', async (req, res, next) => {
    const spaces = await Space.find()

    res.render('pages/dashboard', { spaces })
  })
  router.get('/home', async (req, res, next) => {
    const spaces = await Space.find()

    res.render('pages/dashboard', { spaces })
  })
}
