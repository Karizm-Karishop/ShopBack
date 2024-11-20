import { TransactionController } from "../controller/TransactionControlller";
import { Router } from "express";

const router= Router();

router.post('/create', TransactionController.createTransaction);

router.get('/get-all', TransactionController.getAllTransactions);

router.get('/get-transaction/:id', TransactionController.getTransactionById);

router.patch('/update/:id', TransactionController.updateTransaction);

router.delete('/delete/:id', TransactionController.deleteTransaction);

export default router;