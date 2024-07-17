import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ArtHeist() {
  const [input, setInput] = useState('');
  const [passcode, setPasscode] = useState([]);

  function getArtOwners() {
    axios.get('/db/artOwners/')
      .then(({ data }) => {
        console.log(data, 'others art');
      })
      .catch((err) => console.error('Could not GET users who currently own art', err));
  }

  function handleInput(e) {
    console.log(e.target.value);
    setInput(e.target.value);
  }

  function handleSetPasscode() {
    console.log(input.split(''));
    setPasscode(input.split(''));
  }

  function handleVaultMount() {
    // console.log()
    axios.post('/db/security')
      .then((data) => {
        console.log(data, 'attempt');
      });
  }

  useEffect(() => {
    getArtOwners();
    // console.log(input, 'input');
    // handleSetPasscode();
    handleVaultMount();
    console.log(passcode, 'passcode');
  }, [passcode]);

  return (
    <div>
      <h1>Art Heist</h1>
      <h5>Set code</h5>
      <input type="text" maxLength="5" size="5" onChange={(e) => handleInput(e)} />
      <br />
      <br />
      <input type="button" value="Set Passcode" onClick={() => handleSetPasscode()} />
    </div>
  );
}

export default ArtHeist;
