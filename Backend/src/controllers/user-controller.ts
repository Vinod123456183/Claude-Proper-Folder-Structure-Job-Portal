import { Request, Response } from "express";
import { User } from "../models/user-model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose, { Types } from "mongoose"; // ✅ FIX: import Types too
// import { UserInterface } from "../interface/user-interface/user-interface";

export const registerUsercontroller = async (req: Request, res: Response) => {
  try {
    const { userName, userEmail, userPhone, userPassword, userRole } = req.body;

    if (!userName || !userEmail || !userPhone || !userPassword || !userRole) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
      });
    }

    // 🟢 whitelist allowed roles — prevents self-assigning admin
    const ALLOWED_ROLES = ["student", "recruiter"];
    if (!ALLOWED_ROLES.includes(userRole)) {
      return res.status(400).json({
        message: "Invalid role. Allowed roles: student, recruiter",
        success: false,
      });
    }

    // check if user already exists
    const existingUser = await User.findOne({ userEmail });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
        success: false,
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    // create user
    const newUser = new User({
      userName,
      userEmail,
      userPhone,
      userPassword: hashedPassword,
      userRole,
    });

    await newUser.save();

    // 🟢 strip password before sending response
    const { userPassword: _, ...safeUser } = newUser.toObject();

    return res.status(201).json({
      message: `Account created successfully for ${userName}`,
      success: true,
      user: safeUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error registering user",
      success: false,
    });
  }
};

// export const registerUsercontroller = async (req: Request, res: Response) => {
//   try {
//     const { userName, userEmail, userPhone, userPassword, userRole } = req.body;

//     // check required fields
//     if (!userName || !userEmail || !userPhone || !userPassword || !userRole) {
//       return res.status(400).json({
//         message: "Missing required fields",
//         success: false,
//       });
//     }

//     // check if user already exists
//     const existingUser = await User.findOne({ userEmail });

//     if (existingUser) {
//       return res.status(400).json({
//         message: "Email already exists",
//         success: false,
//       });
//     }

//     // hash password
//     const hashedPassword = await bcrypt.hash(userPassword, 10);

//     // create user
//     const newUser = new User({
//       userName,
//       userEmail,
//       userPhone,
//       userPassword: hashedPassword,
//       userRole,
//     });

//     await newUser.save();

//     return res.status(201).json({
//       message: `Account created successfully for ${userName}`,
//       success: true,
//       userId: newUser._id,
//       user: newUser,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "Server Error registering user",
//       success: false,
//     });
//   }
// };

// export const loginUsercontroller = async (req: Request, res: Response) => {
//   try {
//     const { userEmail, userPassword, userRole } = req.body;

//     // check required fields
//     if (!userEmail || !userPassword || !userRole) {
//       return res.status(400).json({
//         message: "Email, password and role are required",
//         success: false,
//       });
//     }

//     // find user
//     const user = await User.findOne({ userEmail });

//     if (!user) {
//       return res.status(400).json({
//         message: "Invalid email or password",
//         success: false,
//       });
//     }

//     // check role
//     if (user.userRole !== userRole) {
//       return res.status(400).json({
//         message: "Role mismatch. Please select correct role.",
//         success: false,
//       });
//     }

//     // compare password
//     const isPasswordMatch = await bcrypt.compare(
//       userPassword,
//       user.userPassword,
//     );

//     if (!isPasswordMatch) {
//       return res.status(400).json({
//         message: "Invalid email or password",
//         success: false,
//       });
//     }

//     // create token
//     const token = jwt.sign(
//       { userId: user._id, role: user.userRole }, // 👈 add role here
//       process.env.JWT_SECRET as string,
//       { expiresIn: "1d" },
//     );

//     return res
//       .status(200)
//       .cookie("token", token, {
//         httpOnly: true,
//         sameSite: "strict",
//         maxAge: 24 * 60 * 60 * 1000,
//       })
//       .json({
//         message: `Welcome back ${user.userName}`,
//         success: true,
//         user,
//       });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "Server error during login",
//       success: false,
//     });
//   }
// };

export const loginUsercontroller = async (req: Request, res: Response) => {
  try {
    const { userEmail, userPassword, userRole } = req.body;

    if (!userEmail || !userPassword || !userRole) {
      return res.status(400).json({
        message: "Email, password and role are required",
        success: false,
      });
    }

    const user = await User.findOne({ userEmail });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    if (user.userRole !== userRole) {
      return res.status(400).json({
        message: "Role mismatch. Please select correct role.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      userPassword,
      user.userPassword,
    );

    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.userRole },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );

    // 🟢 strip password before sending response
    const { userPassword: _, ...safeUser } = user.toObject();

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.userName}`,
        success: true,
        user: safeUser, // 🟢 no password hash in response
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error during login",
      success: false,
    });
  }
};

export const logoutUsercontroller = async (req: Request, res: Response) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error logging out",
      success: false,
    });
  }
};

export const updateUsercontroller = async (req: Request, res: Response) => {
  try {
    const { userName, userPhone, userBio, userSkills } = req.body;

    const userId = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ message: "Invalid User ID", success: false });
    }

    // 🟢 ownership check — only allow updating your own profile
    const loggedInUserId = (req as any).user.id;
    if (userId !== loggedInUserId.toString()) {
      return res.status(403).json({
        message: "Forbidden: you can only update your own profile",
        success: false,
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (userName) user.userName = userName;
    if (userPhone) user.userPhone = userPhone;
    if (userBio) user.userProfile.userBio = userBio;
    if (userSkills) {
      user.userProfile.userSkills = userSkills.split(",");
    }

    await user.save();

    // 🟢 strip password before sending response
    const { userPassword: _, ...safeUser } = user.toObject();

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: safeUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error updating profile",
      success: false,
    });
  }
};

// export const updateUsercontroller = async (req: Request, res: Response) => {
//   try {
//     const { userName, userPhone, userBio, userSkills } = req.body;

//     const userId = req.params.id as string;

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res
//         .status(400)
//         .json({ message: "Invalid User ID", success: false });
//     }

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//         success: false,
//       });
//     }

//     if (userName) user.userName = userName;
//     if (userPhone) user.userPhone = userPhone;

//     if (userBio) user.userProfile.userBio = userBio;

//     if (userSkills) {
//       user.userProfile.userSkills = userSkills.split(",");
//     }

//     await user.save();

//     return res.status(200).json({
//       message: "Profile updated successfully",
//       success: true,
//       user,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "Error updating profile",
//       success: false,
//     });
//   }
// };
