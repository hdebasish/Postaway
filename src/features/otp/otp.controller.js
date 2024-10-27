import OTPModel from "./otp.model.js";
import OTPRepository from "./otp.repo.js";
import * as nodemailer from "nodemailer";
import bcrypt from "bcrypt";

let timer;

export default class OTPController {
  constructor() {
    this.otpRepo = new OTPRepository();
  }

  async sendOtp(req, res, next) {
    try {
      const email = req.body.email;

      if (!email) {
        return res.status(400).send("Please enter the email!");
      }

      const user = await this.otpRepo.findByEmail(email);

      if (!user) {
        return res.status(400).send("User not registered!");
      }

      const otpNumber = OTPModel.generateRandomNumber();
      const otp = new OTPModel(email, otpNumber, false);
      const otpCreated = await this.otpRepo.createOtp(otp);

      if (otpCreated) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "codingninjas2k16@gmail.com",
            pass: "slwvvlczduktvhdj",
          },
        });

        const mailOptions = {
          from: "codingninjas2k16@gmail.com",
          to: user.email,
          subject: "OTP to verify",
          text: `${otpNumber} is your OTP to verify your email on Postaway.`,
        };

        const result = await transporter.sendMail(mailOptions);

        timer = setTimeout(async () => {
          await this.otpRepo.deleteDoc(otpCreated.insertedId);
        }, "180000");

        if (result) {
          return res.status(200).send("OTP sent successfully!");
        } else {
          return res.status(500).send("Error in sending OTP!");
        }
      }
    } catch (error) {
      next(error);
    }
  }

  async verifyOtp(req, res, next) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).send("Email and OTP are required!");
      }

      const otpDoc = await this.otpRepo.findOtpByEmail(email);

      if (!otpDoc) {
        return res.status(404).send("No OTP found for the given email");
      }

      if (otpDoc.otpNumber == otp) {
        clearTimeout(timer);

        const result = await this.otpRepo.updateOtp(otpDoc._id);

        if (result) {
          return res.status(200).send("OTP Verified Successfully!");
        } else {
          return res.status(500).send("Something went wrong!");
        }
      } else {
        return res.status(403).send("Invalid OTP!");
      }
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const newPassword = req.body.newPassword;
      const email = req.body.email;

      if (!newPassword || !email) {
        return res.status(400).send("Email and New Password are required!");
      }

      const otpDoc = await this.otpRepo.findOtpByEmail(email);

      if (!otpDoc) {
        return res.status(400).send("No OTP Found");
      }

      if (otpDoc.isVerified == true) {
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        const resetPassword = await this.otpRepo.resetPassword(
          otpDoc._id,
          otpDoc.email,
          hashedPassword
        );

        if (resetPassword) {
          return res.status(200).send("Password Reset Successful!");
        } else {
          return res.status(500).send("Error Occured while updating password!");
        }
      } else {
        return res.status(403).send("OTP is not verified yet.");
      }
    } catch (error) {
      next(error);
    }
  }
}
