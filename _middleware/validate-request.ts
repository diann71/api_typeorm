import { Request, Response, NextFunction } from 'express';
import Joi, { Schema } from 'joi';

function validateRequest(req: Request, next: NextFunction, schema: Schema) {
  const options = { abortEarly: false, allowUnknown: true, stripUnknown: true };
  const { error, value } = schema.validate(req.body, options);

  if (error) {
    next(`Validation error: ${error.details.map((x) => x.message).join(', ')}`);
  } else {
    req.body = value;
    next();
  }
}

export default validateRequest;
