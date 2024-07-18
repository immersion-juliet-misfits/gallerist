/* eslint-disable jsx-quotes */
// import React, { useState, useEffect } from 'react';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';

// Pass in Axios requests from Quiz.jsx & state
function PlayGame({ onPlayClick, aicArt }) {
  // State Start

  // State End

  return (
    <Container
      style={{ maxWidth: '750px' }}
      className='d-flex flex-column align-items-center'
    >
      <h1> Play Game </h1>
      {aicArt.length > 0 ? (
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              width: '100%',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <h3>{aicArt[0].title}</h3>
              <img
                src={aicArt[0].imageUrl}
                alt={aicArt[0].title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  objectFit: 'contain',
                }}
              />
            </div>
            {aicArt.length > 1 && (
              <div style={{ textAlign: 'center' }}>
                <h3>{aicArt[2].title}</h3>
                <img
                  src={aicArt[2].imageUrl}
                  alt={aicArt[2].title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    objectFit: 'contain',
                  }}
                />
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
        onClick={onPlayClick}
      >
        END GAME
      </Button>
    </Container>
  );
}

export default PlayGame;
