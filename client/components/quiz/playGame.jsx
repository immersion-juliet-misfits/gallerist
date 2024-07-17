/* eslint-disable jsx-quotes */
// import React, { useState, useEffect } from 'react';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';

// Pass in Axios requests from Quiz.jsx
function PlayGame({ onPlayClick }) {
  // State Start

  // State End

  return (
    <Container
      style={{ maxWidth: '750px' }}
      className='d-flex flex-column align-items-center'
    >
      <h1> Play Game </h1>
      <Button
        style={{ width: '200px', height: '50px' }}
        variant='secondary'
        onClick={onPlayClick}
      >
        END GAME
      </Button>
    </Container>
  );
}

export default PlayGame;
