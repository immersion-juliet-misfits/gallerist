/* eslint-disable quotes */
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
      <h2>Great Job!</h2>
      <h2>Heres Your Final Score!!</h2>
      <h1>{currScore}</h1>
      <Button
        style={{
          width: '200px',
          height: '50px',
          fontSize: '30px',
          marginTop: '15px',
        }}
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
