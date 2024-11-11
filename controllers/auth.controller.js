const JWT = require('jsonwebtoken');
const OAuthService = require('../service/oauth.service.js');
const Joi = require('../Validation/users.validation.js');
const Bcrypt = require('bcrypt');
const Prisma = require('prisma/prisma-client');
const DotEnv = require('dotenv');
const { json } = require('express');
DotEnv.config();

const signUp = async (req, res) => {
  try {
    const prisma = new Prisma.PrismaClient();
    const body = req?.body;
    const { error: signUpValidation } = Joi.createUser.validate(body);
    if (signUpValidation) {
      return res.status(400).send({
        Error: signUpValidation.details
          ? signUpValidation.details[0].message
          : signUpValidation.message,
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

const login = async (req, res) => {
  try {
    const body = req?.body;
    const { error: loginValidation } = Joi.userLogin.validate(body);
    if (loginValidation) {
      return res.status(400).send({
        error: loginValidation.details[0].message,
      });
    }
    const prisma = new Prisma.PrismaClient();
    const user = await prisma.User.findUnique({
      where: { email: body?.email },
    });
    console.log('User', user);
    if (!user) {
      return res
        .status(400)
        .send({ Error: 'Inavlid credentials, check your email or password.' });
    }
    const matchPassword = await Bcrypt.compare(body?.password, user.password);
    if (!matchPassword) {
      return res
        .status(400)
        .send({ error: 'Inavlid credentials, check your email or password.' });
    }
    const oauthToken = await OAuthService.getToken(
      user.email,
      body?.password,
      process.env.CLIENT_ID,
      { json: true }
    );
    console.log('OAuthToken', oauthToken);

    const jwtToken = JWT.sign(
      { id: user.id, email: user.email, scope: oauthToken.scope },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).send({
      message: 'Login Successfully',
      data: { data: user, jwtToken, accessToken: oauthToken.data },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

const userDetails = (req, res) => {
  console.log('I am calling from userDetails');
  res.send({ data: req?.token });
};

module.exports = { login, signUp, userDetails };
