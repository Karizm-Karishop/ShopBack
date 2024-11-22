import  UserModel  from '../../database/models/UserModel';

declare global {
  namespace Express {
    interface User extends UserModel {}
  }
}