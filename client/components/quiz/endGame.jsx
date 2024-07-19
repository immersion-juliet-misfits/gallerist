/* eslint-disable jsx-quotes */
// import React, { useState, useEffect } from 'react';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';

// Pass in Axios requests from Quiz.jsx
function EndGame({ handleEndClick }) {
  // State Start

  // State End

  return (
    <Container
      style={{ maxWidth: '750px' }}
      className='d-flex flex-column align-items-center'
    >
      <h1>End Of Game</h1>
      <h3>Display Final Current Score & Money Earned</h3>
      <p>Update Money & Highscore if its higher than previous</p>
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
