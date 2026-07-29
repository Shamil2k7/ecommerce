import transporter from "../config/mail.js";

const sendEmail = async (to, subject, html) => {
  try {
    const emailData = {
      from: `"Ecommerce" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(emailData);

    return { success: true };
  } catch (error) {
    console.error("Email sending failed:", error.message);

    return { success: false, error: error.message };
  }
};

export default sendEmail;