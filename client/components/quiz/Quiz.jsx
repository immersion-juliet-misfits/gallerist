// Top level container for the Quiz
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

function Quiz() {
  // State Start
  // Old States
  const [wallet, setWallet] = useState(0); // Retrieve Users current bank total
  // New States
  // const [startGame, setStartGame] = useState(true); // Start View:  defaults to true
  // const [gameTime, setGameTime] = useState(false); // Game View: defaults to false
  // const [endGame, setEndGame] = useState(true); // End View: defaults to false
  // State End

  // Axios Requests Start
  // Re-Use: Function to check funds of user's wallet and set wallet state
  function getWallet() {
    axios
      .get('/db/user/')
      .then(({ data }) => {
        setWallet(data.wallet);
      })
      .catch((err) => console.error('Could not GET wallet amount: ', err));
  }

  // Function to retrieve Start views relevant Data
  // Money is retrieved above, may also need Users previous high score.
  // function getStart() {
  //   axios
  //     .get('/db/placeholder/')
  //     .then(({ data }) => {
  //       setWallet(data.wallet);
  //     })
  //     .catch((err) => console.error('Could not GET wallet amount: ', err));
  // }
  // Axios Requests End

  // Initial render useEffect
  useEffect(() => {
    getWallet();
  }, []);

  // useEffect executed every time user finishes a game
  // and wallet funds reflect purchase
  useEffect(() => {
    console.log('place holder');
  }, []);

  // Include ternary to control which view User is shown:
  // Start, Game, End
  return (
    <Container>
      <Row>
        <h3>Quiz Time!</h3>
        <h3>Placeholder</h3>
        <h3>Wallet:</h3>
        <h3>{wallet ? `$${wallet}` : '$0.00'}</h3>
      </Row>
      <Row>Placeholder</Row>
    </Container>
  );
}

export default Quiz;
