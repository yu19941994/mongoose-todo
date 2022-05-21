const http = require('http');
const mongoose = require('mongoose');
const Post = require('./models/post')

mongoose.connect('mongodb://localhost:27017/posttest')
.then(() => console.log('connect success'))
.catch((err) => console.log(err.reason))

const requestListener = async (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk;
    })
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
        'Content-Type': 'application/json'
    }
    if (req.url === '/posts' && req.method === 'GET') {
        const posts = await Post.find();
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            'status': 'success',
            posts,
        }))
        res.end();
    } else {
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            'status': 'false',
            'message': '無此網站路由'
        }))
        res.end();
    }
}

const server = http.createServer(requestListener);
server.listen(3005);