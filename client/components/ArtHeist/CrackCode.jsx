import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeistSuccess from './HeistSuccess';
import HeistFailure from './HeistFailure';
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
  const [disableDrop, setDisableDrop] = useState(false);
  const [disableInput, setDisableInput] = useState(true);
  const [disableGuess, setDisableGuess] = useState(false);

  function getOtherVaults() {
    axios.get('/db/vault')
      .then(({ data }) => {
        setVaults(data);
      });
  }

  function handleSelectChange(e) {
    setDisableInput(() => !disableInput);
    if (e.target.value === 'Select a vault to heist') {
      console.log('Back to default');
    } else {
      axios.get(`/db/vault/${e.target.value}`)
        .then(({ data }) => {
          setSelectedVault(data);
          setDisableDrop(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
        setPrevious(input);
        setResult(true);
      })
      .catch(() => {
        console.error('inncorrect pw', input);
        setPrevious(input);
        if (attempts === 3) {
          setResult(false);
          setDisableInput(() => !disableInput);
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

  useEffect(() => {
    getOtherVaults();
  }, [selectedVault, input, previous]);

  function showColors(letter, i) {
    if (letter === selectedVault.code[i]) {
      return 'lime';
    }
    if (letter === selectedVault.code.split('')[i - 1] || letter === selectedVault.code.split('')[i + 1]) {
      return 'yellow';
    }
    return 'white';
  }

  return (
    <Container className="text-center">
      <h1><strong>Crack the Code</strong></h1>
      {selectedVault.name
      && <h4>{`${selectedVault.name}'s Vault`}</h4>}
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
      <Col md={7} className="mx-auto">
        <div className="dropdown">
          <Form.Select defaultValue="" disabled={disableDrop} onChange={(e) => handleSelectChange(e)}>
            <option>Select a vault to heist</option>
            {vaults.map((vault) => (
              <option key={vault._id} value={vault.owner}>{vault.name}</option>
            ))}
          </Form.Select>
        </div>
      </Col>
      <br />
      <br />
      <input type="text" disabled={disableInput} className="form-control mx-auto" maxLength="5" size="5" placeholder="Guess vault passcode" onChange={(e) => handleInput(e)} />
      <br />
      <br />
      <Button disabled={disableInput} onClick={() => handleGuess()}>Submit Guess</Button>
      {result && <HeistSuccess selectedVault={selectedVault} />}
      {!result && result !== null && <HeistFailure selectedVault={selectedVault} />}
      <Link to="/home/heist" relative="path">
        <Button>Back to Vault</Button>
      </Link>
    </Container>
  );
}

export default CrackCode;
