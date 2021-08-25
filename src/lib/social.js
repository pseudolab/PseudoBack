const config = require('config');

const GOOGLE_APP_ID = config.get('GOOGLE_APP_ID');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(GOOGLE_APP_ID);

/**
 * 
 * @param {string} id_token 
 * @returns {string}
 */
async function getGoogleUserID(id_token) {
  const ticket = await client.verifyIdToken({
    idToken: id_token,
    audience: GOOGLE_APP_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  return userid;
}

async function getGoogleUserInfo(id_token) {
  const ticket = await client.verifyIdToken({
    idToken: id_token,
    audience: GOOGLE_APP_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();

  // console.info('PAYLOAD', payload)
  return {
    username: payload.name || payload.given_name,
    email: payload.email,
    picture: payload.picture,
    userid: payload.sub,
    photo: payload.picture || ''
  };
}

module.exports = {
  getGoogleUserID,
  getGoogleUserInfo
}