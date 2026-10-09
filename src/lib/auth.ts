import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

// 1. Safety check to prevent the "startsWith" crash
if (!process.env.MONGODB_URL) {
  throw new Error("🚨 MONGODB_URL is missing! Please check your .env.local file.");
}

// 2. Initialize MongoDB client
const client = new MongoClient(process.env.MONGODB_URL as string);
const db = client.db("bangla-news-24");

// 3. Export Better Auth
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  // Pass the db directly as recommended by Better Auth docs
  database: mongodbAdapter(db), 
});