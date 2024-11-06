import { Request, Response,NextFunction } from 'express';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

type ExpressHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

const errorHandler = (fn: ExpressHandler): ExpressHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error('Error:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      };
      
      if (error instanceof Error) {
        switch (error.name) {
          case 'ValidationError':
            res.status(400).json(response);
            break;
          case 'UnauthorizedError':
            res.status(401).json(response);
            break;
          case 'ForbiddenError':
            res.status(403).json(response);
            break;
          case 'NotFoundError':
            res.status(404).json(response);
            break;
          default:
            res.status(500).json(response);
        }
      } else {
        res.status(500).json(response);
      }
    }
  };
};

export default errorHandler;
