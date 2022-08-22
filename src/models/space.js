import mongoose from "mongoose";

const spaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  location: {
    type: String,
  },
  price: {
    type: Number,
  },
  img: {
    type: String,
  },
  created_by: {
    type: String,
  },
  rented_by: {
    type: String,
  },
  rented_time: {
    type: String,
  },
  rented_date: {
    type: Date,
  },
  payment_method: {
    type: String,
  },
  status: {
    type: String,
    default: "Pending",
  },
});

// "name": "Sonargaon Hotel",
// "address": "07 Kazi Nazrul Islam Ave, Dhaka 1215",
// "location": "Dhaka",
// "price": "50",
// "img": "https://live.staticflickr.com/7332/12494310994_41a4f65fc0_b.jpg",
// "created_by": "Abdul",
// "rented_by": "Kareem",
// "rented_date": "1/1/2000",
// "payment_method": "Bkash"

const space = mongoose.model("space", spaceSchema);

export default space;
