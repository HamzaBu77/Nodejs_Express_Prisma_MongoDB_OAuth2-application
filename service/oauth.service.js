const OAuth2 = require('simple-oauth2');
const Config = require('../config/oauth.config.js');
const DotEnv = require('dotenv');
DotEnv.config();

function getOAuthClient(client_id) {
  console.log('In getOAuthClient');
  return new OAuth2.ResourceOwnerPassword({
    client: { id: client_id, secret: process.env.CLIENT_SECRET },
    auth: {
      tokenHost: Config.oAuthConfig.oauth.tokenHost,
      tokenPath: '/auth/token',
    },
  });
}

async function getToken(username, password, client_id) {
  try {
    console.log('Parameters in getToken', username, password, client_id);
    const oauth2 = getOAuthClient(client_id, process.env.CLIENT_SECRET);
    console.log('OAuth2 in get Token', oauth2);
    const tokenConfig = {
      username,
      password,
      scope: 'read write',
    };
    if (!tokenConfig) {
      throw new Error({ error: 'tokenconfig failed' });
    }
    console.log(1);

    const result = await oauth2.getToken(tokenConfig, { json: true });
    console.log('Result in GetToken', result);
    return result.token;
  } catch (error) {
    console.error(
      'Error obtaining token:',
      error.response ? error.response.data : error.message
    );

    throw new Error(error.message);
  }
}

module.exports = { getToken };
