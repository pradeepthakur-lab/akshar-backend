/* Modules */
const express = require('express');
const app = express();
const http = require('http');

const os = require('os');
const cluster = require('cluster');

const mongoose = require('mongoose');
const debug = require('debug')('nodeapi:server');
const bodyParser = require('body-parser');
const fs = require('fs')
const path = require('path');
const cookieParser = require('cookie-parser');
const { header } = require('express-validator');
const cors = require("cors");
require('dotenv').config();

/* connect mongodb */
require('./config/db');

/* helper */
// const helper = require('./lib/helper');

app.use(cors());
app.use(bodyParser.json({ limit: "500mb" }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true, parameterLimit: 50000 }))
app.use(express.json());

/* files directory */
// app.use(express.static(path.join(__dirname, 'uploads')));
// app.use(express.static(path.join(__dirname, 'public')));

/* Cors setup */
// allow cors requests from any origin and with credentials
// app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));

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
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:5254"); //https://reactjs-newsdb.netlify.app
        // res.setHeader("Access-Control-Allow-Origin", "*");
    }

    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin,Content-Type, token, x-id, Content-Length, X-Requested-With, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

/* Routes */
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const customerRoutes = require('./routes/customer');
const jobRoutes = require('./routes/job');
const dashboardRoutes = require('./routes/dashboard');

/* routes url */
// app.get('/', function (req, res) {
//     res.send(`Hello akshar it!`);
//     // res.send(`Hello akshar it! server running on ${cluster.worker.process.pid}`);
//     // cluster.worker.kill()
// });
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/dashboard", dashboardRoutes);

/* url not found 404 */
app.all('*', (req, res) => {
    return res.status(404).json({
        message: "404, Unable to find this route Not Found!",
        error: true,
    });
});


/* Create server and port */
const port = process.env.PORT || '5254';

app.listen(port, () => {
    console.log(`Server runnign on port ${port}`)
});

/* Create server with clusters */
// if(cluster.isPrimary) {
//     let noOfCpus = os.cpus().length;
//     console.log('master cluster is running', process.pid);
//     for(let i = 0; i < noOfCpus; i++){
//         cluster.fork();
//     }
//     cluster.on('exit', (worker, code, signal) => {
//         console.log(`worker ${worker.process.pid} died`);
//         cluster.fork();
//     });
// } else {
//     app.listen(port, () => {
//         console.log(`Server runnign on port ${port} and Worker ${process.pid} started`);
//     });
// }

module.exports = app;