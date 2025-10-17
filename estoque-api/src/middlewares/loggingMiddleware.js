const loggingMiddleware = (req, res, next) => {
    const requestId = req.requestId;
    const method = req.method;
    const url = req.url;
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || 'N/A';
    const startTime = Date.now()

    const originalEnd = res.end;
    res.end = function (chunk, encoding) {
        const duration = Date.now() - startTime;

        console.log(`[${new Date().toISOString()}] [${requestId}] ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent} - Status: ${res.statusCode} - Duration: ${duration}ms`);

        originalEnd.call(this, chunk, encoding)
    }

    next()
}

module.exports = loggingMiddleware;