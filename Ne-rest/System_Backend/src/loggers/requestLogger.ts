
import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';

interface RequestLoggerInfo {
    method: string;
    url: string;
    status: number;
    duration: string;
    ip: string;
    userAgent?: string;
}

const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const logInfo: RequestLoggerInfo = {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip || '',
            userAgent: req.get('user-agent')
        };
        logger.info(logInfo);
    });

    next();
};

module.exports = requestLogger; 