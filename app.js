const Dotenv = require('dotenv');
Dotenv.config();
const Express = require('express');
const UserRouter = require('./routes/users.route.js');
const AuthRouter = require('./routes/auth.route.js');

const app = Express();
const PORT = process.env.PORT;

app.use(Express.json());

app.use('/auth', AuthRouter);
app.use('/users', UserRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
