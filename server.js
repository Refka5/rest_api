require("dotenv").config({ path: __dirname + "/config/.env" });
const express = require("express");
const PORT = process.env.PORT || 5000;
const User = require("./models/User");
const connectDatabase = require("./config/database");

connectDatabase();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/user", async (req, res) => {
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

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
