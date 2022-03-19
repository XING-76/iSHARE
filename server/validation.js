const Joi = require("joi");

// SignUp Validation
const signupValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(6).max(50).required().email(),
    password: Joi.string().min(6).max(255).required(),
    role: Joi.string().required().valid("creator", "administrator")
  })

  return schema.validate(data);
}

// SignIn Validation
const signinValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(50).required().email(),
    password: Joi.string().min(6).max(255).required()
  })

  return schema.validate(data);
}

const pinValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(6).max(50).required(),
    description: Joi.string().min(6).max(300).required(),
    destinationLink: Joi.string().allow(''),
    imgUrl: Joi.string().allow(''),
    category: Joi.string().required().valid(
      "Cars", "Food", "Nature", "Travel", "Art", "Sport", "Fitness", "Animals", "Others"
    ),
  })

  return schema.validate(data);
}

module.exports.signupValidation = signupValidation; 
module.exports.signinValidation = signinValidation;
module.exports.pinValidation = pinValidation;