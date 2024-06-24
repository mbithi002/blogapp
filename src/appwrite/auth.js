import { Account, Client, ID } from "appwrite";
import conf from "../conf/conf";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
  }

  async createAccount(email, password, name) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      if (userAccount) {
        return await this.login(email, password);
      } else {
        throw new Error("Account creation failed");
      }
    } catch (error) {
      console.error("AuthService :: createAccount() ::", error);
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      const response = await this.account.createEmailPasswordSession(email, password);
      console.log("Login successful", response);
      return response;
    } catch (error) {
      console.error("Error during login", error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.error("Appwrite service :: getCurrentUser() ::", error);
      throw error;
    }
  }

  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.error("Appwrite service :: logout() ::", error);
    }
  }
}
const authService = new AuthService();

export default authService;
