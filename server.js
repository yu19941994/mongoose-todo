const http = require('http');
const mongoose = require('mongoose');
const Post = require('./models/post');
const dotenv = require('dotenv');

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
)

mongoose.connect(DB)
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
    } else if (req.url === '/posts' && req.method === 'POST') {
        req.on('end', async() => {
            try {
                const data = JSON.parse(body);
                const newPost = await Post.create(
                    {
                        content: data.content,
                        image: data.image,
                        name: data.name,
                        likes: data.likes
                    }
                )
                res.writeHead(200, headers);
                res.write(JSON.stringify({
                    'status': 'success',
                    posts: newPost
                }))
                res.end();
            } catch (error) {
                res.writeHead(400, headers);
                res.write(JSON.stringify({
                    'status': 'false',
                    'message': '欄位不正確，或無此 ID',
                    'error': error
                }))
                res.end();
            }
        })
    } else if (req.url.startsWith('/posts') && req.method === 'PATCH') {
        req.on('end', async() => {
            try {
                const content = JSON.parse(body).content;
                const id = req.url.split('/').pop();
                if (content !== undefined) {
                    await Post.findByIdAndUpdate(id, { content })
                    const posts = await Post.find();
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        'status': 'success',
                        posts,
                    }))
                    res.end();
                } else {
                    res.writeHead(400, headers);
                    res.write(JSON.stringify({
                        'status': 'false',
                        'message': '欄位不正確，或無此 ID',
                        'error': error
                    }))
                    res.end();
                }
            } catch (error) {
                res.writeHead(400, headers);
                res.write(JSON.stringify({
                    'status': 'false',
                    'message': '欄位不正確，或無此 ID',
                    'error': error
                }))
                res.end();
            }
        })
    } else if (req.url === '/posts' && req.method === 'DELETE') {
        await Post.deleteMany({});
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            'status': 'success',
            posts: []
        }))
        res.end();
    } else if (req.url.startsWith('/posts') && req.method === 'DELETE') { 
        const id = req.url.split('/').pop();
        await Post.findByIdAndDelete(id);
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            'status': 'success',
            posts: null
        }))
        res.end();
    } else if (req.url === '/posts' && req.method === 'OPTIONS') {
        res.writeHead(200, headers);
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
server.listen(process.env.PORT);