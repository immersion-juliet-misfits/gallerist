import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';

function ArtHeist() {
  const [input, setInput] = useState('');
  const [passcode, setPasscode] = useState('');

  function handleInput(e) {
    setInput(e.target.value);
  }

  function handleSetPasscode() {
    setPasscode(input);
    axios.patch('/db/vault/', { code: input })
      .then(() => {
        console.log('Passcode successfully set.');
      })
      .catch((err) => {
        console.error('Passcode could not be set.', err);
      });
  }

  function handleVaultMount() {
    axios.post('/db/vault')
      .then(() => {
        console.log('Vaults mounted');
      })
      .catch((err) => {
        console.error('Vault could not be found or created.', err);
      });
  }

  useEffect(() => {
    handleVaultMount();
  }, [passcode]);

  return (
    <Container className="text-center">
      <h1><strong>Art Heist</strong></h1>
      <h5>Set code</h5>
      <input type="text" maxLength="5" size="5" onChange={(e) => handleInput(e)} />
      <br />
      <br />
      <Button onClick={() => handleSetPasscode()}>Set Passcode</Button>
      <Link to="/home/planHeist" relative="path">
        <Button variant="dark">Plan a Heist</Button>
      </Link>
    </Container>
  );
}

export default ArtHeist;
