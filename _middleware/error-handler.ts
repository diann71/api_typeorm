import { Request, Response, NextFunction } from 'express';

function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): Response {
    if (typeof err === 'string') {
        const is404 = err.toLowerCase().endsWith('not found');
        const statusCode = is404 ? 404 : 400;
        return res.status(statusCode).json({ message: err });
    } 
    
    if (err instanceof Error) {
        return res.status(500).json({ message: err.message });
    }

    return res.status(500).json({ message: 'An unknown error occurred' });
}

export default errorHandler;
