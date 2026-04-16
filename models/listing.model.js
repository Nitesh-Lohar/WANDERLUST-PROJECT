const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.model.js");

const DefaultImg= "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

const listingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  image: {
    url: {
      type: String,
      default: DefaultImg,
      set: (v) => v === "" ? DefaultImg : v,
    },
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:'Review',
    }
  ]
});

listingSchema.post("findOneAndDelete", async (listing)=>{
  if(listing){
    console.log("Deleting Reviews...");
    await Review.deleteMany({_id:{$in:listing.reviews}})
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
