import { config } from 'dotenv';
import nodemailer from 'nodemailer'

// Load environment variables from .env file
config();

// Create a Nodemailer transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    pool: true,
    host: "smtp.gmail.com",
    port: 465,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});

// Verify transporter configuration
transporter.verify(function (error, success) {
    console.log("Server is ready to take our messages");
});

// Send account verification email with a verification token
const sendAccountVerificationEmail = async (email: string, names: string, verificationToken: string) => {
    try {
        const info = transporter.sendMail({
            from: "ParkIt",
            to: email,
            subject: "Vanessa Management System Account Verification",
            html:
                `
            <!DOCTYPE html>
                <html>
                <body>
                    <h2>Dear ${names}, </h2>
                    <h2> To verify your account. Click the link below or use the code below</h2>
                    <strong>Verification code: ${verificationToken}</strong> <br/> or
                    <a href="${process.env.CLIENT_URL}/auth/verify-email/${verificationToken}" style="color:#4200FE;letter-spacing: 2px;">Click here</a>
                    <span>The code expires in 1 hours</span>
                    <p>Best regards,<br>Management System NodeJS</p>
                </body>
            </html>
            `

        });

        return {
            message: "Email sent successfully",
            status: true
        };
    } catch (error) {
        return { message: "Unable to send email", status: false };
    }
};

// Send password reset email with a reset token
const sendPaswordResetEmail = async (email: string, names: string, passwordResetToken: string) => {
    try {
        const info = transporter.sendMail({
              from: "ParkIt",
            to: email,
            subject: "NE NodeJS Password Reset",
            html:
                `
            <!DOCTYPE html>
                <html>
                <body>
                    <h2>Dear ${names}, </h2>
                    <h2> Click on the link below to change you password or use the code below</h2>
                    <strong>Reset code: ${passwordResetToken}</strong> <br/> or
                    <a href="${process.env.CLIENT_URL}/auth/reset-password/${passwordResetToken}" style="color:#4200FE;letter-spacing: 2px;">Click here</a>
                    <span>The code expires in 6 hours</span>
                    <p>Best regards,<br>NE NodeJS</p>
                </body>
            </html>
            `

        });

        return {
            message: "Email sent successfully",
            status: true
        };
    } catch (error) {
        return { message: "Unable to send email", status: false };
    }
};

// Send rejection email for parking request
const sendRejectionEmail = async (email: string, names: string) => {
  try {
    await transporter.sendMail({
        from: "ParkIt",
      to: email,
      subject: "Parking Request Rejected",
      html: `
          <!DOCTYPE html>
          <html>
            <body>
              <h2>Dear ${names},</h2>
              <p>We regret to inform you that your parking request has been <strong style="color:red;">rejected</strong>.</p>
              <p>This may be due to limited availability or other constraints. Please feel free to contact us for further clarification or try again at a later time.</p>
              <br/>
              <p>Best regards,<br/>NE Parking Management Team</p>
            </body>
          </html>
        `,
    });

    return {
      message: "Rejection email sent successfully",
      status: true,
    };
  } catch (error) {
    return { message: "Unable to send rejection email", status: false };
  }
};

// Send confirmation email for parking slot assignment
const sendParkingSlotConfirmationEmail = async (email: string, names: string, slotNumber: any) => {
  try {
    await transporter.sendMail({
        from: "ParkIt",
      to: email,
      subject: "Parking Slot Confirmation",
      html: `
          <!DOCTYPE html>
          <html>
            <body>
              <h2>Dear ${names},</h2>
              <p>We are pleased to confirm your parking slot reservation.</p>
              <p>Your assigned parking slot number is: <strong>${slotNumber}</strong></p>
              <p>Thank you for choosing our service!</p>
              <br/>
              <p>Best regards,<br/>NE Parking Management Team</p>
            </body>
          </html>
        `,
    });

    return {
      message: "Parking slot confirmation email sent successfully",
      status: true,
    };
  } catch (error) {
    return { message: "Unable to send parking slot confirmation email", status: false };
  }
};  

// Export all email utility functions
export { sendAccountVerificationEmail, sendPaswordResetEmail, sendRejectionEmail, sendParkingSlotConfirmationEmail };