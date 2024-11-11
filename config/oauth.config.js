const oAuthConfig = {
  oauth: {
    tokenHost: 'http://localhost:4000',
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  },
  jwtSecret: process.env.JWT_SECRET, // Secret for signing JWTs
};

const userScopes = ['user:Post', 'user:GET', 'user:Patch', 'user:Delete'];
const taskScopes = ['task:Post', 'task:GET', 'task:Patch', 'task:Delete'];
const adminScopes = ['admin:Post', 'admin:GET', 'admin:Patch', 'admin:Delete'];

module.exports = { oAuthConfig, userScopes, taskScopes, adminScopes };
