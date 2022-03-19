const router = require("express").Router();
const signupValidation = require('../validation').signupValidation;
const signinValidation = require('../validation').signinValidation;
const User = require('../models').userModel;
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
  console.log("A request is coming into auth.js");
  next();
})

router.get('/profile/:user_id', (req, res) => {
  const { user_id } = req.params;
  User.findOne({ _id: user_id })
    .then(user => res.send(user))
    .catch(() => res.status(500).send("Cannot get user data"))
})

router.post('/google', async (req, res) => {
  const { googleId, imageUrl, email, name } = req.body;
  
  try {
    User.findOne({ email }, async function (err, user) {
      if(err) return res.status(400).send(err);
      if(!user) {
        new User({
          username: name,
          password: googleId,
          email,
          googleID: googleId,
          thumbnail: imageUrl,
          role: "creator"
        })
          .save()
          .then((newUser) => {
            const tokenObj = { _id: newUser._id, email: newUser.email };
            const token = jwt.sign(tokenObj, process.env.PASSPORT_SECRET);
            res.status(200).send({
              success: true,
              token: "JWT " + token,
              user: newUser,
              msg: "Sign In successfully!"
            })
          })
      } else {
        user.comparePassword(googleId, function (err, isMatch) {
          if(err) return res.status(400).send(err);
          if(isMatch) {
            const tokenObj = { _id: user._id, email: user.email };
            const token = jwt.sign(tokenObj, process.env.PASSPORT_SECRET);
            res.status(200).send({
              success: true,
              token: "JWT " + token,
              user,
              msg: "Sign In successfully!"
            })
          } else {
            res.status(401).send("Wrong user");
          }
        })
      }
    })
  } catch (err) {
    res.status(400).send("User not saved");
  }
})

router.post('/signup', async (req, res) => {
  // check the validation of data
  const { error } = signupValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  // check if the user exist
  const emailExist = await User.findOne({ email: req.body.email });
  if(emailExist) res.status(400).send("Email has already been registered.");

  // register the user
  const newUser = new User({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    role: req.body.role
  })
  try {
    await newUser.save();
    res.status(200).send({
      title: "Sign Up succeeds!",
      text: "Please try sign in with your new account"
    });
  } catch (err) {
    res.status(400).send("User not saved");
  }
})

router.post('/signin', (req, res) => {
  const { error } = signinValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  User.findOne({ email: req.body.email }, function (err, user) {
    if(err) res.status(400).send(err);
    if(!user) {
      res.status(401).send("User not found");
    } else {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if(err) return res.status(400).send(err);
        if(isMatch) {
          const tokenObj = { _id: user._id, email: user.email };
          const token = jwt.sign(tokenObj, process.env.PASSPORT_SECRET);
          res.status(200).send({
            success: true,
            token: "JWT " + token,
            user,
            msg: "Sign In successfully!"
          })
        } else {
          res.status(401).send("Wrong password");
        }
     })
    }
  })

})


module.exports = router;