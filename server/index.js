const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require('./routes').auth;
const pinRoute = require('./routes').pin;
const passport = require("passport");
require('./config/passport')(passport);
const cors = require("cors");

const PORT = process.env.PORT || 8080;

// connect to DB
mongoose.connect(process.env.DB_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() =>  console.log("Connect to mongodb atlas"))
  .catch((e) => console.log(e))


// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/auth', authRoute);
app.use('/api/pins', passport.authenticate("jwt", { session: false }), pinRoute);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));