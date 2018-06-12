const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  tracking_items: [
  ],

  price_alert_items: [
    {
      objectid: { type: Number },
      aim_price: { type: Number },
      name: { type: String }
    }
  ]
})

/* mongodb atlas */
var uri = 'mongodb://user_dice:csc309a3@dice-shard-00-00-6zjil.mongodb.net:27017,dice-shard-00-01-6zjil.mongodb.net:27017,dice-shard-00-02-6zjil.mongodb.net:27017/test?ssl=true&replicaSet=Dice-shard-0&authSource=admin'

mongoose.connect(uri, (error) => {
  if (error) console.log(error)
  console.log('Database connection successful')
})

const UserModel = mongoose.model('Users', UserSchema)

module.exports = UserModel
