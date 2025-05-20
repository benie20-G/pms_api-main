class ServerResponse {
    static success(res, message, data = null) {
        return res.status(200).json({
            status: 'success',
            message,
            data
        });
    }

    static error(res, message, statusCode = 400) {
        return res.status(statusCode).json({
            status: 'error',
            message
        });
    }

    static created(res, message, data = null) {
        return res.status(201).json({
            status: 'success',
            message,
            data
        });
    }

    static notFound(res, message = 'Resource not found') {
        return res.status(404).json({
            status: 'error',
            message
        });
    }

    static unauthorized(res, message = 'Unauthorized access') {
        return res.status(401).json({
            status: 'error',
            message
        });
    }

    static forbidden(res, message = 'Forbidden access') {
        return res.status(403).json({
            status: 'error',
            message
        });
    }

    static serverError(res, message = 'Internal server error') {
        return res.status(500).json({
            status: 'error',
            message
        });
    }
}

module.exports = ServerResponse; 