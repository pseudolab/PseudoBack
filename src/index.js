require('module-alias/register');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const http = require('http');
const path = require('path');
const jobs = require('@lib/job');
const config = require('config');

const app = express();

const routes = require('./routes');
 
//라우팅 모듈 선언

//request 요청 URL과 처리 로직을 선언한 라우팅 모듈 매핑
app.use(express.json());

app.use(morgan('tiny'));
app.use(cors());

app.use(['/routes', '/api/routes'], routes)
app.use('/static', express.static(path.join(__dirname, 'dist')))
app.use('/image', express.static(path.join(__dirname, '../images')))

app.set('port', 4000);
if(config.has('PORT')) {
    app.set('port', config.get('PORT'));
}

jobs.run();

//서버 생성
exports.server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});