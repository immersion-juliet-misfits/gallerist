import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import WatchItem from './Watch';

import LikeButtons from './social/LikeButtons';
import CommentsView from './social/comments/CommentsView';

function GalleryListItem({ image, users, getAllImages }) {
  // set up modal for friend request
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);

  const retrieveComments = () => {
    axios
      .get(`/social/comments/art/${image._id}`)
      .then(({ data }) => setComments(data))
      .catch((err) => {
        console.error('Failed to GET comments:', err);
      });
  };

  // add a friend to users friend array
  function addFriend(e) {
    axios.put('/db/friends/', { friend: e.target.value })
      .then((res) => {
        // use modal after friend is added
        if (res.status === 200) {
          handleShow();
        }
      })
      .catch((err) => console.log(err, 'Friend not added'));
  }

  return (
    <Container fluid>
      <Row>
        <Col className="gallery-item" key={image._id}>
          <div>
            <Image
              className="gallery-image"
              style={{ width: '250px', height: 'auto' }}
              src={image.imageUrl}
              id={image._id}
              alt={image.title}
              onClick={() => {
                setShowComments(true);
                retrieveComments();
              }}
            />
            <br />
            <div className="gallery-title">
              {' '}
              {image.title}
            </div>
            {image.userGallery && (
            <div>
              <div>
                Curated by:
                {' '}
                {image.userGallery.name}
              </div>
              <Button variant="primary" value={image.userGallery.name} onClick={addFriend}>
                Add Friend
              </Button>
              <WatchItem imgTitle={image.title} isForSale={image.isForSale} users={users} />
            </div>
            )}
          </div>
          <Link to={`/home/art/${image._id}`}>Click here for more details...</Link>
          <br />
          <LikeButtons image={image} getAllImages={getAllImages} />
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
      <CommentsView
        showComments={showComments}
        setShowComments={setShowComments}
        comments={comments}
        retrieveComments={retrieveComments}
        image={image}
      />
    </Container>

  );
}

export default GalleryListItem;
