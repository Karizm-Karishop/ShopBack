import express, { Application,Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import userRoutes from './routes/UserRoutes';
import swaggerUi from 'swagger-ui-express';
import 'reflect-metadata';
import swaggerSpec from './docs/swaggerconfig';
import cors from 'cors';
import roleRoutes from './routes/RoleRoutes';
import permissionsRoutes from './routes/PermissionRoutes';
import CategoryRoutes from './routes/CategoryRoutes'
import ShopsRoutes from './routes/ShopRoutes'
import AlbumRoutes from './routes/AlbumRoutes'
import CartRoutes from './routes/CartRoutes'
import TrackRoutes from "./routes/TrackRoutes"
import transactionRoutes from './routes/TransactionRoutes';
import NotificationRoutes from'./routes/notificationRoutes';
import ProductRoutes from './routes/ProductRoutes';
import BookRoutes from './routes/BooksRoutes';
const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user/',userRoutes);
app.use('/api/roles/', roleRoutes);
app.use('/api/permissions/', permissionsRoutes);
app.use('/api/', CategoryRoutes);
app.use('/api/', ShopsRoutes);
app.use('/api/', AlbumRoutes);
app.use('/api/', TrackRoutes);
app.use('/api/', CartRoutes);
app.use('/api/', ProductRoutes);
app.use('/api/roles/', roleRoutes);
app.use('/api/transactions/', transactionRoutes);
app.use('/api/',NotificationRoutes);
app.use('/api/permissions/', permissionsRoutes);
app.use('/api/',BookRoutes)
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome To The Kari shop Backend Api' });
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;