import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';

const TRACKS = [
  { label: 'amb062', value: '/audio/amb062.m4a' },
  { label: 'amb064_08vx', value: '/audio/amb064_08vx.m4a' },
  { label: 'amb064_21', value: '/audio/amb064_21.m4a' },
  { label: 'dyingRecursively-yes', value: '/audio/dyingRecursively-yes.m4a' },
  { label: 'dyingRecursively', value: '/audio/dyingRecursively.m4a' },
  {
    label: 'forSleepersAndInsomniacs',
    value: '/audio/forSleepersAndInsomniacs.m4a',
  },
  { label: 'leaking', value: '/audio/leaking.m4a' },
  { label: 'noEndpoint', value: '/audio/noEndpoint.m4a' },
];

function ShowcaseSetup() {
  const location = useLocation();
  const navigate = useNavigate();

  const [myArt, setMyArt] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [playlist, setPlaylist] = useState([]);
  const [shuffle, setShuffle] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [auctionDate, setAuctionDate] = useState('');
  const [artPieces, setArtPieces] = useState([]);

  function loadForEdit(showcase) {
    setEditingId(showcase._id);
    setTitle(showcase.title || '');
    setMessage(showcase.message || '');
    setPlaylist(showcase.playlist || []);
    setShuffle(!!showcase.shuffle);
    setStartDate(showcase.startDate ? showcase.startDate.slice(0, 10) : '');
    setEndDate(showcase.endDate ? showcase.endDate.slice(0, 10) : '');
    setAuctionDate(
      showcase.auctionDate ? showcase.auctionDate.slice(0, 10) : '',
    );
    setArtPieces(
      (showcase.artPieces || []).map((art) => (typeof art === 'string' ? art : art._id)),
    );
  }

  useEffect(() => {
    axios
      .get('/db/userArt/')
      .then(({ data }) => setMyArt(data))
      .catch((err) => console.error('Could not GET my art: ', err));

    if (location.state?.showcase) {
      loadForEdit(location.state.showcase);
    }
  }, []);

  function resetForm() {
    setEditingId(null);
    setTitle('');
    setMessage('');
    setPlaylist([]);
    setShuffle(false);
    setStartDate('');
    setEndDate('');
    setAuctionDate('');
    setArtPieces([]);
  }

  function toggleArt(artId) {
    setArtPieces((prev) => (prev.includes(artId)
      ? prev.filter((id) => id !== artId)
      : [...prev, artId]));
  }

  function togglePlaylistTrack(value) {
    setPlaylist((prev) => (prev.includes(value)
      ? prev.filter((v) => v !== value)
      : [...prev, value]));
  }

  function moveTrack(index, direction) {
    setPlaylist((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function removeTrack(value) {
    setPlaylist((prev) => prev.filter((v) => v !== value));
  }

  function handleSave(isDraft) {
    const payload = {
      title,
      message,
      playlist,
      shuffle,
      startDate,
      endDate,
      auctionDate,
      artPieces,
      isDraft,
    };

    const request = editingId
      ? axios.patch(`/showcase/update/${editingId}`, payload)
      : axios.post('/showcase/create', payload);

    request
      .then(({ data }) => {
        navigate(isDraft ? '/home/profile' : `/home/showcase/${data._id}`);
      })
      .catch((err) => console.error('Could not save showcase: ', err));
  }

  function handleSubmit(event) {
    event.preventDefault();
    handleSave(false);
  }

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <h1>
            <strong>Showcase Studio</strong>
          </h1>
          <p className="text-muted mb-0">
            {editingId
              ? 'Update the details of your showcase.'
              : 'Curate a new showcase from your gallery.'}
          </p>
        </Col>
      </Row>

      <Card>
        <Card.Header as="h5">
          {editingId ? 'Edit Showcase' : 'Create Showcase'}
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Add Tracks</Form.Label>
              {TRACKS.map((track) => (
                <Form.Check
                  key={track.value}
                  type="checkbox"
                  label={track.label}
                  checked={playlist.includes(track.value)}
                  onChange={() => togglePlaylistTrack(track.value)}
                />
              ))}
            </Form.Group>

            {playlist.length > 0 && (
              <Form.Group className="mb-3">
                <Form.Label>Playback Order</Form.Label>
                <ListGroup>
                  {playlist.map((value, index) => {
                    const track = TRACKS.find((t) => t.value === value);
                    return (
                      <ListGroup.Item
                        key={value}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <span>{`${index + 1}. ${track ? track.label : value}`}</span>
                        <div>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="me-1"
                            disabled={index === 0}
                            onClick={() => moveTrack(index, -1)}
                          >
                            {'\u2191'}
                          </Button>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="me-1"
                            disabled={index === playlist.length - 1}
                            onClick={() => moveTrack(index, 1)}
                          >
                            {'\u2193'}
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeTrack(value)}
                          >
                            Remove
                          </Button>
                        </div>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="shuffle-switch"
                label="Play in random order"
                checked={shuffle}
                onChange={(e) => setShuffle(e.target.checked)}
              />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              {/* - Auction Date input intentionally hidden.
                  - auctionDate is still tracked in:
                    state, loadForEdit, resetForm, and the save payload.
                  - A future cohort can pick up the 'exclusive auctions' feature
                  from documentation by uncommenting this Col and
                  building the auction logic around it. */}
              {/* <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Auction Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={auctionDate}
                    onChange={(e) => setAuctionDate(e.target.value)}
                  />
                </Form.Group>
              </Col> */}
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Choose Art From Your Gallery</Form.Label>
              {myArt.map((art) => (
                <Form.Check
                  key={art._id}
                  type="checkbox"
                  label={`${art.title} - ${art.artist}`}
                  checked={artPieces.includes(art._id)}
                  onChange={() => toggleArt(art._id)}
                />
              ))}
            </Form.Group>

            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => handleSave(true)}
            >
              Save Draft
            </Button>
            <Button variant="primary" type="submit" className="ms-2">
              Publish
            </Button>
            {editingId && (
              <Button variant="secondary" className="ms-2" onClick={resetForm}>
                Cancel Edit
              </Button>
            )}
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ShowcaseSetup;
