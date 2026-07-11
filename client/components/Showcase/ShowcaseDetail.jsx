import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Carousel from 'react-bootstrap/Carousel';

function ShowcaseDetail() {
  const { id } = useParams();
  const [showcase, setShowcase] = useState(null);
  const [playOrder, setPlayOrder] = useState([]);
  const [trackIndex, setTrackIndex] = useState(0);

  useEffect(() => {
    axios
      .get(`/showcase/get/${id}`)
      .then(({ data }) => setShowcase(data))
      .catch((err) => console.error('Could not GET showcase: ', err));
  }, [id]);

  useEffect(() => {
    if (!showcase) return;
    const tracks = showcase.playlist || [];
    if (showcase.shuffle) {
      const shuffled = [...tracks];
      for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setPlayOrder(shuffled);
    } else {
      setPlayOrder(tracks);
    }
    setTrackIndex(0);
  }, [showcase]);

  function handleTrackEnded() {
    setTrackIndex((prev) => (prev + 1) % playOrder.length);
  }

  if (!showcase) {
    return (
      <Container>
        <p>Loading showcase...</p>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        <h1>{showcase.title}</h1>
        <p>{`Curated by ${showcase.curatorName}`}</p>
        <p>{showcase.message}</p>
      </Row>
      <Row>
        <Carousel>
          {showcase.artPieces.map((art) => (
            <Carousel.Item key={art.imageId}>
              <img
                className="d-block w-100"
                src={art.imageUrl}
                alt={art.title}
                style={{ maxHeight: '500px', objectFit: 'contain' }}
              />
              <div className="text-center py-2">
                <h5 className="mb-0">{art.title}</h5>
                <p className="mb-0 text-muted">{art.artist}</p>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </Row>
      {playOrder.length > 0 && (
        <Row className="mt-3">
          <audio
            key={trackIndex}
            controls
            autoPlay
            src={playOrder[trackIndex]}
            onEnded={handleTrackEnded}
          >
            <track kind="captions" />
          </audio>
          <p className="text-muted mt-1">
            {`Now playing track ${trackIndex + 1} of ${playOrder.length}${showcase.shuffle ? ' (shuffled)' : ''}`}
          </p>
        </Row>
      )}
    </Container>
  );
}

export default ShowcaseDetail;
