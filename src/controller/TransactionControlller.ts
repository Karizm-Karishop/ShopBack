import dbConnection from "../database";
import {Request, Response} from "express";
import Transaction from "../database/models/TransactionModel";
const transactionRepo=dbConnection.getRepository(Transaction);
export class TransactionController{
    
    static async createTransaction(req: Request, res: Response): Promise<any> {
        try {
            const { amount, user_id, status, type } = req.body as any;
            const transaction = transactionRepo.create({ amount, user_id, status, type });
            await transactionRepo.save(transaction);
            if (transaction) {
                return res.status(201).json(transaction);
            }
            return res.status(400).json({ message: "Failed to create transaction" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    static async getAllTransactions(req: Request, res: Response): Promise<any> {
        try {
            const transactions = await transactionRepo.find();
            if (transactions) {
                return res.status(200).json(transactions);
            }
            return res.status(404).json({ message: "No transactions found" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    static async getTransactionById(req: Request, res: Response): Promise<any> {
        try {
            const transactionId = req.params.id;
            if (transactionId) {
                const transaction = await transactionRepo.findOne({ where: { id: transactionId as any } });
                if (transaction) {
                    return res.status(200).json(transaction);
                }
                return res.status(404).json({ message: "Transaction not found" });
            }
            return res.status(400).json({ message: "Invalid transaction ID" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    static async updateTransaction(req: Request, res: Response): Promise<any> {
        try {
            const transactionId = req.params.id;
            if (transactionId) {
                const transaction = await transactionRepo.findOne({ where: { id: transactionId as any } });
                if (transaction) {
                    const updatedTransaction = {...transaction,...req.body}
                    await transactionRepo.save(updatedTransaction);
                    return res.status(200).json(updatedTransaction);
                }
                return res.status(404).json({ message: "Transaction not found" });
            }
            return res.status(400).json({ message: "Invalid transaction ID" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    static async deleteTransaction(req: Request, res: Response): Promise<any> {
        try {
            const transactionId = req.params.id;
            if (transactionId) {
                const transaction = await transactionRepo.findOne({ where: { id: transactionId as any } });
                if (transaction) {
                    await transactionRepo.delete(transaction);
                    return res.status(204).json({ success: "Transaction deleted successfully" });
                }
                return res.status(404).json({ message: "Transaction not found" });
            }
            return res.status(400).json({ message: "Invalid transaction ID" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}