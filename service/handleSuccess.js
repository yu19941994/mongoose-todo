const headers = require('./headers');

const handleSuccess = (res, posts) => {
    res.writeHead(200, headers);
    res.write(JSON.stringify({
        'status': true,
        posts,
    }))
    res.end();
}

module.exports = handleSuccess;