const Joi = require('joi');

const createUser = Joi.object({
  firstName: Joi.string().min(3).max(30).optional(),
  lastName: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string()
    .pattern(/(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_])/)
    .min(8)
    .required()
    .error((errors) => {
      return errors.map((err) => {
        return new Joi.ValidationError(
          'Invalid password format. Password must have one number, one alphabet, one special character and at least 8 character long.',
          err.details,
          err
        );
      });
    }),
});

const userLogin = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().min(8).required(),
});

module.exports = { createUser, userLogin };
