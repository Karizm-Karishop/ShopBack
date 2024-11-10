import PermissionController from "../controller/PermissionController";
import { Router } from "express";
const router= Router();

router.post('/create-permission', PermissionController.createPermission);

router.get('/all-permissions', PermissionController.getAllPermissions);

router.get('/permission/:id', PermissionController.getPermissionById);

router.delete('/delete-permission/:id', PermissionController.deletePermission);

router.patch('/update-permission/:id', PermissionController.updatePermission);

export default router;