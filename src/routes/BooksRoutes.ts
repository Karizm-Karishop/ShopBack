import { Router } from 'express';
import BookController from '../controller/BookController';

const router = Router();

router.post('/books', BookController.createBook);

router.get('/books', BookController.getAllBooks);

router.get('/books/user/:artistId', BookController.getBooksByartistId);

router.get('/books/:id', BookController.getBookById);

router.put('/books/:id', BookController.updateBook);

router.delete('/books/:id', BookController.deleteBook);

router.delete('/books', BookController.deleteAllBooks);

export default router;