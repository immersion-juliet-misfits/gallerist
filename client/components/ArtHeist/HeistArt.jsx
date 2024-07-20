import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { Link } from 'react-router-dom';

function HeistArt({ artwork }) {
  const [showArt, setShowArt] = useState(false);
  const [stolen, setStolen] = useState({});

  function handleTheft() {
    axios
      .post(`/db/stealArt/${artwork._id}`)
      .then(({ data }) => {
        console.log('Art stolen', data);
        setShowArt(true);
        setStolen(data);
      })
      .catch(() => {
        console.error('Error stealing artwork');
      });
  }

  function handleClose() {
    setShowArt(false);
  }

  return (
    <div>
      <Container fluid>
        <Row>
          <Col className="gallery-item" key={artwork.imageId}>
            <div>
              <Modal
                show={showArt}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
              >
                <Modal.Header>
                  <Modal.Title>{`${stolen.title} was added to your collection.`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  You guessed the entry code to the vault.
                  Now get out of here before you get caught!
                </Modal.Body>
                <Modal.Footer>
                  <Link to="/home/heist" relative="path">
                    <Button variant="secondary" onClick={handleClose}>
                      Leave the scene
                    </Button>
                  </Link>
                </Modal.Footer>
              </Modal>
              <Image
                style={{ width: '250px', height: 'auto' }}
                src={artwork.imageUrl}
                id={artwork.imageId}
                alt={artwork.title}
                onClick={() => handleTheft()}
              />
              <br />
              <div className="gallery-title">{artwork.title}</div>
            </div>
            <br />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default HeistArt;
