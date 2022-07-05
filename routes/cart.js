const mongoose =require('mongoose')

const cartModel = mongoose.Schema({
    productname:String,
    productimage:String,
    productprice:String,
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
});

module.exports = mongoose.model("cart",cartModel);