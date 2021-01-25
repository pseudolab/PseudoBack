const router = require('express').Router();
const messages = require('@db/messages')

router.get('/messages', (req, res) => {
  messages.getAll().then((messages) => {
      res.json(messages);
  });
}); 

router.post('/messages', (req, res) => {
  console.log(req.body);
  messages.create(req.body).then((message) => {
      res.json(message);
  }).catch((error) => {
      res.status(500);
      res.json(error);
  });
});

module.exports=router