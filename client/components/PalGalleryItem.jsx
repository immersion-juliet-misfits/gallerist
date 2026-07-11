import React from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

function PalGalleryItem({ image }) {
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
            />
            <br />
            <div className="gallery-title">
              {' '}
              {image.title}
            </div>
          </div>
          <Link to={`/home/art/${image._id}`}>Click here for more details...</Link>
          <br />
        </Col>
      </Row>
    </Container>
  );
}

export default PalGalleryItem;
