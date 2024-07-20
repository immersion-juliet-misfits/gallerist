import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import HeistArt from './HeistArt';

function HeistSuccess({ selectedVault }) {
//   const [] = useState();
  console.log(selectedVault._id);
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
        // console.log(data);
        setArt(data);
      });
  }

  return (
    <div>
      <h3>You're in. Take a piece of art, quick!</h3>
      <h3>{`${selectedVault.name}'s Art Vault`}</h3>
      <input type="button" value="Show Rewards" onClick={() => handleGetRewards()} />
      <Row>
        {Array.isArray(selectedVault.artGallery)
        && art.map((artwork, i) => (
          // <img src="https://nrs.harvard.edu/urn-3:HUAM:VRS80203_dynmc" alt="https://nrs.harvard.edu/urn-3:HUAM:VRS80203_dynmc" />
          // <h2>{art}</h2>
          <Col key={`${artwork.imageId}-${i}`}>
            <HeistArt artwork={artwork} />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default HeistSuccess;
