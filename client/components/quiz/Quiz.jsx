/* eslint-disable no-unused-vars */
/* eslint-disable jsx-quotes */
// Top level container for the Quiz
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import StartGame from './startGame';
import PlayGame from './playGame';
import EndGame from './endGame';
// import { getAICart } from '../../../server/api/aic';

function Quiz() {
  // Old States
  const [wallet, setWallet] = useState(0); // Retrieve Users current bank total
  // New States
  const [startGame, setStartGame] = useState(true); // Start View:  defaults to true
  const [playGame, setPlayGame] = useState(false); // Game View: defaults to false
  const [endGame, setEndGame] = useState(false); // End View: defaults to false
  const [aicArt, setAicArt] = useState([]); // Store retrieved Art Data
  const [clickCount, setClickCount] = useState(0); // Tracks User click number on any art piece
  const [maxRounds, setMaxRounds] = useState(3); // Tracks Rounds so I only have to change it here
  const [currScore, setcurrScore] = useState(0); // Track score of current Game Session
  const [leftRight, setLeftRight] = useState([0, 1]); // State for what is displayed each round

  // ********** Axios Requests Start
  // Re-Use: Function to Retrieve fund total of user's wallet and set wallet state
  function getWallet() {
    axios
      .get('/db/user/')
      .then(({ data }) => {
        setWallet(data.wallet);
      })
      .catch((err) => console.error('Could not GET wallet amount: ', err));
  }

  // Retrieves art data from AIC API & saves to DB
  // To be invoked when User clicks "START?" in StartGame
  function getArt() {
    // Must make 2 axios calls:
    // 1) GET data from AIC API
    axios
      .get('/db/aicapi')
      .then((response) => {
        const artData = response.data;
        // console.log('GET-POST Combo Check', artData);
        // 2) POST data to DB
        // sTO to try & prevent browser POST error from logging
        return axios.post('/db/quizart', artData);
      })
      .then(() => {
        // console.log('AIC Art Add to DB: Success: ', postResponse.data);
      })
      .catch((err) => {
        console.error('AIC Art Add to DB: Failed: ', err);
      });
  }

  // Retrieve art from DB that getArt saved to DB & add it to State
  function pullArt() {
    // console.log('Pull Art Invoked');
    axios
      .get('/db/quizart')
      .then((data) => {
        // console.log('DB Art Retrieval: Success ', data.data);
        // Save retrieved data to state
        setAicArt(data.data);
      })
      .catch((err) => console.error('DB Art Retrieval: Failed ', err));
  }

  // Delete art from DB
  // To be invoked when User clicks "END GAME" in PlayGame
  function delArt() {
    // console.log('delArt has been invoked');
    axios
      .delete('/db/quizart')
      .then((response) => {
        if (response.status === 200) {
          // console.log('Quiz Art Deletion: Success ');
        } else if (response.status === 404) {
          console.log('Quiz Art Deletion: None Found ');
        }
      })
      .catch((err) => {
        console.error('Quiz Art Deletion: Failed ', err);
      });
  }

  // Has "START?" been Clicked - pass down to StartGame
  const handleStartClick = () => {
    // console.log('Start Was Clicked');
    setStartGame(false);
    setPlayGame(true);
    // Need to keep pullArt from running before getArt is done
    getArt();
    setTimeout(() => {
      pullArt();
    }, 1000);
  };

  // TEMP handler to pass down to PlayGame for testing End Game View swapping
  // Once 5 rounds have passed, view will automatically swap to END GAME view
  const handlePlayClick = () => {
    setPlayGame(false);
    // Make EndGame visible on Start click for Testing
    setEndGame(true);
  };

  // Handle tracking image click count for Art in PlayGame
  const handleImageClick = (index) => {
    setClickCount(clickCount + 1);
    setLeftRight([leftRight[0] + 2, leftRight[1] + 2]);
    console.log(`Image ${index} clicked`);
    console.log('Click Count: ', clickCount);
    console.log('Left Right: ', leftRight);
  };

  // Has "END GAME" been Clicked - pass down to EndGame
  const handleEndClick = () => {
    setEndGame(false);
    setStartGame(true);
    // Reset State to empty to pr3event old options from appearing on a new game
    setAicArt([]);
    // Reset click count to 0
    setClickCount(0);
    // Empty the Database to save space & prevent Duplicate errors
    delArt();
  };

  // useEffect for changes to wallet, and score
  useEffect(() => {
    getWallet();
    // Placeholder for score retrieval
  }, []);

  useEffect(() => {
    // console.log('Quiz.jsx - Verify State whenever aicArt updates', aicArt);
  }, [aicArt]);

  // Include ternary to control which view User is shown:
  // Start, Game, End
  return (
    <Container
      style={{ height: '600px', maxWidth: '1000px', marginBottom: '40px' }}
    >
      <Row className='d-flex align-items-center'>
        <Col>
          <div className='d-flex'>
            <h3>Wallet:</h3>
            <h3 className='ms-2'>{wallet ? `$${wallet}` : '$0.00'}</h3>
            <h3 style={{ marginLeft: '40px' }}>High Score: Placeholder</h3>
          </div>
        </Col>
      </Row>
      <Row>
        {startGame && (
          <StartGame
            handleStartClick={handleStartClick}
            maxRounds={maxRounds}
          />
        )}
        {/* PG button is Temporary  */}
        {playGame && (
          <PlayGame
            handlePlayClick={handlePlayClick}
            handleImageClick={handleImageClick}
            aicArt={aicArt}
            clickCount={clickCount}
            maxRounds={maxRounds}
            currScore={currScore}
            leftRight={leftRight}
          />
        )}
        {endGame && <EndGame handleEndClick={handleEndClick} />}
      </Row>
    </Container>
  );
}

export default Quiz;
