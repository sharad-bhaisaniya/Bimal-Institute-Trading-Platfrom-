const axios = require('axios');
const SmsSetting = require('../models/SmsSetting');

const sendOtpSms = async (phone, otp) => {
  try {
    const activeSms = await SmsSetting.findOne({ isActive: true });
    
    if (!activeSms) {
      console.warn('No active SMS settings found. Falling back to console log.');
      console.log(`Mock SMS sent to ${phone}: Your OTP is ${otp}`);
      return true;
    }

    const message = `Dear User, Your OTP is ${otp}. Login Link: https://therapidinvestors.com/Admin/login This OTP is valid for 10 minutes. Do not share this OTP with anyone. If you need any help or face any issues, please feel free to reach out. Best regards, Shubham Sharma Properietor Of The Rapid Investors Contact -8269981108.`;
    
    const params = {
      user: activeSms.user,
      key: activeSms.key,
      mobile: `${activeSms.countryCode}${phone}`, // e.g., 919876543210
      message: message,
      senderid: activeSms.senderId,
      accusage: 1,
      entityid: activeSms.entityId,
      tempid: activeSms.templateId
    };

    const response = await axios.get(activeSms.baseUrl, { params });
    console.log('SMS Gateway Response:', response.data);
    return true;
  } catch (error) {
    console.error('Error sending SMS via gateway:', error.message);
    return false;
  }
};

module.exports = { sendOtpSms };
