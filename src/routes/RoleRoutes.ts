import RoleController from "../controller/RoleController";
import { Router } from "express";

const router = Router();

router.post('/create-role', RoleController.createRole);

router.get('/all-roles', RoleController.getAllRoles);

router.get('/role/:id', RoleController.getRoleById);

router.patch('/update-role/:id', RoleController.updateRole);

export default router;