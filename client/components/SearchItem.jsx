import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';

function SearchItem({ image, idSearch }) {
  // modal state variable
  const [lgShow, setLgShow] = useState(false);

  return (
    <Col
      key={image.id}
    >
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
      <Button
        variant="outline"
        type="submit"
        onClick={() => {
          idSearch(image.id);
        }}
        style={{ paddingBottom: '20px' }}
      >
        ❤️
      </Button>
    </Col>
  );
}

SearchItem.propTypes = {
  image: PropTypes.object.isRequired,
  idSearch: PropTypes.func,
};

export default SearchItem;
