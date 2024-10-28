import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import 'reflect-metadata';
import fs from 'fs';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import express, { Application, NextFunction, Request, Response } from 'express';


const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const logStream = fs.createWriteStream(path.join(__dirname, 'output.log'), {
  flags: 'a',
});

morgan.token('type', (req: Request) => req.headers['content-type']);
app.use(morgan('combined', { stream: logStream }));
app.get('/', (req: Request, res: Response) => {
  return res.status(200).json({ message: 'Welcome To The Kari shop Backend Api' });
});
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Title',
      version: '1.0.0',
      description: 'API Documentation',
    },
  },
  apis: ['./src/routes/*.ts'], 
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;

