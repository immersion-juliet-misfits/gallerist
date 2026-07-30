import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';

import CommentsList from './CommentsList';

function CommentsView({
  showComments,
  setShowComments,
  comments,
  retrieveComments,
  image,
}) {
  return (
    <div>
      <Modal
        show={showComments}
        onHide={() => setShowComments(false)}
        // style={{ 'max-width': '800px' }}
        contentClassName="comments-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {image.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Image
            style={{ width: '90%', height: 'auto', display: 'inline-block' }}
            src={image.imageUrl}
            id={image._id}
            alt={image.title}
          />
          <CommentsList id={image._id} comments={comments} retrieveComments={retrieveComments} />
        </Modal.Body>
        <Modal.Footer>
          {image.userGallery ? `Curated by: ${image.userGallery.name}` : null}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CommentsView;
