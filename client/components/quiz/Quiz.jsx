/* eslint-disable no-plusplus */
/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-quotes */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import StartGame from './startGame';
import PlayGame from './playGame';
import EndGame from './endGame';

function Quiz() {
  const [userName, setUserName] = useState('');
  const [wallet, setWallet] = useState(0);
  const [startGame, setStartGame] = useState(true);
  const [playGame, setPlayGame] = useState(false);
  const [endGame, setEndGame] = useState(false);
  const [aicArt, setAicArt] = useState([]);
  const [clickCount, setClickCount] = useState(0);
  const [maxRounds, setMaxRounds] = useState(5);
  const [currScore, setCurrScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [runScore, setRunScore] = useState(0);
  const [streak, setStreak] = useState(1);
  const [leftRight, setLeftRight] = useState([0, 1]);
  const [titleRound, setTitleRound] = useState(0);

  const displayedTitle = aicArt[leftRight[titleRound]]?.title;

  const getUserData = () => {
    axios
      .get('/db/user/')
      .then(({ data }) => {
        setWallet(data.wallet);
        setUserName(data.name);
      })
      .catch((err) => console.error('Could not GET wallet amount: ', err));
  };

  const updateWallet = (name, score) => {
    axios
      .put(`/db/giveMoney/${name}`, { price: score })
      .then(() => {
        getUserData();
        console.log('Reward: Success');
      })
      .catch((err) => {
        console.error('Reward: Failed ', err);
      });
  };

  const getScore = () => {
    axios
      .get('/db/user/')
      .then(({ data }) => {
        if (data.quizHighScore === undefined) {
          axios
            .put(`/db/user/${data._id}`, { quizHighScore: 0 })
            .then(() => {
              setHighScore(0);
            })
            .catch((err) => console.error('POST High Score: Failed ', err));
        } else {
          setHighScore(data.quizHighScore);
        }
      })
      .catch((err) => console.error('GET High Score: Failed ', err));
  };

  const updateCurrScore = (title) => {
    if (title === displayedTitle) {
      console.log('CORRECT!!!');
      const newStreak = streak * 2;
      setStreak(newStreak);
      setCurrScore(currScore + 5 * newStreak);
    } else {
      console.log('Sorry...');
      setStreak(1);
    }
  };

  const updateScore = () => {
    if (currScore > highScore) {
      axios
        .get('/db/user/')
        .then(({ data }) => {
          axios
            .put(`/db/user/${data._id}`, { quizHighScore: currScore })
            .then(() => {
              setHighScore(currScore);
            })
            .catch((err) => console.error('High Score Update: Failed ', err));
        })
        .catch((err) => console.error('GET User ID: Failed ', err));
    }
  };

  const getRunScore = () => {
    axios
      .get('/db/user/')
      .then(({ data }) => {
        if (data.quizTotalScore === undefined) {
          axios
            .put(`/db/user/${data._id}`, { quizTotalScore: 0 })
            .then(() => {
              setRunScore(0);
            })
            .catch((err) => console.error('POST High Score: Failed ', err));
        } else {
          setRunScore(data.quizTotalScore);
        }
      })
      .catch((err) => console.error('GET Running Total Score: Failed ', err));
  };

  const updateRunScore = () => {
    axios
      .put('/db/userRunningScore', { currScore })
      .then((newScore) => {
        setRunScore(newScore.data.quizTotalScore);
      })
      .catch((err) => {
        console.error('Running Total Score Update: Failed ', err);
      });
  };

  const getArt = () => {
    for (let x = 0; x < 5; x++) {
      axios
        .get('/db/aicapi')
        .then((response) => {
          const artData = response.data;
          return axios.post('/db/quizart', artData);
        })
        .then(() => {})
        .catch((err) => {
          console.error('AIC Art Add to DB: Failed: ', err);
        });
    }
  };

  function pullArt() {
    axios
      .get('/db/quizart')
      .then((data) => {
        setAicArt(data.data);
      })
      .catch((err) => console.error('DB Art Retrieval: Failed ', err));
  }

  function delArt() {
    axios
      .delete('/db/quizart')
      .then((response) => {
        if (response.status === 200) {
          // console.log('Quiz Art Deletion: Success ');
        } else if (response.status === 404) {
          console.error('Quiz Art Deletion: None Found ');
        }
      })
      .catch((err) => {
        console.error('Quiz Art Deletion: Failed ', err);
      });
  }

  const handleStartClick = () => {
    setAicArt([]);
    setStartGame(false);
    setPlayGame(true);
    getArt();
    setTimeout(() => {
      pullArt();
    }, 3000);
  };

  const handlePlayClick = () => {
    setPlayGame(false);
    setEndGame(true);
    updateWallet(userName, currScore);
    updateScore();
    updateRunScore();
  };

  const handleImageClick = (index, title) => {
    setClickCount(clickCount + 1);
    setLeftRight([leftRight[0] + 2, leftRight[1] + 2]);
    setTitleRound(Math.floor(Math.random() * 2));
    updateCurrScore(title);
  };

  const handleEndClick = () => {
    setEndGame(false);
    setStartGame(true);
    setClickCount(0);
    delArt();
    setLeftRight([0, 1]);
    setCurrScore(0);
    setStreak(1);
  };

  useEffect(() => {
    getUserData();
    getScore();
    getRunScore();
    console.log('aicArt state updated:', aicArt);
  }, [aicArt]);

  return (
    <Container
      style={{ height: '600px', maxWidth: '1000px', marginBottom: '40px' }}
    >
      <Row className='d-flex align-items-center'>
        <Col>
          <div className='d-flex'>
            <h3>Wallet:</h3>
            <h3 className='ms-2'>{wallet ? `$${wallet}` : '$0.00'}</h3>
            <h3 style={{ marginLeft: '50px' }}>High Score: {highScore}</h3>
            <h3 style={{ marginLeft: '50px' }}>
              Running Reward Total: {runScore}
            </h3>
          </div>
        </Col>
      </Row>
      <Row>
        {startGame && (
          <StartGame
            handleStartClick={handleStartClick}
            maxRounds={maxRounds}
          />
        )}
        {playGame && (
          <PlayGame
            handlePlayClick={handlePlayClick}
            handleImageClick={handleImageClick}
            aicArt={aicArt}
            clickCount={clickCount}
            maxRounds={maxRounds}
            currScore={currScore}
            leftRight={leftRight}
            titleRound={titleRound}
            setAicArt={setAicArt}
          />
        )}
        {endGame && (
          <EndGame handleEndClick={handleEndClick} currScore={currScore} />
        )}
      </Row>
    </Container>
  );
}

export default Quiz;
