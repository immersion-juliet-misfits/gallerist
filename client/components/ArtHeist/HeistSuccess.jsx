import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import HeistArt from './HeistArt';

function HeistSuccess({ selectedVault }) {
  const [art, setArt] = useState([]);

  function handleGetRewards() {
    axios.get(`/db/heistVault/${selectedVault._id}`)
      .then(({ data }) => {
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
          <Col key={`${artwork.imageId}-${i}`}>
            <HeistArt artwork={artwork} />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default HeistSuccess;
