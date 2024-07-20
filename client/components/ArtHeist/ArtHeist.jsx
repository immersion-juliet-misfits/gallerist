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

//   function getArtOwners() {
//     axios.get('/db/artOwners/')
//       .then(({ data }) => {
//         console.log(data, 'others art');
//       })
//       .catch((err) => console.error('Could not GET users who currently own art', err));
//   }

  function handleInput(e) {
    console.log(e.target.value);
    setInput(e.target.value);
  }

  function handleSetPasscode() {
    console.log(input.split(''), 'box setup');
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
    // console.log()
    axios.post('/db/vault')
      .then((vault) => {
        console.log(vault, 'attempt');
      })
      .catch((err) => {
        console.error('Vault could not be found or created.', err);
      });
  }

  useEffect(() => {
    // getArtOwners();
    // console.log(input, 'input');
    // handleSetPasscode();
    handleVaultMount();
    console.log(passcode, 'passcode');
  }, [passcode]);

  return (
    <Container className="text-center">
      <h1>Art Heist</h1>
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
