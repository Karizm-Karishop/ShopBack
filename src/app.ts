import express, { Application,Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import userRoutes from './routes/UserRoutes';
import swaggerUi from 'swagger-ui-express';
import 'reflect-metadata';
import swaggerSpec from './docs/swaggerconfig';
import cors from 'cors';

const app: Application = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user/', userRoutes);
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome To The Kari shop Backend Api' });
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;