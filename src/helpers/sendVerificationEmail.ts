import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerifcationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "you@example.com",
      to: email,
      subject: "fullstack-next Verification Code",
      react: VerificationEmail({
        username,
        otp: verifyCode,
      }),
    });
    return { success: true, message: "Verification email sent successfully" };
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return {
      success: false,
      message: "Failed to send vericaition email",
    };
  }
}
