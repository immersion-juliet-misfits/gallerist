/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable jsx-quotes */
// import React, { useState, useEffect } from 'react';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';

// Pass in Axios requests from Quiz.jsx
function EndGame({ handleEndClick, currScore }) {
  // State Start

  // State End

  return (
    <Container
      style={{ maxWidth: '750px', marginTop: '20px' }}
      className='d-flex flex-column align-items-center'
    >
      <h1>End Of Game</h1>
      <h3>Final Score: {currScore}</h3>
      <ul>
        2DO:
        <li>Update High Score if its higher than previous.</li>
        <li>
          Stretch 1: Keep track of how much $$$ total has been earned here.
        </li>
        <li>Stretch 2: Implement multiplier for Correct answers in a row.</li>
        <li>
          Stretch 3: Some other variable that determines score to avoid max
          being 50-ish.
        </li>
      </ul>
      <Button
        style={{ width: '200px', height: '50px' }}
        variant='secondary'
        onClick={() => {
          handleEndClick();
        }}
      >
        Play Again?
      </Button>
    </Container>
  );
}

export default EndGame;
