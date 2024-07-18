// // const express = require('express');
// // const axios = require('axios');

// // const quizRouter = express.Router();

// // const { AICart } = require('../db/index');

// // Create: POST create() - Create new table to store data pulled from AIC per game started
// // Create temp DB table that stores 10
// quizRouter.post('/db/quizart', (req, res) => {
//   // Retrieve AIC data stored in DB
//   axios
//     .get('http://localhost:3000/db/quizart')
//     .then((retrieved) => {
//       const artArr = retrieved.data;

//       const mapArt = artArr.map((artInfo) => {
//         const { id, title, image_id } = artInfo;

//         return AICart.create({
//           id,
//           imageId: Image_id,
//           title,
//           ImageUrl: `https://www.artic.edu/iiif/2/${image_id}/full/843,/0/default.jpg`,
//         });
//       });
//       return Promise.all(mapArt);
//     })
//     .then((data) => {
//       res.status(201).send(data);
//     })
//     .catch((err) => {
//       console.error('Failed to Create New Game Session : ', err);
//       res.sendStatus(500);
//     });
// });

// module.exports = { quizRouter };

// // Retrieve 1: GET - User Profile info for access to their wallet
// // Use the function in the other file instead of trying to make another

// // Retrieve 2: GET - Retrieve Users previous highs core
// // quizRouter.get('/db/quizscore', (req, res) => {
// //   .
// // } );

// // Update 1: PATCH - Increase money in wallet at end of game based on score.
// // Use the function in the other file instead of trying to make another

// // Update 2: PATCH - Update the Users High Score if they have surpassed it
// // quizRouter.patch('/db/quizscore', (req, res) => {
// //   // const { } = req.params;
// //   // const { } = req.body;
// //   console.log('Score Patch Param Check', req.params);
// //   console.log('Score Patch Body Check', req.body);
// //   // User.findOneAndUpdate({ name }, { objWith: Score_data }, { new: true })
// //   //   .then(() => {
// //   //     res.sendStatus(200);
// //   //   })
// //   //   .catch((err) => {
// //   //     console.error('Failed to Update Users high score: ', err);
// //   //     res.sendStatus(500);
// //   //   });
// // });

// // Delete - Remove Table that random Art & Titles were pulled to to avoid overloading DB
// // quizRouter.delete('/db/___?', (req, res) => {
// //   const {  } = req.params;
// //   ___.findOneAndDelete({  })
// //     .then(() => {
// //       if () {
// //         res.sendStatus(200);
// //       } else {
// //         res.sendStatus(404);
// //       }
// //     })
// //     .catch((err) => {
// //       console.error('Failed to: ', err);
// //       res.sendStatus(500);
// //     });
// // });

// // module.exports = { quizRouter };
