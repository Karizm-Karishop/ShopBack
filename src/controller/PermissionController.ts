import {Request, Response} from "express";
import dbConnection from "../database";
import Permission from "../database/models/PermissionModel";

const PermissionRepository= dbConnection.getRepository(Permission);

export default class PermissionController {
    static createPermission=async (req:Request, res:Response):Promise<any> => {
        try {
            const { name } = req.body as any;
            const permission = await PermissionRepository.create({ name });
            await PermissionRepository.save(permission);
            if (permission) {
                return res.status(201).json(permission);
            }
            return res.status(400).json({ message: "Failed to create permission" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    static getAllPermissions=async (req:Request, res:Response):Promise<any> => {
        try {
            const permissions = await PermissionRepository.find();
            if (permissions) {
                return res.status(200).json(permissions);
            }
            return res.status(404).json({ message: "No permissions found" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    static getPermissionById=async (req:Request, res:Response):Promise<any> => {
        try {
            const id = req.params.id as any;
            const permission = await PermissionRepository.findOne({where:{id:id}});
            if (permission) {
                return res.status(200).json(permission);
            }
            return res.status(404).json({ message: "Permission not found" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    static deletePermission= async (req: Request, res: Response): Promise<any>=>{
        try {
            const id = req.params.id as any;
            const permission = await PermissionRepository.findOne({where:{id:id}});
            if (permission) {
                await PermissionRepository.delete(permission);
                return res.status(204).json({success:'deleted successfully'});
            }
            return res.status(404).json({ message: "Permission not found" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    static updatePermission=async (req:Request, res:Response):Promise<any> => {
        try {
            const id = req.params.id as any;
            const { name } = req.body;
            const permission = await PermissionRepository.findOne({where:{id:id}});
            if (permission) {
                permission.name = name;
                await PermissionRepository.save(permission);
                return res.status(200).json(permission);
            }
            return res.status(404).json({ message: "Permission not found" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}