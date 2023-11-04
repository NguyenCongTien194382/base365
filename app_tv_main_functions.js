var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser')
var cors = require('cors');
var logger = require('morgan');
var mongoose = require('mongoose')
var compression = require('compression')
const rateLimit = require("express-rate-limit");
var AppTimviec = express();

function configureApp(app) {
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    //app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static("/root/app/storage"));
    app.use(cors());

    function shouldCompress(req, res) {
        if (req.headers['x-no-compression']) {
            return false
        }
        return compression.filter(req, res)
    }
    app.use(compression({ filter: shouldCompress }))

    app.use(function(err, req, res, next) {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        res.status(err.status || 500);
        res.render('error');
    });

    // // unti ddos 
    // const limiter = rateLimit({
    //     windowMs: 1000,
    //     max: 250
    // });
    // app.use(limiter);
}

function errorApp(app) {
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        next(createError(404));
    });

    // error handler
    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });
}

// Cấu hình appTimviec
configureApp(AppTimviec);
//AppTimviec.use(logger('combined'))
var timviecRouter = require('./routes/timviec');
var toolAddDataRouter = require('./routes/tools');
var dataRouter = require('./routes/data');

AppTimviec.use("/api/timviec", timviecRouter);
AppTimviec.use('/api/tool', toolAddDataRouter);
AppTimviec.use('/api/getData', dataRouter);
errorApp(AppTimviec)


const DB_URL = 'mongodb://127.0.0.1:27017/api-base365';
mongoose.connect(DB_URL)
    .then(() => console.log('DB Connected!'))
    .catch(error => console.log('DB connection error:', error.message));


AppTimviec.listen(3021, () => {
    console.log("Admin Timviec365 is running on port 3021")
});