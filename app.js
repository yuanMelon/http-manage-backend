var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var mysql2 = require('mysql2')
var checkParam = require('./routes/checkParam')

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');


const Routes_1 = require("./Features/Routes");
const Models_1 = require("./Models");
const express_1 = __importDefault(require("express"));
const fs_1 = require("fs");
const path_1 = require("path");
const Session_1 = require("./Common/Session");
const bodyParser = require('body-parser');





var app = express();

// 引入路由
var indexRouter = require('./routes/index')
var loginRouter = require('./routes/login')
var userRouter = require('./routes/users')
var projectRouter = require('./routes/project')
var mockRouter =require('./routes/mockone')
var jiekouRouter =require('./routes/jiekou')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

// 配置路由
app.use('/',indexRouter)
app.use('/main',indexRouter)
app.use('/login',loginRouter)
app.use('/user',userRouter)
app.use('/project',checkParam("project"))
app.use('/mock',mockRouter)
app.use('/interface',jiekouRouter)

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;



async function init() {
  console.log("Loading config...");
  const config = JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(__dirname, "config.json"), "utf-8"));
  console.log("Initializing...");
  await (0, Models_1.initialize)(config.db);
  Session_1.SessionManager.initialize(config.sessionSecret);
  const app = (0, express_1.default)();
  app.use(express_1.default.json());
  app.use(express_1.default.urlencoded({ extended: true }));
  (0, Routes_1.routeWrapper)(app);
  console.log("Initialized!");
  return [app, config];
}
init().then(([app, config]) => {
  app.listen(config.server.port, config.server.hostname);
  console.log(`Listening on port ${config.server.hostname}:${config.server.port}`);
});