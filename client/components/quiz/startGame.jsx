/* eslint-disable jsx-quotes */
// Top level container for the Quiz
// import React, { useState, useEffect } from 'react';
import React from 'react';
// import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

function StartGame() {
  // State Start

  // State End

  // Axios Requests Start

  // Will render Start component
  // useEffect(() => {
  // }, []);

  // Include ternary to control which view User is shown:
  // Start, Game, End
  return (
    <Container
      style={{ maxWidth: '750px' }}
      className='d-flex flex-column align-items-center'
    >
      <h1>How To Play!</h1>
      <Row
        style={{ maxWidth: '600px' }}
        className='d-flex flex-column align-items-center'
      >
        <p className='fs-4' style={{ marginBottom: '0', paddingBottom: '0' }}>
          {' '}
          For 5 Rounds:
        </p>
        <ul style={{ marginTop: '0', paddingTop: '0' }}>
          <li>You will be shown 2 pieces of Art</li>
          <li>You will also be shown 1 Title</li>
          <li>Click the Art Piece you believe belongs to the Title</li>
          <li>Win money for correct answers!</li>
        </ul>
        <Button style={{ width: '200px', height: '50px' }} variant='secondary'>
          START?
        </Button>
      </Row>
    </Container>
  );
}

export default StartGame;
