const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
 
const messages = require('./db/messages');
const { exception } = require('console');

const app = express();
 
app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());
 
app.get('/', (req, res) => {
    res.json({
        message: 'Behold The MEVN Stack!'
    });
});

app.get('/messages', (req, res) => {
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
}); 

app.post('/messages', (req, res) => {
    console.log(req.body);
    messages.create(req.body).then((message) => {
        res.json(message);
    }).catch((error) => {
        res.status(500);
        res.json(error);
    });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});