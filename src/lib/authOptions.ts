import { NextAuthOptions, User, DefaultSession } from "next-auth";  // Re-added 'Session' import
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import Admin from "@/models/Admin";
import Company from "@/models/Company";
import Worker from "@/models/Worker";
import Accountant from "@/models/Accountant";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      username?: string | null;
      role?: "Company" | "Worker" |"Accountant"| "Admin";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "Company" | "Worker" | "Accountant"| "Admin";
  }
}

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const nextAuthSecret = getEnvVar("NEXTAUTH_SECRET");

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        console.log("Received credentials:", credentials);  // Log received credentials
        if (!credentials || !credentials.username || !credentials.password) {
          console.error("Missing credentials");
          return null;
        }

        try {
          await connectToDatabase();
          console.log("Connecting to database...");
          
          // Search through Admin, Company, and Customer roles
          const admin = await Admin.findOne({ username: credentials.username }).exec();
         
          if (admin) {
            console.log("Admin found:", admin);
            const isPasswordValid = bcrypt.compareSync(credentials.password, admin.password || "");
            if (!isPasswordValid) {
              console.error("Invalid password for admin username:", credentials.username);
              return null;
            }
            return {
              id: admin._id.toString(),
              name: admin.name,
              username: admin.username,
              role: "Admin",
            } as User;
          }

          const company = await Company.findOne({ username: credentials.username }).exec();
          if (company) {
            console.log("Company found:", company);
            const isPasswordValid = bcrypt.compareSync(credentials.password, company.password || "");
            if (!isPasswordValid) {
              console.error("Invalid password for company username:", credentials.username);
              return null;
            }
            return {
              id: company._id.toString(),
              name: company.name,
              username: company.username,
              role: "Company",
            } as User;
          }

          const worker = await Worker.findOne({ username: credentials.username }).exec();
          if (worker) {
            console.log("Worker found:", worker);
            const isPasswordValid = bcrypt.compareSync(credentials.password, worker.password || "");
            if (!isPasswordValid) {
              console.error("Invalid password for Worker username:", credentials.username);
              return null;
            }
            return {
              id: worker._id.toString(),
              name: worker.name,
              username: worker.username,
              role: "Worker",
            } as User;
          }
          const accountant = await Accountant.findOne({ username: credentials.username }).exec();
          if (accountant) {
            console.log("Accountant found:", accountant);
            const isPasswordValid = bcrypt.compareSync(credentials.password, accountant.password || "");
            if (!isPasswordValid) {
              console.error("Invalid password for Accountant username:", credentials.username);
              return null;
            }
            return {
              id: accountant._id.toString(),
              name: accountant.name,
              username: accountant.username,
              role: "Accountant",
            } as User;
          }


          console.error("No entity found with this username:", credentials.username);
          return null;
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log("JWT callback - User info:", user);  // Log user data in JWT callback
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        console.log("Session callback - Token info:", token);  // Log token data in session callback
        session.user.id = token.id as string;
        session.user.role = token.role as "Company" | "Worker" |"Accountant"| "Admin";
      }
      return session;
    },
  },
  secret: nextAuthSecret,
  debug: process.env.NODE_ENV === "development",  // Enables detailed logging in development
};
