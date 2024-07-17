import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ArtHeist() {
  function getArtOwners() {
    axios.get('/db/artOwners/')
      .then(({ data }) => {
        console.log(data);
      })
      .catch((err) => console.error('Could not GET users who currently own art', err));
  }

  useEffect(() => {
    getArtOwners();
  }, []);

  return (
    <div>
      <h1>Art Heist</h1>
      <h3>Crack the Code</h3>
      <input />
    </div>
  );
}

export default ArtHeist;
