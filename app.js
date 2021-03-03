//필요한 모듈 선언
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const passport = require('passport');
 
const { exception } = require('console');

const app = express();

app.use(cookieParser);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ 
    secret: process.env.SESSION_SECRET || 'nyancat',
    resave: true,
}));
// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

//라우팅 모듈 선언
const indexRouter = require('./routes/index');
const postsRouter = require('./routes/post/posts');

//request 요청 URL과 처리 로직을 선언한 라우팅 모듈 매핑
app.use('/', indexRouter);
app.use('/posts', postsRouter);

console.log('app started')
app.set('port', process.env.PORT || 4000);

//서버 생성
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
