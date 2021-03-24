require('module-alias/register');

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const morgan = require('morgan');
const http = require('http');

const app = express();

const routes = require('./routes');
 
//라우팅 모듈 선언
const indexRouter = require('./routes/index');

//request 요청 URL과 처리 로직을 선언한 라우팅 모듈 매핑
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);

app.use(morgan('tiny'));
app.use(cors());
app.use(cookieParser());

app.use(session({ 
    secret: 'keycat cat',
    resave: false,
    saveUninitialized: false
}));
// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

app.use('/routes', routes)

app.set('port', process.env.PORT || 4000);

//서버 생성
exports.server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});