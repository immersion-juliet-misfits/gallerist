import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

function EndGame({ handleEndClick, currScore }) {
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
          fontSize: '25px',
          width: '300px',
          height: '100px',
          marginTop: '15px',
          marginBottom: '15px',
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
