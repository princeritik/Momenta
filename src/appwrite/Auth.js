import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";

export class Authentication {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create({
        userId: ID.unique(),
        email,
        password,
        name,
      });

      if (userAccount) {
        return await this.login({ email, password });
      }

      return null;
    } catch (error) {
      console.log("Appwrite service :: createAccount :: error", error);
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession({
        email,
        password,
      });
    } catch (error) {
      console.log("Appwrite service :: login :: error", error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      return null;
    }
  }

  async logout() {
    try {
      return await this.account.deleteSessions();
    } catch (error) {
      console.log("Appwrite service :: logout :: error", error);
      throw error;
    }
  }

  async sendVerificationEmail() {
    try {
      return await this.account.createVerification({
        url: `${conf.appUrl}/verify-email`,
      });
    } catch (error) {
      console.log("Appwrite service :: sendVerificationEmail :: error", error);
      throw error;
    }
  }

async verifyEmail({ userId, secret }) {
  try {
    return await this.account.updateVerification(
      userId,
      secret,
    );
  } catch (error) {
    console.log("Appwrite service :: verifyEmail :: error", error);
    throw error;
  }
}

async createPasswordRecovery(email) {
  try {
    return await this.account.createRecovery({
      email,
      url: `${conf.appUrl}/reset-password`,
    });
  } catch (error) {
    console.log("Appwrite service :: createPasswordRecovery :: error", error);
    throw error;
  }
}

async updatePasswordRecovery({ userId, secret, password }) {
  try {
    return await this.account.updateRecovery({
      userId,
      secret,
      password,
    });
  } catch (error) {
    console.log("Appwrite service :: updatePasswordRecovery :: error", error);
    throw error;
  }
}

}

const authentication = new Authentication();
export default authentication;