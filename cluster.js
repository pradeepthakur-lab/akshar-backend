const http = require('http');
const os = require('os');
const cluster = require('cluster');

// master, workers

if(cluster.isPrimary) {
    
    let noOfCpus = os.cpus().length;
    console.log('master cluster is running', process.pid);
    for(let i = 0; i < noOfCpus; i++){
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        cluster.fork();
    });

} else {

    http.createServer((req, res) => {
        res.writeHead(200);
        res.end('hello world\n');
    }).listen(8000);
    
    console.log(`Worker ${process.pid} started`);
}