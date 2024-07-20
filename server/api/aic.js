/* eslint-disable arrow-body-style */
/* eslint-disable comma-dangle */
/* eslint-disable implicit-arrow-linebreak */

// Requests to the Art Institute of Chicago
const axios = require('axios');
require('dotenv').config();

/*
AIC API request
Need the fields: id, title, image_id (to construct url for displaying the image)
*/

/*
 V1: AIC wants "AIC-User-Agent header w/name of project & contact email* added to reqs
 const getAICart = () =>
   axios('https://api.artic.edu/api/v1/artworks?fields=id,title,image_id', {
     headers: {
       'AIC-User-Agent': 'Gallerist - Senior Legacy Assignment (tremartin3003@gmail.com)'
     }
   });
*/

// V2: GETs results from a random page:
// const getAICart = () => {
//   // Generate random page number
//   const rando = Math.floor(Math.random() * 400) + 1;
//   // console.log('RandoNum Check: ', rando);
//   return axios(
//     `https://api.artic.edu/api/v1/artworks?page=${rando}&fields=id,title,image_id`,
//     {
//       headers: {
//         'AIC-User-Agent':
//           'Gallerist - Senior Legacy Assignment (tremartin3003@gmail.com)',
//       },
//     }
//   );
// };

// V3: Pulls from 3 random pages:
const getAICart = () => {
  // Generate random page number
  const rando = Math.floor(Math.random() * 600) + 1;
  // console.log('RandoNum Check: ', rando);
  return axios(
    `https://api.artic.edu/api/v1/artworks?page=${rando}&fields=id,title,image_id`,
    {
      headers: {
        'AIC-User-Agent':
          'Gallerist - Senior Legacy Assignment (tremartin3003@gmail.com)',
      },
    }
  );
};

module.exports = { getAICart };
