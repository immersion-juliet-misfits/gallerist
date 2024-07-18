import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
    <div>
      <h1>Art Heist</h1>
      <h5>Set code</h5>
      <input type="text" maxLength="5" size="5" onChange={(e) => handleInput(e)} />
      <br />
      <br />
      <input type="button" value="Set Passcode" onClick={() => handleSetPasscode()} />
      <Link to="/home/planHeist" relative="path">
        <input type="button" value="Plan a Heist" />
      </Link>
    </div>
  );
}

export default ArtHeist;
