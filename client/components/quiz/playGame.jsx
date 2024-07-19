/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable object-curly-newline */
/* eslint-disable jsx-quotes */
// import React, { useState, useEffect } from 'react';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
// import Row from 'react-bootstrap/Row';

// Pass in Axios requests from Quiz.jsx & state
function PlayGame({
  handlePlayClick,
  handleImageClick,
  aicArt,
  clickCount,
  maxRounds,
  currScore,
  leftRight,
}) {
  return (
    <Container
      style={{ maxWidth: '750px' }}
      className='d-flex flex-column align-items-center'
    >
      {/* <h1 style={{ marginBottom: '30px' }}> Play Game </h1> */}
      <Container
        style={{ height: '600', marginBottom: '30px', marginTop: '20px' }}
      >
        <Row>
          <Col>
            <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
              Current Round: {clickCount}
            </p>
          </Col>
          <Col>
            <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
              Current Winnings: {currScore}
            </p>
          </Col>
        </Row>
      </Container>

      {aicArt.length > 0 ? (
        <div>
          <Row
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <p
              style={{
                maxWidth: '400px',
                textAlign: 'center',
                marginBottom: '20px',
                fontSize: '1.5rem',
              }}
            >
              "{aicArt[0].title}"
            </p>
          </Row>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              width: '100%',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <Button
                variant='link'
                onClick={() => handleImageClick(0)}
                style={{ padding: 0 }}
                disabled={clickCount >= maxRounds}
              >
                <img
                  src={aicArt[leftRight[0]].imageUrl}
                  alt='No cheating!'
                  style={{
                    // maxWidth: '200px',
                    maxHeight: '300px',
                    objectFit: 'contain',
                  }}
                />
              </Button>
            </div>
            {aicArt.length > 1 && (
              <div style={{ textAlign: 'center' }}>
                <Button
                  variant='link'
                  onClick={() => handleImageClick(1)}
                  style={{ padding: 0 }}
                  disabled={clickCount >= maxRounds}
                >
                  <img
                    src={aicArt[leftRight[1]].imageUrl}
                    alt='No cheating!'
                    style={{
                      // maxWidth: '200px',
                      maxHeight: '300px',
                      objectFit: 'contain',
                    }}
                  />
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <Button
        style={{ width: '200px', height: '50px' }}
        variant='secondary'
        disabled={clickCount < maxRounds}
        onClick={() => {
          handlePlayClick();
        }}
      >
        END GAME
      </Button>
    </Container>
  );
}

export default PlayGame;
