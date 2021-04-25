require('dotenv').config()

const {
  GOOGLE_APP_ID,
} = process.env

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(GOOGLE_APP_ID);

/**
 * 
 * @param {string} id_token 
 * @returns 
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

module.exports = {
  getGoogleUserID
}