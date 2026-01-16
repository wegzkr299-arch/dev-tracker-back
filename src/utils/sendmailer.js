require("dotenv").config();
const SibApiV3Sdk = require('sib-api-v3-sdk');

const client = SibApiV3Sdk.ApiClient.instance;

// تأكد إن المفتاح بيتم تعيينه صح
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY; // إنت مسميه SMTP_PASS في الملف بتاعك

const sendMail = async (to, subject, html) => {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); 

  sendSmtpEmail = {
    to: [{ email: to }],
    sender: { email: process.env.BREVO_API_KEY }, // الإيميل المسجل في بريفو
    subject: subject,
    htmlContent: html
  };

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ تم الإرسال بنجاح:", data.messageId);
    return data;
  } catch (err) {
    console.error("❌ فشل الإرسال:");
    if (err.response) {
      // ده هيقولك بالظبط ليه السيرفر رفض الطلب
      console.error("السبب من السيرفر:", err.response.body);
    } else {
      console.error("خطأ غير متوقع:", err.message);
    }
    throw err;
  }
}

module.exports = sendMail;