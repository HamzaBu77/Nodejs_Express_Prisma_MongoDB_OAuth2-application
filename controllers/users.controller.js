const Joi = require('../Validation/users.validation.js');
const Prisma = require('prisma/prisma-client');
const Bcrypt = require('bcrypt');

const signUp = async (req, res) => {
  try {
    const prisma = new Prisma.PrismaClient();
    const body = req?.body;
    const { error: bodyValidation } = Joi.createUser.validate(body);
    if (bodyValidation) {
      return res.status(400).send({
        Error: bodyValidation.details
          ? bodyValidation.details[0].message
          : bodyValidation.message,
      });
    }
    const userAlreadyExist = await prisma.User.findUnique({
      where: { email: body?.email },
    });
    if (userAlreadyExist) {
      return res
        .status(400)
        .send({ Error: 'User already exist with the email address.' });
    }
    body.password = await Bcrypt.hash(body?.password, 10);
    console.log('Body', body);
    const user = await prisma.User.create({ data: body });
    return res.status(201).send({
      message: 'User created Succsessfully!',
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Internal server error',
      Error: error.message,
    });
  }
};

module.exports = { signUp };
