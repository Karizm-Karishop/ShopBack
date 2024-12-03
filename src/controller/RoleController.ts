import Role from "../database/models/RoleModel";
import { Request, Response } from "express";
import dbConnection from "../database";
import Permission from "../database/models/PermissionModel";
const RoleRepository = dbConnection.getRepository(Role);
const PermissionRepository = dbConnection.getRepository(Permission);
export default class RoleController {
    static createRole = async (req: Request, res: Response): Promise<any> => {
        try {
            const { name, permissions, description } = req.body as any;
            const permissionsRes = await Promise.all(
                permissions.map(async (name:any) => {
                    let permission = await PermissionRepository.findOne({ where: { name } });
                    if (!permission) {
                        permission = PermissionRepository.create({ name });
                        await PermissionRepository.save(permission);
                    }
                    return permission;
                })
            );
            console.log(permissionsRes)
            // Create and save the role with permissions
            const role = RoleRepository.create({
                name: name,
                description: `${description} role`,
                permissions: permissionsRes
            });
        
            await RoleRepository.save(role);
            if(role){
                return res.status(201).json(role);
            }
            else{
                return res.status(400).json({message: 'Failed to create a role'})
            }
            
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static getAllRoles = async (req: Request, res: Response): Promise<any> => {
        {
            try {
                const roles = await RoleRepository.find({ relations: ['permissions'] });
                if (roles) {
                    return res.status(200).json(roles);
                }
                else {
                    return res.status(404).json({ message: 'No roles found' });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    }
    static getRoleById = async (req: Request, res: Response): Promise<any> => {
        try {
            const roleId = req.params.id;
            if (roleId) {
                const role = await RoleRepository.findOne({ where: { id: roleId } });
                if (role) {
                    return res.status(200).json(role);
                }
                else {
                    return res.status(404).json({ message: 'Role not found' });
                }
            }
        } catch (error) {
            return res.status(500).json({ error });
        }
    };
    static updateRole = async (req: Request, res: Response): Promise<any> => {
        try {
            const roleId = req.params.id;
            const { name, permissions, description } = req.body as any;

            if (roleId) {
                const role = await RoleRepository.findOne({ where: { id: roleId } });
                if (role) {
                    role.name = name || role.name;
                    role.permissions = permissions || role.permissions;
                    role.description = description || role.description;
                    await RoleRepository.save(role);
                    return res.status(200).json(role);
                }
                else {
                    return res.status(404).json({ message: 'Role not found' });
                }
            }
        } catch (error) {
            return res.status(500).json({ error });
        }
    }
    static deleteRole = async (req: Request, res: Response): Promise<any> => {
        try {
            const roleId = req.params.id;
            if (roleId) {
                const role = await RoleRepository.delete({ id: roleId });
                if (role) {
                    return res.status(204).json({
                        success:true,
                        deleted:1
                    });
                }
                else {
                    return res.status(404).json({ message: 'Role not found' });
                }
            }
        } catch (error) {
            return res.status(500).json({ error });
        }
    }
}
