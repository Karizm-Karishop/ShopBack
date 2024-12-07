import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import BookModel from '../database/models/BookModel';
import UserModel from '../database/models/UserModel';
import dbConnection from '../database';

const bookRepository = dbConnection.getRepository(BookModel);
const userRepository = dbConnection.getRepository(UserModel);
type ExpressHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

class BookController {
  
  static createBook: ExpressHandler = async (req, res) => {
    console.log("Request Body",req.body)
    await body('bookName').trim().notEmpty().withMessage('Book name is required').run(req);
    await body('bookTitle').trim().notEmpty().withMessage('Book title is required').run(req);
    await body('authorFirstName').trim().notEmpty().withMessage('Author first name is required').run(req);
    await body('authorLastName').trim().notEmpty().withMessage('Author last name is required').run(req);
    await body('yearOfPublish').isInt().withMessage('Year of publish must be an integer').run(req);
    await body('pageNumber').isInt().withMessage('Page number must be an integer').run(req);
    await body('price').isFloat().withMessage('Price must be a number').run(req);
    await body('artist')
      .exists().withMessage('artist ID is required')
      .isInt({ min: 1 }).withMessage('artist ID must be a positive integer')
      .toInt()
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: 'Validation failed', data: errors.array() });
      return;
    }

    const { 
      bookName, 
      bookTitle, 
      authorFirstName, 
      authorLastName, 
      publishedDate, 
      coverImage,
      uploadFile,
      description, 
      price, 
      yearOfPublish, 
      pageNumber    } = req.body;

    try {

      const artist_id = req.body.artist_id;
      const artist = await userRepository.findOne({
        where: { user_id: artist_id },
      });

      if (!artist) {
        res.status(404).json({
          success: false,
          error: "artist not found",
        });
        return;
      }

      const book = bookRepository.create({ 
        bookName, 
        bookTitle, 
        authorFirstName, 
        authorLastName, 
        publishedDate,
        coverImage,
        uploadFile,
        description, 
        price, 
        yearOfPublish, 
        pageNumber,
        artist: artist
      });

      await bookRepository.save(book);
      console.log("Request Body",req.body)
      const { password, ...artistWithoutPassword } = artist;

      res.status(201).json({ 
        success: true, 
        message: 'Book created successfully', 
        data: {
          ...book,
          artist: artistWithoutPassword
        } 
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  static getAllBooks: ExpressHandler = async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    try {
      const [books, total] = await bookRepository.findAndCount({
        relations: ["artist"],
        skip,
        take: limit,
        order: { created_at: "DESC" },
      });

      const sanitizedBooks = books.map(book => {
        const { password, ...artistWithoutPassword } = book.artist;
        return {
          ...book,
          artist: artistWithoutPassword
        };
      });

      res.status(200).json({
        success: true,
        data: {
          books: sanitizedBooks,
          pagination: {
            current_page: page,
            total_pages: Math.ceil(total / limit),
            total_items: total,
            items_per_page: limit,
          },
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  static getBooksByartistId: ExpressHandler = async (req, res) => {
    const { artistId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const artistIdNum = parseInt(artistId, 10);

    try {
      const artist = await userRepository.findOne({
        where: { user_id: artistIdNum }
      });

      if (!artist) {
        return res.status(404).json({
          success: false,
          error: "artist not found",
        });
      }

      const [books, total] = await bookRepository.findAndCount({
        where: { artist: { user_id: artistIdNum } },
        relations: ["artist"],
        skip,
        take: limit,
        order: { created_at: "DESC" },
      });

      if (!books.length) {
        return res.status(404).json({
          success: false,
          error: "No books found for this artist",
        });
      }

      const sanitizedBooks = books.map(book => {
        const { password, ...artistWithoutPassword } = book.artist;
        return {
          ...book,
          artist: artistWithoutPassword
        };
      });

      res.status(200).json({
        success: true,
        data: {
          books: sanitizedBooks,
          pagination: {
            current_page: page,
            total_pages: Math.ceil(total / limit),
            total_items: total,
            items_per_page: limit,
          },
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  static getBookById: ExpressHandler = async (req, res) => {
    await param('id').isInt().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: 'Validation failed', data: errors.array() });
      return;
    }

    const { id } = req.params;

    try {
      const book = await bookRepository.findOne({ 
        where: { id: parseInt(id) },
        relations: ["artist"]
      });

      if (!book) {
        res.status(404).json({ success: false, message: 'Book not found' });
        return;
      }

      const { password, ...artistWithoutPassword } = book.artist;

      res.status(200).json({ 
        success: true, 
        data: {
          ...book,
          artist: artistWithoutPassword
        } 
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  static updateBook: ExpressHandler = async (req, res) => {
    await param('id').isInt().run(req);

    await body('bookName').optional().trim().notEmpty().run(req);
    await body('bookTitle').optional().trim().notEmpty().run(req);
    await body('yearOfPublish').optional().isInt().run(req);
    await body('pageNumber').optional().isInt().run(req);
    await body('price').optional().isFloat().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: 'Validation failed', data: errors.array() });
      return;
    }

    const { id } = req.params;
    const { 
      bookName, 
      bookTitle, 
      authorFirstName, 
      authorLastName, 
      publishedDate,
      coverImage,
      uploadFile,
      description, 
      price, 
      yearOfPublish, 
      pageNumber 
    } = req.body;

    try {
      const book = await bookRepository.findOne({ 
        where: { id: parseInt(id) },
        relations: ["artist"]
      });

      if (!book) {
        res.status(404).json({ success: false, message: 'Book not found' });
        return;
      }

      book.bookName = bookName || book.bookName;
      book.bookTitle = bookTitle || book.bookTitle;
      book.authorFirstName = authorFirstName || book.authorFirstName;
      book.authorLastName = authorLastName || book.authorLastName;
      book.publishedDate = publishedDate || book.publishedDate;
      book.coverImage = coverImage || book.coverImage;
      book.uploadFile = uploadFile || book.uploadFile;
      book.description = description || book.description;
      book.price = price || book.price;
      book.yearOfPublish = yearOfPublish || book.yearOfPublish;
      book.pageNumber = pageNumber || book.pageNumber;

      await bookRepository.save(book);

      const { password, ...artistWithoutPassword } = book.artist;

      res.status(200).json({ 
        success: true, 
        message: 'Book updated successfully', 
        data: {
          ...book,
          artist: artistWithoutPassword
        } 
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  static deleteBook: ExpressHandler = async (req, res) => {
    // Validate ID parameter
    await param('id').isInt().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: 'Validation failed', data: errors.array() });
      return;
    }

    const { id } = req.params;

    try {
      const result = await bookRepository.delete(id);
      
      if (result.affected === 0) {
        res.status(404).json({ success: false, message: 'Book not found' });
        return;
      }

      res.status(200).json({ success: true, message: 'Book deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  static deleteAllBooks: ExpressHandler = async (_req, res) => {
    try {
      await bookRepository.clear();
      res.status(200).json({ success: true, message: 'All books deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

export default BookController;