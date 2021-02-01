require('module-alias/register');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const http = require('http');

const app = express();

const routes = require('./routes');
 
//라우팅 모듈 선언
const indexRouter = require('./routes/index');

//request 요청 URL과 처리 로직을 선언한 라우팅 모듈 매핑
app.use('/', indexRouter);

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

app.use('/routes', routes)

app.set('port', process.env.PORT || 4000);

//서버 생성
exports.server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});