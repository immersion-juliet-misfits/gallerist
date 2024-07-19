/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable jsx-quotes */
// Top level container for the Quiz
import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

// Pass in Axios requests from Quiz.jsx
function StartGame({ handleStartClick, maxRounds }) {
  // State Start
  // State End

  return (
    <Container
      style={{ maxWidth: '750px' }}
      className='d-flex flex-column align-items-center'
    >
      <h1 style={{ fontSize: '3rem', marginTop: '20px', marginBottom: '15px' }}>
        How To Play!
      </h1>
      <Row
        style={{ maxWidth: '600px' }}
        className='d-flex flex-column align-items-center'
      >
        <Col>
          <div
            className='d-flex'
            style={{
              marginTop: '20',
              marginBottom: '0',
              paddingBottom: '0',
              gap: '5px',
            }}
          >
            <h3>For </h3>
            <h3> {maxRounds} </h3>
            <h3> Rounds:</h3>
          </div>
        </Col>
        <ul style={{ marginTop: '0', paddingTop: '0', marginBottom: '40px' }}>
          <li>You will be shown Two (2) pieces of Art & One (1) Title!</li>
          <li>Click the Art Piece you believe belongs with the Title!!</li>
          <li>Win $$Money$$ for your correct answers!!!</li>
        </ul>
        <Button
          style={{ width: '200px', height: '50px' }}
          variant='secondary'
          onClick={() => {
            handleStartClick();
          }}
        >
          START?
        </Button>
      </Row>
    </Container>
  );
}

export default StartGame;
