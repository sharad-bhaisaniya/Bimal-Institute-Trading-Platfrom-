const nodemailer = require('nodemailer');
const SmtpSetting = require('../models/SmtpSetting');

const sendEmail = async ({ to, subject, html }) => {
  try {
    const activeSmtp = await SmtpSetting.findOne({ isActive: true });
    
    if (!activeSmtp) {
      console.warn('No active SMTP settings found. Cannot send email.');
      return false;
    }

    const transporter = nodemailer.createTransport({
      host: activeSmtp.host,
      port: activeSmtp.port,
      secure: activeSmtp.port === 465, // true for 465, false for other ports
      auth: {
        user: activeSmtp.user,
        pass: activeSmtp.pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"Bimal Institute" <${activeSmtp.user}>`,
      to,
      subject,
      html,
    });

    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = { sendEmail };
