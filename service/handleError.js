const headers = require('./headers');

const handleError = (res, error = null) => {
    res.writeHead(400, headers);
    res.write(JSON.stringify({
        'status': 'false',
        'message': '欄位不正確，或無此 ID',
        error,
    }))
    res.end();
}

module.exports = handleError;