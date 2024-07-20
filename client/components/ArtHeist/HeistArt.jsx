import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import { Link } from 'react-router-dom';

function HeistArt({ artwork }) {
  // console.log(artwork);
  //   const [] = useState();

  function handleTheft() {
    axios.post(`/db/stealArt/${artwork._id}`)
      .then(({ data }) => {
        console.log('Art stolen', data);
      })
      .catch(() => {
        console.error('Error stealing artwork');
      });
  }

  return (
    <div>
      {/* <h5>{artwork.title}</h5> */}
      <Container fluid>
        <Row>
          <Col className="gallery-item" key={artwork.imageId}>
            <div>
              <Link to="/home/heist" relative="path">
                <Image
                  style={{ width: '250px', height: 'auto' }}
                  src={artwork.imageUrl}
                  id={artwork.imageId}
                  alt={artwork.title}
                  onClick={() => handleTheft()}
                />
              </Link>
              <br />
              <div className="gallery-title">
                {artwork.title}
              </div>
            </div>
            <br />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default HeistArt;
