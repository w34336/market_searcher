const axios = require('axios')
const UserModel = require('./user')
const nodemailer = require('nodemailer')
const _ = require('lodash')

function startTrack () {
  track()
  setInterval(() => {
    track()
  }, 1000 * 60 * 15)
}

function track () {
  UserModel
    .find({})
    .then(users => users.filter(u => u.price_alert_items.length !== 0))
    .then(users => {
      fetchList()
        .then(list => {
          const emailMap = {}
          users.forEach(user => {
            const email = user.email
            emailMap[email] = []

            const items = user.price_alert_items
            items.forEach(item => {
              const listItem = list.find(i => i.id === item.objectid)
              emailMap[email].push(listItem)
              if (listItem.listings[0].price <= item.aim_price) {
                emailMap[email].push(listItem)
              }
            })
          })
          sendEmail(emailMap)
        })
    })
}

exports.startTrack = startTrack

exports.fetchList = fetchList
exports.fetchPicList = fetchPicList

function sendEmail (emailMap) {
  const shouldSend = Object.keys(emailMap).every(key => emailMap[key].length !== 0)
  if (!shouldSend) {
    return
  }

  Object
    .keys(emailMap)
    .forEach(email => {

      let content = ''
      const items = emailMap[email]
      items.forEach(item => {
        content += `
          <div>
            item name: ${item.name}
            <span style="margin-left: 50px;">
              currentPrice: 
              <span style="color: green;">${item.listings[0].price}</span>
            </span>
          </div>
          <hr/>
        `
      })

      send(email, content)
    })

  function send (target, content) {
    let transporter = nodemailer.createTransport({
      host: 'smtp.126.com',
      port: 25,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'dicenotice', // generated ethereal user
        pass: 'a123123' // generated ethereal password
      }
    })

    // setup email data with unicode symbols
    let mailOptions = {
      from: '"DiceNotice" <dicenotice@126.com>', // sender address
      to: target, // list of receivers
      subject: 'You aim items price is going down.', // Subject line
      html: content // html body
    }

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error)
      }
      console.log('Message sent')
    })
  }
}

let picMap = null
function fetchList () {

  if (picMap === null) {
    return fetchPicList()
      .then(fetchItemList)
  }

  return fetchItemList()
}

function fetchItemList () {
  return axios
    .get('https://api.silveress.ie/bns/v3/market/na/current/all')
    .then(response => {
      let items = response.data
      items = items.map(item => {
        item.img = picMap[item.name]
        return item
      })
      items = items.filter(item => item.img !== undefined)
      items = _.uniqBy(items, 'name')
      return items
    })
    .catch(e => {
      throw new Error('Fetch data failed')
    })
}

function fetchPicList () {
  picMap = {}
  return axios
    .get('https://api.silveress.ie/bns/v3/items')
    .then(response => {
      response.data = _.uniq(response.data)
      response.data.forEach(item => {
        picMap[item.name] = item.img
      })
      return response.data
    })
    .catch(e => {
      throw new Error('Fetch data failed')
    })
}
