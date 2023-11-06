import { usersModel } from "../models/users.model.js";

class UsersManager {
  async getUserById(id) {
    const response = await usersModel.findById(id);
    return response;
  }

  async getUserByEmail(email) {
    const response = await usersModel.findOne({ email });
    return response;
  }

  async createUser(obj) {
    const response = await usersModel.create(obj);
    return response;
  }
}

export const usersManager = new UsersManager();