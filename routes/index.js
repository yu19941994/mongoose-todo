const HttpControllers = require('../controllers/http');
const PostsControllers = require('../controllers/posts');

const routes = async (req, res) => {
    const { url, method } = req;
    let body = '';
    req.on('data', chunk => {
        body += chunk;
    })
    if (url === '/posts' && method === 'GET') {
        PostsControllers.getPosts({ req, res })
    } else if (url === '/posts' && method === 'POST') {
        req.on('end', async() => PostsControllers.createPost({ body, req, res }));
    } else if (url.startsWith('/posts') && method === 'PATCH') {
        req.on('end', async() => PostsControllers.modifyPost({ body, req, res, url }));
    } else if (url === '/posts' && method === 'DELETE') {
        PostsControllers.deletePosts({ req, res });
    } else if (url.startsWith('/posts') && method === 'DELETE') { 
        PostsControllers.deletePost({ req, res, url })
    } else if (url === '/posts' && method === 'OPTIONS') {
        HttpControllers.cors(res);
    } else {
        HttpControllers.notFound(res);
    }
}

module.exports = routes;