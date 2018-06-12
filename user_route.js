const Users = require('./user')
const track = require('./track')

/* User login, logout and signin */

exports.addUser = function (request, response) {
  console.log('Now Create the following User Data: \n')
  console.log(request.body)

  if (!request.body.email || !request.body.username || !request.body.password){
    response.render('./signin', {flag: {checkerror: true, miss: true, repeated: false} });
  }

  else {

    if (request.body.email && request.body.username && request.body.password){
      Users.find({email: request.body.email}, function(error, repeat_email){

        if (repeat_email.length > 0){
          response.render('./signin', {flag: {checkerror: true, miss: false, repeated: true} })
        }

        else{
          var newUser = new Users(request.body)
          newUser.save(function(error, users){
            if (error) { console.log(error) }

            else {
              console.log('Successfully Create the data')
              console.log(users._id);
              response.render('./mainpage', { user: users })
            }
          })
        }
      })
    }

  }

}


exports.logout = function (request, response) {
  console.log('Now User' + request.params._id + 'is logout \n')

  response.clearCookie(request.params._id)
  response.render('./login', {flag: {checkerror: false} })

}

exports.login = function (request, response) {
  console.log('Now User is login in with following data: \n')
  console.log({ email: request.body.email, password: request.body.password })

  /* cases where users directly sign in to mainpage */
  if (Object.keys(request.cookies).length != 0) {
    handle_cookie(request, response)
  }

  /* normal login in */
  else {

    Users.find(request.body, function (error, users) {

      console.log('users:', users)

      if (users.length > 0) {
        response.cookie(users[0]._id, users[0].username, { maxAge: 720000 })
        response.render('./mainpage', { user: users[0] })
      }

      else {

        console.log('Wrong Email/Password')
        response.render('./login', {flag: {checkerror: true} })
      }

    })
  }

}

function handle_cookie (request, response) {

  var key = Object.keys(request.cookies)[0]
  console.log(key)

  Users.find({ _id: key }, function (error, users) {
    response.render('./mainpage', { user: users[0] })
  })
}

/* tracking Items */

exports.findTracking = function (request, response) {
  console.log('Get user ' + request.params._id + ' tracking page\n')
  //console.log(request.params._id)

  Users.find({ _id: request.params._id }, function (error, users) {
      if (error) console.log(error)
      response.render('./tracking', { user: users[0] })
  })

}


exports.deleteTracking = function(request, response) {

  // console.log('Get user ' + request.params.Itemid + ' deleteTracking\n')

  Users.find({ _id: request.params._id }, function (err, users) {
      if (err) console.log(err)

      let new_trackinglist = users[0].tracking_items.remove(request.params.Itemid);
      users[0].tracking_items = new_trackinglist;

      users[0].save(function(error, newuser){
        if (error) console.log(error)
        response.render('./tracking', { user: newuser })

      })

  })


}
exports.addTracking = function (request, response) {
  const item = request.body

  Users
    .findOneAndUpdate({ _id: request.params._id }, {
    $addToSet: {
      tracking_items: item.objectid
    }
  })
  .then(() => {
    response.json({
      message: 'success',
    })
  })
}

exports.deleteAlert = function (request, response) {
  const item = request.body

  Users
    .findOneAndUpdate({ _id: request.params._id }, {
      $pull: {
        price_alert_items: { objectid: item.objectid }
      }
    })
    .then(() => {
      response.json({
        message: 'success',
      })
    })
}

exports.addAlert = function (request, response) {
  const item = request.body

  Users.findOne({ _id: request.params._id })
    .then(user => {
      const alertItems = user.price_alert_items
      const exist = alertItems.find(alertItem => alertItem.objectid === item.objectid)

      if (exist) {
        response.json({
          message: 'Failed, already exist'
        })
        return
      }

      Users.findOneAndUpdate({ _id: request.params._id }, {
        $push: {
          price_alert_items: item
        }
      })
        .then(user => {
          response.json({
            message: 'success'
          })
        })
    })
}

exports.renderSetAlert = function (request, response) {
  Promise
    .all([Users.findOne({ _id: request.params._id }), track.fetchList()])
    .then(([user, list]) => {
      response.render('pricealert', {
        user: user,
        list: list
      })
      console.log(user)
    })
}



exports.renderSearch = function (request, response) {
  //response.render('search')
  Users.find({ _id: request.params._id }, function (error, users) {
    console.log(users);

    if (error) console.log(error)
    response.render('./search', { user: users[0] })
  })
}


exports.handle_cookie = handle_cookie
