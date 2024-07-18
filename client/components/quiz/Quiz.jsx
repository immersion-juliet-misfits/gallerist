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
  //  ********** State Start
  // Old States
  const [wallet, setWallet] = useState(0); // Retrieve Users current bank total
  // Write all Axios res in this Parent then pass them down where needed
  // Should all States be done the same way?

  // New States
  const [startGame, setStartGame] = useState(true); // Start View:  defaults to true
  const [playGame, setPlayGame] = useState(false); // Game View: defaults to false
  const [endGame, setEndGame] = useState(false); // End View: defaults to false
  // State to store retrieved Art Data in
  const [aicArt, setAicArt] = useState([]);
  // ********** State End

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
    // 1 to GET data from AIC API
    axios
      .get('/db/aicapi')
      .then((response) => {
        const artData = response.data;
        // console.log('GET-POST Combo Check', artData);
        // 1 (inside) to POST data to my DB
        return axios.post('/db/quizart', artData);
      })
      .then((postResponse) => {
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

  // ********** Axios Requests End

  // Click Handlers Start
  // Has "START?" been Clicked - pass down to StartGame
  const handleStartClick = () => {
    // console.log('Start Was Clicked');
    setStartGame(false);
    setPlayGame(true);
    // getArt(); // Get art from AIC
    // pullArt(); // Get Art from DB
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
    // Temp making EndGame visible on Start click for Testing
    setEndGame(true);
  };

  // Has "END GAME" been Clicked - pass down to EndGame
  const handleEndClick = () => {
    setEndGame(false);
    setStartGame(true);
  };
  // Click Handlers End

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
    <Container style={{ maxWidth: '1000px' }}>
      <Row className='d-flex align-items-center'>
        <Col>
          <div className='d-flex'>
            <h3>Wallet:</h3>
            <h3 className='ms-2'>{wallet ? `$${wallet}` : '$0.00'}</h3>
            <p style={{ marginLeft: '40px' }}>
              Placeholder to display Users Previous High Score
            </p>
          </div>
        </Col>
      </Row>
      <Row>
        {startGame && (
          <StartGame
            onStartClick={handleStartClick}
            getArt={getArt}
            pullArt={pullArt}
          />
        )}
        {/* PG button is Temporary  */}
        {playGame && (
          <PlayGame
            onPlayClick={handlePlayClick}
            getArt={getArt}
            aicArt={aicArt}
            delArt={delArt}
          />
        )}
        {endGame && <EndGame onEndClick={handleEndClick} />}
      </Row>
    </Container>
  );
}

export default Quiz;
