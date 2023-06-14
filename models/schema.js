// const mongoose = require("mongoose");
// const Schema = mongoose.Schema

// const newcol = new Schema({
//     name:{
//         type:String
//     },
//     age:{
//         type:Number
//     }
// })

// module.exports = mongoose.model('newcol', newcol);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const users = new Schema(
  {
    user_name: {
      type: String,
      required: true,
    },
    user_email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    user_password: {
      type: String,
      required: true
    },
    user_type: {
      type: String,
      required: true,
    },
    user_token:{
      type: String,
      required: true,
    }
  },
  { timestamp: true }
);

module.exports = mongoose.model("users", users);
