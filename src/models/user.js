import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email_address: {
    type: String,
  },
  password: {
    type: String,
  },
  location: {
    type: String,
  },
  type: {
    type: String,
  },
});

const user = mongoose.model("user", userSchema);

export default user;
