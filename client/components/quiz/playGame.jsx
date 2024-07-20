/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable object-curly-newline */
/* eslint-disable jsx-quotes */
import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

function PlayGame({
  handleImageClick,
  handlePlayClick,
  aicArt,
  clickCount,
  currScore,
  leftRight,
  maxRounds,
  setAicArt,
  titleRound,
}) {
  useEffect(() => {
    if (clickCount === maxRounds) {
      handlePlayClick();
      setAicArt([]);
    }
  }, [clickCount, maxRounds, handlePlayClick]);

  return (
    <Container
      style={{ height: '600px', maxWidth: '750px' }}
      className='d-flex flex-column align-items-center'
    >
      <Container style={{ marginBottom: '30px', marginTop: '20px' }}>
        <Row className='d-flex justify-content-center text-center'>
          <Col>
            <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
              Current Round: {clickCount + 1}
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
              "{aicArt[leftRight[titleRound]].title}"
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
                onClick={() => {
                  console.log('1st Title:', aicArt[leftRight[0]].title);
                  handleImageClick(0, aicArt[leftRight[0]].title);
                }}
                style={{ padding: 0 }}
                disabled={clickCount >= maxRounds}
              >
                <img
                  src={aicArt[leftRight[0]].imageUrl}
                  alt='No cheating!'
                  style={{
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
                  onClick={() => {
                    console.log('2nd Title:', aicArt[leftRight[1]].title);
                    handleImageClick(1, aicArt[leftRight[1]].title);
                  }}
                  style={{ padding: 0 }}
                  disabled={clickCount >= maxRounds}
                >
                  <img
                    src={aicArt[leftRight[1]].imageUrl}
                    alt='No cheating!'
                    style={{
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
    </Container>
  );
}

export default PlayGame;
