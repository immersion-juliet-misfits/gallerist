import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';
import HeistArt from './HeistArt';

function HeistSuccess({ selectedVault }) {
//   const [] = useState();
console.log(selectedVault._id)
  const [art, setArt] = useState([]);

  // useEffect(() => {
  //   if (selectedVault && selectedVault._id) {
  //     console.log('nun yet');
  //     axios.get(`/db/heistVault/${selectedVault._id}`)
  //       .then((data) => {
  //         console.log(data);
  //       });
  //   } else {
  //     console.log('nononoonno')
  //   }
  // }, []);

  function handleGetRewards() {
    axios.get(`/db/heistVault/${selectedVault._id}`)
      .then(({ data }) => {
        console.log(data);
        setArt(data);
      });
  }

  return (
    <div>
      <h3>You did it!</h3>
      <input type="button" onClick={() => handleGetRewards()} />
      {Array.isArray(selectedVault.artGallery)
      && art.map((artwork) => (
        // <img src="https://nrs.harvard.edu/urn-3:HUAM:VRS80203_dynmc" alt="https://nrs.harvard.edu/urn-3:HUAM:VRS80203_dynmc" />
        // <h2>{art}</h2>
        <HeistArt artwork={artwork} />
      ))}
    </div>
  );
}

export default HeistSuccess;
