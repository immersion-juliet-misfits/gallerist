const express = require('express');
const axios = require('axios');

require('dotenv').config();

const messRouter = express.Router();

const { SERVICE_ID } = process.env;
const { TEMPLATE_ID } = process.env;
const { USER_ID } = process.env;

const connData = {
  service_id: SERVICE_ID,
  template_id: TEMPLATE_ID,
  user_id: USER_ID,
  template_params: {
    to_name: '',
    from_name: 'Gallerist',
    to_email: '',
    message: `The art piece ${art.title} is now for sale!`,
  },
};

messRouter
  .post('https://api.emailjs.com/api/v1.0/email/send', connData)
  .then((data) => {
    console.log('data', data);
    res.status(200).send(data);
  })
  .catch((err) => {
    console.error('Could not send message: ', err);
    res.sendStatus(500);
  });

module.exports = messRouter;
