import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';

function HeistSuccess({ selectedVault }) {
//   const [] = useState();
  console.log(selectedVault.artGallery);
  if (Array.isArray(selectedVault.artGallery)) {
    console.log((selectedVault.artGallery[0]), 'hahaha');
  }
  return (
    <div>
      <h3>You did it!</h3>
      {Array.isArray(selectedVault.artGallery)
      && selectedVault.artGallery.map((art) => (
        <li>{art}</li>
      ))}
    </div>
  );
}

export default HeistSuccess;
