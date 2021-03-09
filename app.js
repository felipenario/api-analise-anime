let express = require('express');
let logger = require('morgan');
let bodyParser = require('body-parser');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

//BD
const connection = require('./config/database')();

//Routes

let loginRouter = require('./routes/login');
app.use('/', loginRouter);
let reviewsRouter = require('./routes/review');
app.use('/', reviewsRouter);



//Error Handlers
app.use((req, res, next)=>{
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
})

app.use((err, req, res, next)=>{
    res.status(err.status || 500).json({
        msg: err.message,
        error: err
    })
})


module.exports = app;
