
const Post = require('../models/post');
const handleSuccess = require('../service/handleSuccess');
const handleError = require('../service/handleError');

const posts = {
    async getPosts({ req, res }) {
        const posts = await Post.find();
        handleSuccess(res, posts);
    },
    async createPost({ body, req, res }) {
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
            handleError(res, error);
        }
    },
    async modifyPost({ body, req, res, url }) {
        try {
            const content = JSON.parse(body).content;
            const id = url.split('/').pop();
            if (content !== undefined) {
                await Post.findByIdAndUpdate(id, { content })
                const posts = await Post.find();
                handleSuccess(res, posts);
            } else {
                handleError(res);
            }
        } catch (error) {
            handleError(res, error);
        }
    },
    async deletePosts({ req, res }) {
        await Post.deleteMany({});
        handleSuccess(res, []);
    }, 
    async deletePost({ req, res, url }) {
        const id = url.split('/').pop();
        await Post.findByIdAndDelete(id);
        handleSuccess(res, null);
    }
}

module.exports = posts;