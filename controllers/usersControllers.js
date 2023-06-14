const users = require("../models/schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function jwtTokens({ user_name, user_email, user_type }) {
  const user = { user_name, user_email, user_type };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  return accessToken;
}

const getData = async (req, res) => {
  try {
    const user = await users.find();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (authHeader == "Bearer null") return res.json({ error: "Null token" });
  const user = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) return res.json({ error: "invalid token" });
      req.role = decoded.user_type;
      next()
      // res.json(req.role);
    }
  );
};

const login = async (req, res) => {
  try {
    const password = req.body.password;
    const email = req.body.email;
    // email check
    const user = await users.findOne({ user_email: email });
    if (user === null) {
      return res.json({ error: "Email is incorrect" });
    }
    // password check
    const validpassword = await bcrypt.compare(password, user.user_password);
    if (!validpassword) {
      return res.json({ error: "incorrect password" });
    }
    //JWT
    res.json(user.user_token);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addNewUser = async (req, res) => {
  try {
    const { name, email, password, type } = req.body;
    const token = jwtTokens({
      user_name: name,
      user_email: email,
      user_type: type,
    });
    const hashedPwd = await bcrypt.hash(password, 10);
    // email check
    const user = await users.findOne({ user_email: email });
    if (user !== null) {
      return res.json({ error: "email already exists try another one" });
    }
    const newAccount = new users({
      user_name: name,
      user_email: email,
      user_password: hashedPwd,
      user_type: type,
      user_token: token,
    });
    const newUser = await newAccount.save();
    res.status(200).json(newUser.user_token);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getData,
  login,
  addNewUser,
  verifyToken,
};
