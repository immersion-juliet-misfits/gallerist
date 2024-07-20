import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function GalleryListItem({ image }) {
  // set up modal for friend request
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // add a friend to users friend array
  function addFriend(e) {
    axios.put('/db/friends/', { friend: e.target.value })
      .then((res) => {
        // use modal after friend is added
        if (res.status === 200) {
          handleShow();
        }
      })
      .catch((err) => console.log(err, 'friend not added'));
  }

  return (
    <Container fluid>
      <Row>
        <Col className="gallery-item" key={image.imageId}>
          <div>
            <Image
              className="gallery-image"
              style={{ width: '250px', height: 'auto' }}
              src={image.imageUrl}
              id={image.imageId}
              alt={image.title}
            />
            <br />
            <div className="gallery-title">
              {' '}
              {image.title}
            </div>
            <div>
              Curated by:
              {' '}
              {image.userGallery.name}
            </div>
            <Button variant="primary" value={image.userGallery.name} onClick={addFriend}>
              Add Friend
            </Button>
          </div>
          <Link to={`/home/art/${image.imageId}`}>Click here for more details...</Link>
          <br />
        </Col>
      </Row>
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>{'You\'ve got a new friend!'}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>

  );
}

export default GalleryListItem;
