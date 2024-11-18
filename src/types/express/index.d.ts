import UserModel from "../../database/models/UserModel";
declare global {
  namespace Express {
    interface Request {
      user?: UserModel; 
    }
  }
}
