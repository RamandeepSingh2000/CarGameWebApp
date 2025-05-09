// server/microservices/auth-service/graphql/resolvers.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { config } from "../config/config.js"; // Use default import
//
//
const resolvers = {
  Query: {
    user: async (_, { id }) => await User.findById(id),
    currentUser: async (_, __, context) => {
      const { req } = context;

      if (!req || !req.cookies) {
        // ✅ Ensure `req` exists
        console.log("🚨 Request object is missing!");
        return null;
      }      
      const token = req.cookies.token ?? req.headers.authorization;
      if (!token) {
        return null; // No user is logged in
      }

      try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
          throw new Error("User not found");
        }
        console.log("✅ Current user:", user);
        return user;
      } catch (error) {
        console.error("Error verifying token:", error);
        return null;
      }
    },
  },
  Mutation: {
    register: async (_, { username, email, password, role }) => {
      const newUser = new User({ username, email, password, role });
      await newUser.save();

      return {
        id: newUser._id.toString(), // Convert MongoDB `_id` to GraphQL `id`
        ...newUser.toObject(),
      };
    },
    updateUser: async (_, { id, username, email }) => {
      try {
        const updatedUser = await User.findByIdAndUpdate(
          id,
          { username, email },
          { new: true }
        );
        if (!updatedUser) {
          throw new Error(`Achievement with ID ${id} not found`);
        }
        return {
          id: updatedUser._id.toString(), // Convert MongoDB `_id` to GraphQL `id`
          ...updatedUser.toObject(),
        };
      } catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Failed to update user");
      }
    },
    login: async (_, { username, password }, { res }) => {
      const user = await User.findOne({ username });
      console.log("🔍 User found:", user);
      if (!user || !(await bcrypt.compare(password, user.password)))
        throw new Error("Invalid email or password");
      const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("token", token, { httpOnly: true });
      return user;
    },
    logout: (_, __, { res }) => {
      res.clearCookie("token");
      return "Logged out successfully!";
    },
    deleteUser: async (_, { userId }) => {
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      await User.findByIdAndDelete(userId);
      return `User ${userId} deleted successfully`;
    },
  },
  //
  // Query: {

  // //
  // Mutation: {
  //   //
  //   login: async (_, { username, password }, { res }) => {
  //     const user = await User.findOne({ username });
  //     if (!user) {
  //       throw new Error("User not found");
  //     }

  //     const match = await bcrypt.compare(password, user.password);
  //     if (!match) {
  //       throw new Error("Invalid password");
  //     }

  //     const token = jwt.sign({ username }, config.JWT_SECRET, {
  //       expiresIn: "1d",
  //     });

  //     // ✅ Fix: Ensure cookie is set with the correct attributes
  //     res.cookie("token", token, {
  //       httpOnly: true, // Prevents JavaScript access
  //       //secure: false,  // Change to true for HTTPS
  //       //sameSite: 'None', // Use 'None' if different origins
  //       maxAge: 24 * 60 * 60 * 1000, // 1 day
  //     });
  //     console.log("✅ Cookie set in response:", res.getHeaders()["set-cookie"]);

  //     console.log("✅ Cookie set:", res.getHeaders()["set-cookie"]);

  //     return true;
  //   },

  //   register: async (_, { username, password }) => {
  //     const existingUser = await User.findOne({ username });
  //     if (existingUser) {
  //       throw new Error("Username is already taken");
  //     }
  //     // password hashing is done in User model
  //     const newUser = new User({ username, password: password });
  //     await newUser.save();
  //     return true;
  //   },
  // },
};

export default resolvers;
