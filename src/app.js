const express = require("express");
const { engine } = require("express/lib/application");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


require("./db/conn");

const Register = require("./models/registers");

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Creating a new user in db

app.post("/register", async (req, res) => {
  try {
    const password = req.body.psw;
    const cpassword = req.body.repeatpsw;

    if (password === cpassword) {
      const registerUser = new Register({
        name: req.body.name,
        email: req.body.email,
        psw: password,
        repeatpsw: cpassword,
      });

      const registered = await registerUser.save();

      return res.status(200).json({ message: "User added successfully" });
    } else {
      res.send("Password is not matching");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

// Login check

app.post("/login", async (req, res) => {
  try {
    const username = req.body.name;
    const password = req.body.psw;

    const usereinput = await Register.findOne({ name: username });

    const isMatch = await bcrypt.compare(password, usereinput.psw);

    if (isMatch) {
      return res.status(200).json({ message: "Loggedin Successfully" });
    } else {
      res.send({message: "Invalid Username/Password"});
    }
  } catch (error) {
    res.status(400).send("Invalid Username/Password");
  }
});

// Forgot Password

app.post("/login/forgotpassword", async (req, res) => {
  try {
    const username = req.body.name;
    const useremail = req.body.email;
    const password = req.body.psw;
    const cpassword = req.body.repeatpsw;
    
    const usereinput = await Register.findOne({
      name: username,
      email: useremail,
    });

    if (password === cpassword) {
      const pas = await bcrypt.hash(password, 10);
      const data = await Register.updateOne({ email: useremail }, { $set: { psw: pas } });
      return res.status(200).json({ message: `Updated Successfully ${data}` });
    } else {
      res.send("Password is not matching");
    }
  } catch (error) {
    res.status(400).send("Invalid Username/Password");
  }
});

app.listen(port, () => {
  console.log(`The app is running at port ${port}`);
});
