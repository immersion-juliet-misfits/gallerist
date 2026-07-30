import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

function ShowcaseList() {
  const [showcases, setShowcases] = useState([]);

  useEffect(() => {
    axios
      .get('/showcase/get')
      .then(({ data }) => setShowcases(data))
      .catch((err) => console.error('Could not GET showcases: ', err));
  }, []);

  return (
    <Container>
      <Row className="align-items-center mb-4">
        <Col>
          <h1 className="mb-1"><strong>Showcases</strong></h1>
          <p className="text-muted mb-0">Featured exhibitions from the gallery&apos;s top curators.</p>
        </Col>
        <Col xs="auto" className="d-flex align-items-center gap-3">
          <Button as={Link} to="/home/profile" variant="dark" size="lg">My Showcases</Button>
          <Button as={Link} to="/home/showcase/setup" variant="dark" size="lg">
            Create Showcase
          </Button>
        </Col>
      </Row>
      <Row>
        {showcases.map((showcase) => (
          <Col md={4} key={showcase._id}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>{showcase.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {`Curated by ${showcase.curatorName}`}
                </Card.Subtitle>
                <Card.Text>
                  {`${new Date(showcase.startDate).toLocaleDateString()} - ${new Date(showcase.endDate).toLocaleDateString()}`}
                </Card.Text>
                <Link to={`/home/showcase/${showcase._id}`}>View Showcase</Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ShowcaseList;
