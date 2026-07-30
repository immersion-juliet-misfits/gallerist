import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

// eslint-disable-next-line import/no-unresolved
import TRACKS from './tracks';

function ShowcaseSetup() {
  const location = useLocation();
  const navigate = useNavigate();

  const [myArt, setMyArt] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setdescription] = useState('');
  const [playlist, setPlaylist] = useState([]);
  const [shuffle, setShuffle] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [auctionDate, setAuctionDate] = useState('');
  const [artPieces, setArtPieces] = useState([]);
  const [saveError, setSaveError] = useState('');

  function loadForEdit(showcase) {
    setEditingId(showcase._id);
    setTitle(showcase.title || '');
    setdescription(showcase.description || '');
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
    setdescription('');
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

  function toggleAllArt() {
    setArtPieces((prev) => (prev.length === myArt.length
      ? [] : myArt.map((art) => art._id)));
  }

  function togglePlaylistTrack(value) {
    setPlaylist((prev) => (prev.includes(value)
      ? prev.filter((v) => v !== value)
      : [...prev, value]));
  }

  function toggleAllTracks() {
    setPlaylist((prev) => (prev.length === TRACKS.length ? [] : TRACKS.map((t) => t.value)));
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

  function handleSave(isDraft) {
    setSaveError('');
    const payload = {
      title,
      description,
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
      .catch((err) => {
        if (err.response && err.response.status === 409) {
          setSaveError(
            'One or more selected art pieces are already in another showcase. Deselect them and try again.',
          );
        } else {
          console.error('Could not save showcase: ', err);
        }
      });
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
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={description}
                onChange={(e) => setdescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tracks</Form.Label>
              <Form.Check
                type="checkbox"
                label="Select All"
                className="mb-2 fw-bold"
                checked={TRACKS.length > 0 && playlist.length === TRACKS.length}
                onChange={toggleAllTracks}
              />
              <Row>
                <Col md={6}>
                  <Form.Label className="small text-muted">Available</Form.Label>
                  {TRACKS.filter((track) => !playlist.includes(track.value)).map((track) => (
                    <Form.Check
                      key={track.value}
                      type="checkbox"
                      label={track.label}
                      checked={false}
                      onChange={() => togglePlaylistTrack(track.value)}
                    />
                  ))}
                </Col>
                <Col md={6}>
                  <Form.Label className="small text-muted">Playlist (Playback Order)</Form.Label>
                  {playlist.map((value, index) => {
                    const track = TRACKS.find((t) => t.value === value);
                    return (
                      <div key={value} className="d-flex align-items-center mb-1">
                        <Form.Check
                          type="checkbox"
                          label={track ? track.label : value}
                          checked
                          onChange={() => togglePlaylistTrack(value)}
                          className="flex-grow-1"
                        />
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
                          disabled={index === playlist.length - 1}
                          onClick={() => moveTrack(index, 1)}
                        >
                          {'\u2193'}
                        </Button>
                      </div>
                    );
                  })}
                </Col>
              </Row>
            </Form.Group>
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
              <Form.Check
                type="checkbox"
                label="Select All"
                className="mb-2 fw-bold"
                checked={myArt.length > 0 && artPieces.length === myArt.length}
                onChange={toggleAllArt}
              />
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
            {saveError && <p className="text-danger mt-2">{saveError}</p>}
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ShowcaseSetup;
