const Post = require('../models/post');
const handleSuccess = require('../service/handleSuccess');
const handleError = require('../service/handleError');

const routes = async (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk;
    })
    if (req.url === '/posts' && req.method === 'GET') {
        const posts = await Post.find();
        handleSuccess(res, 'success', posts);
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
                handleSuccess(res, 'success', newPost);
            } catch (error) {
                handleError(res, 400, 'false', '欄位不正確，或無此 ID', error);
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
                    handleSuccess(res, 'success', posts);
                } else {
                    handleError(res, 400, 'false', '欄位不正確，或無此 ID');
                }
            } catch (error) {
                handleError(res, 400, 'false', '欄位不正確，或無此 ID', error);
            }
        })
    } else if (req.url === '/posts' && req.method === 'DELETE') {
        await Post.deleteMany({});
        handleSuccess(res, 'success', []);
    } else if (req.url.startsWith('/posts') && req.method === 'DELETE') { 
        const id = req.url.split('/').pop();
        await Post.findByIdAndDelete(id);
        handleSuccess(res, 'success', null);
    } else if (req.url === '/posts' && req.method === 'OPTIONS') {
        handleSuccess(res);
    } else {
        handleError(res, 404, 'false', '無此網站路由');
    }
}

module.exports = routes;