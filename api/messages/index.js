const router = require('express').Router();
const messages = require('@db/messages');

router.get('/messages', (req, res) => {
  messages.getAll().then((message) => {
      const fs = require('fs');

      message.map((value,index,array)=>{
          const filename = value['content'];
          try{
              const content = fs.readFileSync(filename).toString();
              value['content'] = content;
          } catch(error){

          }

      res.json(message);
    });
  })
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

module.exports=router;