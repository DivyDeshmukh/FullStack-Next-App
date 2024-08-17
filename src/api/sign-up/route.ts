import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";

import { sendVerifcationEmail } from "@/helpers/sendVerificationEmail";

// here, route is already defined and we are not handling it manually also it is important for us to name functions based on the request that we are expecting like POST, PUT, GET, etc.

export async function POST(request: Request) {
  // as we know it is possible that db is not connected so in that case we will connect it on each request, but as we have already applied the check that whether database is connected in backend so need to worry to multiple db connections.
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is alreaedy taken",
        },
        { status: 400 }
      );
    }

    const existingUserVerifiedByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserVerifiedByEmail) {
      if (existingUserVerifiedByEmail.isVerified) {
        return Response.json({
          success: false,
          message: "User with this email already exists",
        });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserVerifiedByEmail.password = hashedPassword;
        existingUserVerifiedByEmail.verifyCode = verifyCode;
        existingUserVerifiedByEmail.verifyCodeExpiry = new Date(
          Date.now() + 3600000
        );
        await existingUserVerifiedByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();

      // send verfication email
      const emailResponse = await sendVerifcationEmail(
        username,
        email,
        verifyCode
      );

      if (emailResponse) {
        return Response.json(
          {
            success: false,
            message: emailResponse?.message,
          },
          { status: 500 }
        );
      }

      return Response.json(
        {
          success: false,
          message: "User registered successfully, Please verify your Email",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
