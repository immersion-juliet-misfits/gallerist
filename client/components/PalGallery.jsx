import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import PalGalleryItem from './PalGalleryItem';

function PalGallery() {
  const { user } = useParams();
  // use useState to define an images array and method to store and update gallery images
  // use useState to define a user array and set the values on the array
  const [images, setImages] = useState([]);

  // use useState to define a user showcases array and set the values on the array
  const [showcases, setShowcases] = useState([]);

  // use an axios request to get a list of filtered images from art db based on friends or some key
  // pass in a word to filter by, possibly a friend's username
  const getFilteredImages = useCallback(
    (filter) => {
      axios(`/db/art/${filter}`)
        .then((art) => {
          setImages(art.data);
        })
        .catch((err) => console.log('get filtered images failed', err));
    },
    [images],
  );

  function getShowcases(curatorName) {
    axios
      .get(`/showcase/curator/${curatorName}`)
      .then(({ data }) => setShowcases(data))
      .catch((err) => console.error('Could not GET curator showcases: ', err));
  }

  // put the initial db request into useEffect to auto render images when you get to page
  useEffect(() => {
    getFilteredImages(user);
    getShowcases(user);
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <h1>
            <strong>{`${user}'s Gallery`}</strong>
          </h1>
        </Col>
      </Row>
      <Row>
        {images.map((image) => (
          <Col key={`${image._id}-${image.date}`}>
            <PalGalleryItem image={image} />
          </Col>
        ))}
      </Row>

      {showcases.length > 0 && (
        <>
          <Row className="mt-4">
            <Col>
              <h2>{`${user}'s Showcases`}</h2>
            </Col>
          </Row>
          <Row>
            {showcases.map((showcase) => (
              <Col md={4} key={showcase._id}>
                <Card className="mb-3">
                  <Card.Body>
                    <Card.Title>
                      {showcase.title}
                    </Card.Title>
                    <Card.Text>
                      {`${new Date(showcase.startDate).toLocaleDateString()} - ${new Date(showcase.endDate).toLocaleDateString()}`}
                    </Card.Text>
                    <Link to={`/home/showcase/${showcase._id}`}>
                      View Showcase
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
}

export default PalGallery;
