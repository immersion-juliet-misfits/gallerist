import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';

function SearchItem({ image, idSearch, isOwned }) {
  // modal state variable
  const [lgShow, setLgShow] = useState(false);
  return (
    <Col key={image.id}>
      <Image
        className="search-image"
        style={{ width: '300px', height: 'auto' }}
        src={image.baseimageurl}
        id={image.id}
        alt={image.alttext}
        onClick={() => setLgShow(true)}
      />
      <Modal
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton />
        <Modal.Body>
          <img src={image.baseimageurl} alt={image.title} className="img-fluid" />
          {' '}
        </Modal.Body>
      </Modal>
      <br />

      {/* conditionally render the button based on global ownership */}
      {isOwned ? (
        <Button
          variant="secondary"
          disabled
          style={{ paddingBottom: '20px' }}
        >
          🔒 Claimed
        </Button>
      ) : (
        <Button
          variant="outline"
          type="submit"
          onClick={() => {
            idSearch(image.id);
          }}
          style={{ paddingBottom: '20px' }}
        >
          💲BUY💲
        </Button>
      )}
    </Col>
  );
}

SearchItem.propTypes = {
  image: PropTypes.object.isRequired,
  idSearch: PropTypes.func,
  isOwned: PropTypes.bool,
};

export default SearchItem;
