const headers = require('./headers');

const handleSuccess = (res, status, posts) => {
    if (!!status) {
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            status: true,
            posts,
        }))
        res.end();
        return;
    }
    res.writeHead(200, headers);
    res.end();
}

module.exports = handleSuccess;