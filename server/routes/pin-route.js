const router = require("express").Router();
const pinValidation = require('../validation').pinValidation;
const Pin = require('../models').pinModel;

router.use((req, res, next) => {
  console.log("A request is coming into api...");
  next();
})

router.get('/', (req, res) => {
  Pin.find({}).populate("creator", ["username", "thumbnail"])
    .then(pin => res.status(200).send(pin))
    .catch(() => res.status(500).send("Error! Cannot get pin"))
})

router.get('/:pinID', (req, res) => {
  const { pinID } = req.params;
  Pin.findOne({ _id: pinID })
    .populate("creator", ["username", "thumbnail"])
    .then(pin => res.status(200).send(pin))
    .catch((e) => res.status(400).send(e))
})

router.get('/profile/:_creator_id', (req, res) => {
  const { _creator_id } = req.params;
  Pin.find({ creator: _creator_id })
    .populate("creator", ["username", "thumbnail"])
    .then(pin => res.status(200).send(pin))
    .catch((e) => res.status(500).send(e))
})

router.get('/category/:category', (req, res) => {
  const { category } = req.params;
  Pin.find({ category })
    .populate("creator", ["username", "thumbnail"])
    .then(pin => res.status(200).send(pin))
    .catch((e) => res.status(500).send(e))
})

router.get('/saved/:_user_id', (req, res) => {
  const { _user_id } = req.params;
  Pin.find({ saved: _user_id })
    .populate("creator", ["username", "thumbnail"])
    .then(savedPins => res.status(200).send(savedPins))
    .catch(() => res.status(500).send("Cannot get data"))
})


router.post('/', async (req, res) => {
  const { title, description, destinationLink, category, imgUrl } = req.body;
  const newPin = new Pin({
    title, description, destinationLink, category, imgUrl, creator: req.user._id
  });
  try {
    await newPin.save();
    res.status(200).send("New pin has been created");
  } catch (err) {
    res.status(400).send("Fail, cannot create pin");
  }
})

router.post('/pinverify', (req, res) => {
  // validate the inputs before making a new course
  const { error } = pinValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  res.status(200).send("Form Data is OK");
})

router.post("/saved", async (req, res) => {
  const { _id, user_id } = req.body;

  try {
    const pin = await Pin.findOne({ _id });
    // check if already saved
    const alreadySaved = pin.saved.find(result => result === user_id);
    if(!alreadySaved) {
      pin.saved.push(user_id);
      await pin.save();
      res.status(200).send("Save successfully");
    } else {
      res.status(200).send("Already saved");
    }
  } catch (err) {
    res.send(err);
  }
});

router.post('/search', (req, res) => {
  const { search_input } = req.body;
  const searchInput = new RegExp(search_input, 'i');
  Pin.find({
    $or: [
      { title: { $regex: searchInput } },
      { category: { $regex: searchInput } }
    ]
  })
    .populate("creator", ["username", "email"])
    .then(pin => res.status(200).send(pin))
    .catch((err) => res.send(err))
})

router.post('/comment', async (req, res) => {
  const { pin_id, comment } = req.body;

  try {
    const pin = await Pin.findOne({ _id: pin_id });
    pin.comments.push({
      _id: req.user._id,
      username: req.user.username,
      thumbnail: req.user.thumbnail,
      comment,
      date: Date.now()
    })
    await pin.save();
    res.status(200).send("Post successfully");
  } catch (err) {
    res.send(err);
  }
  
})

router.delete('/saved', async (req, res) => {
  const { pin_id } = req.body;

  try {
    let pin = await Pin.findOne({ _id: pin_id });

    if (!pin) {
      res.status(404).send("Pin not found")
    }
    // delete user
    const deleteSaved = pin.saved.filter(deleteUser => deleteUser !== req.user._id.toString());
    pin.saved = deleteSaved;
    await pin.save();
    res.status(200).send("Delete successfully");
  } catch (err) {
    res.send(err);
  }

})

module.exports = router;