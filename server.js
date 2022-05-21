const http = require('http');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/posttest')
.then(() => console.log('connect success'))
.catch((err) => console.log(err.reason))

const requestListener = async (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk;
    })
}

const server = http.createServer(requestListener);
server.listen(3005);