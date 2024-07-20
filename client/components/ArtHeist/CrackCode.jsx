import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeistSuccess from './HeistSuccess';
import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

function CrackCode() {
  const [input, setInput] = useState('');
  const [vaults, setVaults] = useState([]);
  const [selectedVault, setSelectedVault] = useState({});
  const [result, setResult] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [previous, setPrevious] = useState('');
//   function getOtherOwners() {
//     axios.get('/db/artOwners/')
//       .then(({ data }) => {
//         // console.log(data, 'others art');
//         data.map((art) => {
//             console.log(art.userGallery.name, 'indiv art')
//         })
//       })
//       .catch((err) => console.error('Could not GET users who currently own art', err));
//   }

  function getOtherVaults() {
    axios.get('/db/vault')
      .then(({ data }) => {
        // console.log('vaults', data);
        setVaults(data);
      });
  }

  function handleSelectChange(e) {
    // console.log(e.target.value);
    if (e.target.value === 'Select a vault to heist') {
      console.log('Back to default');
    } else {
      axios.get(`/db/vault/${e.target.value}`)
        .then(({ data }) => {
          setSelectedVault(data);
          // console.log('YEA', data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // setSelectedVault(e.target.value);
  }

  function handleInput(e) {
    setInput(e.target.value);
  }

  function handleGuess() {
    console.log(input, 'guessed');
    const { owner } = selectedVault;
    setAttempts(attempts + 1);
    axios.post('/db/guess', { owner, input })
      .then(({ data }) => {
        // console.log(data.code, 'correct guess', input);
        setPrevious(input);
        setResult(true);
      })
      .catch(() => {
        console.error('inncorrect pw', input);
        setPrevious(input);
        if (attempts === 3) {
          setResult(false);
          axios.put('/db/deductWallet', { price: 50 })
            .then(() => {
              console.log('You were fined for theft. - $50');
            })
            .catch(() => {
              console.error('You got away with the theft attemp...');
            });
        }
      });
  }

  // function handleAttempt() {
  //   setAttempts(attempts + 1);
  // }

//   useEffect(() => {
    
//   }, [result]);

  useEffect(() => {
    // getOtherOwners();
    getOtherVaults();
    // console.log(vaults, 'state');
    // console.log(selectedVault._id, 'state');
    // console.log(previous, 'state');
    // console.log(passcode, 'passcode');
  }, [selectedVault, input, previous]);

  function showColors(letter, i) {
    if (letter === selectedVault.code[i]) {
      return 'lime';
    }
    if (letter === selectedVault.code.split('')[i - 1] || letter === selectedVault.code.split('')[i + 1]) {
      // console.log('test here ', i, selectedVault.code[i + 1], selectedVault.code[i - 1])
      return 'yellow';
    }
    return 'white';
  }

  return (
    <Container className="text-center">
      <h1>Crack the Code</h1>
      {/* <h4 style={{ color: 'red' }}>{previous}</h4> */}
      {/* {previous.split('').map((letter) => (
        <>
          <h3>{letter}</h3>
        </>
      ))} */}
      {previous && (
      <Row>
        {previous.split('').map((letter, i) => (
          <Col key={i}>
            <Card
              style={{
                width: '200px',
                backgroundColor: 'black',
                color: showColors(letter, i),
                fontSize: '50px',
                border: !result ? '3px solid black' : '3px solid lime',
              }}
            >
              {letter}
            </Card>
          </Col>
        ))}
      </Row>
      )}
      <br />
      {/* <select onChange={(e) => handleSelectChange(e)}>
        <option>Select a vault to heist</option>
        {vaults.map((vault) => (
          <option key={vault._id} value={vault.owner}>{vault.name}</option>
        ))}
      </select> */}
      <Col md={7} className="mx-auto">
        <div className="dropdown">
          <Form.Select defaultValue="" onChange={(e) => handleSelectChange(e)}>
            <option>Select a vault to heist</option>
            {vaults.map((vault) => (
              <option key={vault._id} value={vault.owner}>{vault.name}</option>
            ))}
          </Form.Select>
        </div>
      </Col>
      {selectedVault.name
      && <h4>{`${selectedVault.name}'s Vault`}</h4>}
      <br />
      <br />
      <input type="text" className="form-control mx-auto" maxLength="5" size="5" placeholder="Guess vault passcode" onChange={(e) => handleInput(e)} />
      <br />
      <br />
      <Button onClick={() => handleGuess()}>Submit Guess</Button>
      {result && <HeistSuccess selectedVault={selectedVault} />}
      {!result && result !== null && <h2>Failed Attempt</h2>}
      <Link to="/home/heist" relative="path">
        <Button>Back to Vault</Button>
      </Link>
    </Container>
  );
}

export default CrackCode;