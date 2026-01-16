const SibApiV3Sdk = require('sib-api-v3-sdk');
require("dotenv").config();

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendMail = async (to, subject, html) => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is missing from environment variables.");
  }

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); 
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = html;
  sendSmtpEmail.sender = { email: process.env.FROM_EMAIL };
  sendSmtpEmail.to = [{ email: to }];

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return data;
  } catch (err) {
    // This will help you see exactly what the API didn't like
    console.error("Brevo Error Details:", err.response?.text || err.message);
    throw err;
  }
};

module.exports = sendMail
