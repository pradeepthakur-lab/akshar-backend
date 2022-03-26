/* Modules */
const express = require('express');
const app = express();
const http = require('http');
const mongoose = require('mongoose');
const debug = require('debug')('nodeapi:server');
const bodyParser = require('body-parser');
const fs = require('fs')
const path = require('path');
const cookieParser = require('cookie-parser');
const { header } = require('express-validator');
const cors = require("cors");
require('dotenv').config();

// const os = require('os');
// const cluster =require('cluster');
// console.log(os.cpus());

/* connect mongodb */
require('./config/db');

/* helper */
// const helper = require('./lib/helper');

// const fileupload = require("express-fileupload");
// app.use(fileupload());

// allow cors requests from any origin and with credentials
// app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));

app.use(cors());
app.use(bodyParser.json({ limit: "500mb" }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true, parameterLimit: 50000 }))
app.use(express.json());
// app.use(express.static(path.join(__dirname, 'uploads')));
// app.use(express.static(path.join(__dirname, 'public')));

/**
 * Cors setup.
 */
 app.use(function (req, res, next) {
    const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:5254",
        "https://reactjs-newsdb.netlify.app",
    ];
    const origin = req.headers.origin;
    console.log('origin', origin);
    // res.setHeader("Access-Control-Allow-Origin", "*");

    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    } else {
        res.setHeader("Access-Control-Allow-Origin", "https://reactjs-newsdb.netlify.app");
        // res.setHeader("Access-Control-Allow-Origin", "*");
    }

    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin,Content-Type, token, x-id, Content-Length, X-Requested-With, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});


/* Routes */
var authRoutes = require('./routes/auth');
var userRoutes = require('./routes/user');
var customerRoutes = require('./routes/customer');
var jobRoutes = require('./routes/job');



/* // api url */
app.get('/', function (req, res) {
    res.send('Hello akshar it!');
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/job", jobRoutes);

// app.use('/author', author)

app.all('*', (req, res) => {
    return res.status(404).json({
        message: "404, Unable to find this route Not Found!",
        error: true,
    });
});


/**
 * Get port from environment and store in Express.
 */

// var port = normalizePort(process.env.PORT || '5254');
var port = process.env.PORT || '5254';
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
    console.log("running on", bind)
}

module.exports = app;