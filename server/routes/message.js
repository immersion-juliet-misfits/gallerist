const express = require('express');
const axios = require('axios');

const messRouter = express.Router();

require('dotenv').config();

const { SERVICE_ID } = process.env;
const { TEMPLATE_ID } = process.env;
const { USER_ID } = process.env;
// const { PRIVATE_KEY } = process.env;

messRouter.post('/send-email', (req, res) => {
  const { name, email, title } = req.body;
  console.log('body', name, email, title)
  const connData = {
    service_id: SERVICE_ID,
    template_id: TEMPLATE_ID,
    user_id: USER_ID,
    template_params: {
      to_name: name,
      from_name: 'Gallerist',
      email,
      message: `The art piece ${title} is now for sale!`,
    },
  };
  axios.post('https://api.emailjs.com/api/v1.0/email/send', connData)
    .then((response) => {
      console.log('Email sent successfully:', response.data);
      res.status(200).send(response.data);
    })
    .catch((err) => {
      console.error('Could not send email:', err);
      res.status(500).send('Could not send email');
    });
});

module.exports = { messRouter };
