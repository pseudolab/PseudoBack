require('module-alias/register');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const http = require('http');

const app = express();

const routes = require('./routes');
 
app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

app.use('/routes', routes)

app.set('port', process.env.PORT || 4000);

//서버 생성
exports.server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});