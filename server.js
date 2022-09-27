require("dotenv").config({ path: __dirname + "/config/.env" });
const express = require("express");
const PORT = process.env.PORT || 5000;
const User = require("./models/User");
const connectDatabase = require("./config/database");
const { application } = require("express");

connectDatabase();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/users", async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "user already exist" });
    }
    user = new User({
      fullName,
      email,
      password,
    });
    await user.save();
    res.status(200).json({ msg: "user creation success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server error" });
  }
  //   console.log(req.body);
  res.json(req.body);
});
//Get All users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) return res.json({ msg: "No user found" });
    res.send(users);
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
});

//Get one user
//app.get("/api/users/:id", async (req, res) => {
// const id = req.params.id;

// try {
// let fetchedUser = await Usermodel.findById(id);
//console.log(fetchedUser);

//res.send(fetchedUser);
// } catch (error) {
//   res.status(500).send({ message: "not found" });
// }
//});
// Edit user
app.put("/api/users/:id", async (req, res) => {
  const id = req.params.id;
  try {
    let user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!user) return res.status(404).send({ msg: "user not found" });
    res.send(user);
  } catch (error) {
    console.log(error);
  }
});

// Delete user by id
app.delete("/api/users/:id", async (req, res) => {
  const id = req.params.id;
  try {
    let deleteUser = await User.findByIdAndDelete(id);
    if (!deleteUser) return res.status(404).send({ msg: "user not found" });
    res.send(deleteUser);
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
