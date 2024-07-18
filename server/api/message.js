const axios = require('axios');
const { User } = require('')
require('dotenv').config();

const { SERVICE_ID } = process.env;
const { TEMPLATE_ID } = process.env;
const { USER_ID } = process.env;

module.exports = {
  sendMessage: axios('https://api.emailjs.com/api/v1.0/email/send', {
    service_id: SERVICE_ID,
    template_id: TEMPLATE_ID,
    user_id: USER_ID,
    template_params: {
      from_name: 'Galleriest',
      to_name: 'user watching',
      message: 'message',
    },
  }),
};
