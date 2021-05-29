import nodemailer from "nodemailer";

export default function sendEmail(recipientEmail: string, subject: string, html: string, senderEmail?: string, senderPassword?: string) {
  return new Promise((resolve, reject) => {
    const smtpTrans = nodemailer.createTransport({
      host: "smtp.zoho.eu",
      port: 465,
      secure: true,
      auth: {
        user: senderEmail || process.env.DEFAULT_EMAIL_USER,
        pass: senderPassword || process.env.DEFAULT_EMAIL_PASSWORD,
      },
    });

    let mailOpts = {
      from: senderEmail || "elliotdunk@outlook.com",
      to: recipientEmail,
      subject: subject,
      html: html,
    };

    smtpTrans.sendMail(mailOpts, (err, response) => {
      if (err) return reject();
      return resolve();
    });
  });
}
