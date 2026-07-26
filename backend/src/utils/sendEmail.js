import transporter from "../config/mail.js";

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Ecommerce" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully");
    return true;
  } catch (error) {
    console.error("Failed to send email:", error.message);
    return false;
  }
};

export default sendEmail;