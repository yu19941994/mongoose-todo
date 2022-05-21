const headers = require('./headers');

const handleError = (res, statusCode, status, message, error = null) => {
    res.writeHead(statusCode, headers);
    res.write(JSON.stringify({
        status,
        message,
        error,
    }))
    res.end();
}

module.exports = handleError;