const axios = require('axios');
require('dotenv').config();

const getAICart = () => {
  const rando = Math.floor(Math.random() * 600) + 1;
  return axios(
    `https://api.artic.edu/api/v1/artworks?page=${rando}&fields=id,title,image_id`,
    {
      headers: {
        'AIC-User-Agent':
          'Gallerist - Senior Legacy Assignment (tremartin3003@gmail.com)',
      },
    },
  );
};

module.exports = { getAICart };
