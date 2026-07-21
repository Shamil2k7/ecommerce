import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD || process.env.EMAIL_APP_PASSWORD,
  },
});

export async function sendOtpEmail(toEmail, otp) {
  try {
    const info = await transporter.sendMail({
      from: `"ecommerce" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "ecommerce - Your OTP",
      text: `Your OTP is ${otp}. This OTP is valid for 5 minutes.`,
      html: `
        <h2>ecommerce</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });

    console.log("Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Email error:", error);
    return false;
  }
}

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"ecommerce" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Email error:", error);
    return false;
  }
};

export default sendEmail;