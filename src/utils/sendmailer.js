require("dotenv").config();
const SibApiV3Sdk = require('sib-api-v3-sdk');

console.log("1. الكود بدأ يحمل ملف الـ sendMail");

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];

// التعديل هنا: غيرنا SMTP_PASS لـ BREVO_API_KEY عشان يطابق ملف الـ .env الجديد
apiKey.apiKey = process.env.BREVO_API_KEY;

console.log("2. الـ API Key اللي اتقرأ هو:", process.env.BREVO_API_KEY ? "موجود ومقروء ✅" : "فارغ أو undefined ❌");

const sendMail = async (to, subject, html) => {
    console.log(`3. محاولة إرسال إيميل إلى: ${to}`);
    
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    
    // تأكد إن البيانات مطابقة للي بريفو مستنياه
    const sendSmtpEmail = {
        to: [{ email: to }],
        sender: { email: process.env.SMTP_USER }, // aliabueldahab2005@gmail.com
        subject: subject,
        htmlContent: html
    };

    try {
        console.log("4. جاري إرسال الطلب لـ Brevo...");
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("5. ✅ تم الإرسال بنجاح! استجابة السيرفر:", data);
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