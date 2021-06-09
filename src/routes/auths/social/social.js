const { 
  verify
} = require("../../../lib");
require('dotenv').config()

const verifyToken = async (req, res) => {
  try {
    const ret = await verify(req.params.code);
    res.json(ret); 
  } catch (error) {
    console.error('id token verification failed')
    res.sendStatus(401)
  }
}

module.exports={
  verifyToken
}