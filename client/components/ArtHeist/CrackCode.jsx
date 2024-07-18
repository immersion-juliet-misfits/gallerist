import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';

function CrackCode() {
  const [vaults, setVaults] = useState([]);
  const [selectedVault, setSelectedVault] = useState({});
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
        console.log('vaults', data);
        setVaults(data);
      });
  }

  useEffect(() => {
    // getOtherOwners();
    getOtherVaults();
    console.log(vaults);
    // console.log(passcode, 'passcode');
  }, []);

  return (
    <div>
      <h4>Crack the Code</h4>
      <Link to="/home/heist" relative="path">
        <input type="button" value="Back to the Vault" />
      </Link>
      <br />
      <select>
        <option>Select a vault to heist</option>
        {vaults.map((vault) => (
          <option key={vault._id}>{vault.name}</option>
        ))}
      </select>
      {/* <h4></h4> */}
    </div>
  );
}

export default CrackCode;
