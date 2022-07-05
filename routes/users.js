const mongoose =require('mongoose')
const plm = require("passport-local-mongoose")


mongoose.connect("mongodb://localhost/shop");

const userSchema = mongoose.Schema({
  username:String,
  name:String,
  password:String,
  cart:[{
   type:mongoose.Schema.Types.ObjectId,
   ref:"cart"
  }
]

})

userSchema.plugin(plm);

module.exports = mongoose.model("users",userSchema);