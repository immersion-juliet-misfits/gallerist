const axios = require('axios');
const { User, Art } = require('../db/index');
require('dotenv').config();

const { SERVICE_ID } = process.env;
const { TEMPLATE_ID } = process.env;
const { USER_ID } = process.env;

const sendMessage = () => {
  axios('https://api.emailjs.com/api/v1.0/email/send', {
    headers: {
      service_id: SERVICE_ID,
      template_id: TEMPLATE_ID,
      user_id: USER_ID,
      template_params: {
        from_name: 'Galleriest',
        to_name: User.name,
        message: `The art piece ${Art.title} is now for sale`,
      },
    },
  });
};

module.exports = sendMessage;
