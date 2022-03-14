const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserRegisterSchema = new mongoose.Schema({
  name: {
    type: String,
    Unique: true,
    required: true,
  },
  email: {
    type: String,
    Unique: true,
    required: true,
  },
  psw: {
    type: String,
    required: true,
  },
  repeatpsw: {
    type: String,
    required: true,
  },
});

// Hashing

UserRegisterSchema.pre("save", async function(next) {
  if (this.isModified("psw")) {
    this.psw = await bcrypt.hash(this.psw, 10);
    this.repeatpsw = undefined;
  }
  next();
});

// collections

const Register = new mongoose.model("Register", UserRegisterSchema);

module.exports = Register;
