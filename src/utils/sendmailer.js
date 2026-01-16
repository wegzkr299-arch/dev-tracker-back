require("dotenv").config();
const SibApiV3Sdk = require('sib-api-v3-sdk');

console.log("1. الكود بدأ يحمل ملف الـ sendMail");

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.SMTP_PASS;

console.log("2. الـ API Key اللي اتقرأ هو:", process.env.SMTP_PASS ? "موجود ومقروء" : "فارغ أو undefined ❌");

const sendMail = async (to, subject, html) => {
    console.log(`3. محاولة إرسال إيميل إلى: ${to}`);
    
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); 

    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.sender = { email: process.env.SMTP_USER }; 
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;

    try {
        console.log("4. جاري إرسال الطلب لـ Brevo...");
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("5. ✅ استجابة السيرفر:", data);
        return data;
    } catch (err) {
        console.error("6. ❌ حصل خطأ أثناء الإرسال:");
        if (err.response) {
            console.error("تفاصيل الخطأ من Brevo:", JSON.stringify(err.response.body, null, 2));
        } else {
            console.error("الخطأ:", err.message);
        }
        throw err;
    }
}

module.exports = sendMail;