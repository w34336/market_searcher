const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const Users = require('./user_route')
const { startTrack } = require('./track')
const app = express()

startTrack()

app.use(express.static('public'))

app.use(cookieParser())
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (request, response) {
  console.log('An user now visit our homepage')
  console.log(request.cookies)

  if (Object.keys(request.cookies).length != 0) {
    Users.handle_cookie(request, response)
  } else {
    response.render('./index')
  }
})

app.route('/login')
  .get(function (request, response) {
    console.log('An user now visit our login page')
    console.log(request.cookies)

    if (Object.keys(request.cookies).length != 0) {
      Users.handle_cookie(request, response)
    }
    else {
      response.render('./login', {flag: {checkerror: false} })
    }

  })
  .post(Users.login)

app.route('/signin')
  .get(function (request, response) {
    console.log('An user now visit our signin page')
    console.log(request.cookies)

    if (Object.keys(request.cookies).length != 0) {
      Users.handle_cookie(request, response)
    }
    else {
      response.render('./signin', {flag: {checkerror: false} })
    }
  })
  .post(Users.addUser)

app.get("/user/:_id/pricealert", Users.renderSetAlert);
app.get("/user/:_id/search", Users.renderSearch);
app.post("/user/:_id/pricealert", Users.addAlert);
app.delete("/user/:_id/pricealert", Users.deleteAlert);

app.post("/user/:_id/tracking", Users.addTracking);
app.get("/user/:_id/tracking", Users.findTracking);
app.post("/user/:_id/tracking/:Itemid", Users.deleteTracking);

app.post('/user/:_id', Users.logout)

var port = process.env.PORT || 5000
app.listen(port, () => console.log('Successfully Create a server on Port' + port))
