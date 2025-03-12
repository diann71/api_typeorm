import 'rootpath';
import express, { Application } from 'express';
import cors from 'cors';
import errorHandler from './_middleware/error-handler';
import usersController from './users/users.controller';
import { Request, Response, NextFunction } from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/users', usersController);

interface ErrorHandler {
    (err: any, req: Request, res: Response, next: NextFunction): void;
}

const errorHandlerMiddleware: ErrorHandler = (err, req, res, next) => errorHandler(err, req, res, next);

app.use(errorHandlerMiddleware);

const port = process.env.NODE_ENV === 'production' ? Number(process.env.PORT) || 80 : 4000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
