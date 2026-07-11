import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function Profile() {
  const navigate = useNavigate();

  // Initialize three main parts of profile page
  const [name, setName] = useState('');
  const [friends, setFriends] = useState([]);
  const [wallet, setWallet] = useState(0); // added for price feature

  // used to set array of all art documents associated with user
  const [gallery, setGallery] = useState([]);

  // used to set array of all showcases (drafts and active) belonging to user
  const [myShowcases, setMyShowcases] = useState([]);

  // Price setting modal
  const [show, setShow] = useState(false);
  const closePriceModal = () => setShow(false);
  const showPriceModal = () => setShow(true);

  // Delete modal
  const [isVisible, setVis] = useState(false);
  const [message, setMessage] = useState('');
  const closeDelModal = () => setVis(false);
  const showDelModal = () => setVis(true);

  // Get request to return User profile, sets name and friends State
  function getProfile() {
    return axios
      .get('/db/user/')
      .then(({ data }) => {
        setName(data.name);
        setFriends(data.friends);
        setWallet(data.wallet);
      })
      .catch((err) => console.error('Could not GET user profile: ', err));
  }

  // Get request to return Art documents connected to User, sets gallery State
  function getUserGallery() {
    return axios
      .get('/db/userArt/')
      .then(({ data }) => {
        setGallery(data);
      })
      .catch((err) => console.error('Could not Get art by user: ', err));
  }

  // GET request to return all showcases (draft + active) belonging to User
  function getMyShowcases() {
    return axios
      .get('/showcase/mine')
      .then(({ data }) => {
        setMyShowcases(data);
      })
      .catch((err) => console.error('Could not GET my showcases: ', err));
  }

  // Initializing state on first render
  useEffect(() => {
    getProfile();
    getUserGallery();
    getMyShowcases();
  }, []);

  // State for price setting feature
  const [price, setPrice] = useState(0);
  const [id, setId] = useState(0);

  function putSale(_id) {
    axios
      .put(`/db/art/${_id}`, {
        isForSale: true,
        price,
      })
      .then(() => getUserGallery())
      .catch((err) => console.error('Could not Put update on artwork: ', err));
  }

  // Simple handle change for inputting sale price in price-setting modal
  function handleChange(event) {
    setPrice(event.target.value);
  }

  // Left for posterity's sake,
  // this was the original way to set art for sale before price was implemented
  // Way to putSale with only button, no pricing
  // Updates art object by changing isForSale field to true
  // function putSale(event) {
  //   axios
  //     .put(`/db/art/${event.target.value}`, {
  //       isForSale: true,
  //       price,
  //     })
  //     .then(() => getUserGallery())
  //     .catch((err) => console.error('Could not Put update on artwork: ', err));
  // }

  // Added complementary func for user to unlist item instead of going to Auction to buy it back
  function unlistSale(event) {
    axios
      .put(`/db/art/${event.target.value}`, {
        isForSale: false,
        price: 0,
      })
      .then(() => getUserGallery())
      .catch((err) => console.error('Could not Put update on artwork: ', err));
  }

  // Delete friend from friends' array on User document
  function unFriend(event) {
    axios
      .put('/db/unfriend/', { friend: event.target.value })
      .then(() => getProfile())
      .catch((err) => console.error('Could not unfriend: ', err));
  }

  // Deletes art object, then updates gallery State by invoking getUserGallery
  function deleteArt(event) {
    // Silly feature to randomly generate an art broker/dealer to purchase your deleted
    const brokerArray = [
      'Artie McBuyer',
      'Pinta Purchassini',
      'Monet Baggs',
      'Andrew Draw',
      'Picasso Paintman',
      'Guy Frames',
      'Vanessa Van Canvas',
    ];
    // Generates a random purchase price of 0 to 49
    const randomPrice = Math.floor(Math.random() * 50);
    // Randomly selects broker, pays random amount for deleting art. (I know, this makes no sense.)
    setMessage(
      `${
        brokerArray[Math.floor(Math.random() * brokerArray.length)]
      } bought your artwork for $${randomPrice}.`,
    );
    // Modal with the surprise news that your worthless art was actually worth something
    showDelModal();
    // Delete request to remove art document from database
    axios
      .delete(`/db/art/${event.target.value}`)
      .then(() => getUserGallery())
      .catch((err) => console.error('Could not Delete art: ', err));
    // Put request to add funds to user's wallet
    axios
      .put(`/db/giveMoney/${name}`, {
        price: randomPrice,
      })
      .then(() => getProfile())
      .catch((err) => console.error('Could not get paid by Artie McBuyer: ', err));
  }

  // Navigate to Showcase Studio with the showcase preloaded for editing
  function editShowcase(showcase) {
    navigate('/home/showcase/setup', { state: { showcase } });
  }

  // Flip a draft showcase to published
  function publishShowcase(id) {
    axios
      .patch(`/showcase/update/${id}`, { isDraft: false })
      .then(() => getMyShowcases())
      .catch((err) => console.error('Could not publish showcase: ', err));
  }
  // Delete a showcase, draft or active
  function deleteShowcase(id, title) {
    // eslint-disable-next-line no-alert
    if (!window.confirm(`Delete "${title}"? This can't be undone.`)) {
      return;
    }
    axios
      .delete(`/showcase/delete/${id}`)
      .then(() => getMyShowcases())
      .catch((err) => console.error('Could not DELETE showcase: ', err));
  }

  // Iterate over friends array, could be improved by linking to friend's gallery perhaps
  // Returns a ListGroup of Friends, with X button to 'unfriend'
  const friendsDiv = friends.length ? (
    <ListGroup>
      {friends.map((pal, i) => (
        <ListGroup.Item key={`${pal}-${i}`}>
          <Container>
            <Row>
              <Col sm="2">
                <Button
                  variant="outline"
                  type="button"
                  size="sm"
                  value={pal}
                  onClick={unFriend}
                >
                  ❌
                </Button>
              </Col>
              <Col sm="10">
                <Link to={`/home/palGal/${pal}`}>{pal}</Link>
              </Col>
            </Row>
          </Container>
        </ListGroup.Item>
      ))}
    </ListGroup>
  ) : (
    <ListGroup>
      <ListGroup.Item>You have no friends.</ListGroup.Item>
    </ListGroup>
  );

  // Iterates over gallery array, creates react-bootstrap Accordion Component
  // Each Item of Accordion is a ListGroup, each ListGroup.Item is art title and artist
  // with a couple of buttons to sell at auction, or delete, links to image url
  const artDiv = gallery ? (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Artworks:</Accordion.Header>
        <Accordion.Body>
          <ListGroup>
            {gallery
              .filter((art) => !art.isForSale)
              .map((art, i) => (
                <ListGroup.Item key={`${art}-${i}`}>
                  <Container>
                    <Row>
                      <Col sm="10">
                        <Row>
                          <Link to={`/home/art/${art._id}`}>
                            <strong>{art.title}</strong>
                          </Link>
                        </Row>
                        <Row>{art.artist}</Row>
                      </Col>
                      <Col sm="1">
                        <Button
                          variant="outline-success"
                          type="button"
                          value={art._id}
                          // onClick={putSale}
                          onClick={(e) => {
                            setId(e.target.value);
                            showPriceModal();
                          }}
                        >
                          Sell
                        </Button>
                      </Col>
                      <Col sm="1">
                        <Button
                          variant="outline"
                          type="button"
                          value={art._id}
                          onClick={deleteArt}
                        >
                          ❌
                        </Button>
                      </Col>
                    </Row>
                  </Container>
                </ListGroup.Item>
              ))}
          </ListGroup>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Art For Sale:</Accordion.Header>
        <Accordion.Body>
          <ListGroup>
            {gallery
              .filter((art) => art.isForSale)
              .map((art, i) => (
                <ListGroup.Item key={`${art}-${i}`}>
                  <Container>
                    <Row>
                      <Col sm="10">
                        <Row>
                          <Link to={`/home/art/${art._id}`}>
                            <strong>{art.title}</strong>
                          </Link>
                        </Row>
                        <Row>{art.artist}</Row>
                      </Col>
                      <Col sm="1">
                        <Button
                          variant="outline-warning"
                          type="button"
                          value={art._id}
                          onClick={unlistSale}
                        >
                          Unlist
                        </Button>
                      </Col>
                      <Col sm="1">
                        <Button
                          variant="outline"
                          type="button"
                          value={art._id}
                          onClick={deleteArt}
                        >
                          ❌
                        </Button>
                      </Col>
                    </Row>
                  </Container>
                </ListGroup.Item>
              ))}
          </ListGroup>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  ) : (
    <ListGroup>
      <ListGroup.Item>You have 0 artworks.</ListGroup.Item>
    </ListGroup>
  );

  // Iterates over myShowcases, splitting into Draft/Active accordion groups
  // Drafts get Edit/Publish/Delete; Active (published) get Edit/Delete plus a link to view
  const showcasesDiv = myShowcases.length ? (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Draft Showcases:</Accordion.Header>
        <Accordion.Body>
          <ListGroup>
            {myShowcases.filter((showcase) => showcase.isDraft).length ? (
              myShowcases
                .filter((showcase) => showcase.isDraft)
                .map((showcase) => (
                  <ListGroup.Item key={showcase._id}>
                    <Container>
                      <Row>
                        <Col sm="7">
                          <strong>
                            {showcase.title || 'Untitled Showcase'}
                          </strong>
                        </Col>
                        <Col sm="2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => editShowcase(showcase)}
                          >
                            Edit
                          </Button>
                        </Col>
                        <Col sm="2">
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => publishShowcase(showcase._id)}
                          >
                            Publish
                          </Button>
                        </Col>
                        <Col sm="1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteShowcase(showcase._id, showcase.title)}
                          >
                            ❌
                          </Button>
                        </Col>
                      </Row>
                    </Container>
                  </ListGroup.Item>
                ))
            ) : (
              <ListGroup.Item>No draft showcases.</ListGroup.Item>
            )}
          </ListGroup>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Active Showcases:</Accordion.Header>
        <Accordion.Body>
          <ListGroup>
            {myShowcases.filter((showcase) => !showcase.isDraft).length ? (
              myShowcases
                .filter((showcase) => !showcase.isDraft)
                .map((showcase) => (
                  <ListGroup.Item key={showcase._id}>
                    <Container>
                      <Row>
                        <Col sm="8">
                          <Link to={`/home/showcase/${showcase._id}`}>
                            <strong>{showcase.title}</strong>
                          </Link>
                        </Col>
                        <Col sm="2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => editShowcase(showcase)}
                          >
                            Edit
                          </Button>
                        </Col>
                        <Col sm="2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteShowcase(showcase._id, showcase.title)}
                          >
                            ❌
                          </Button>
                        </Col>
                      </Row>
                    </Container>
                  </ListGroup.Item>
                ))
            ) : (
              <ListGroup.Item>No active showcases.</ListGroup.Item>
            )}
          </ListGroup>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  ) : (
    <ListGroup>
      <ListGroup.Item>You have no showcases yet.</ListGroup.Item>
    </ListGroup>
  );

  return (
    <Container>
      <Row>
        <Col sm="4">
          <Link to={`/home/palGal/${name}`}>
            <h2>
              <strong>{name}</strong>
            </h2>
          </Link>
          <br />
        </Col>
        <Col sm="6">
          <h3>Friends:</h3>
          {friendsDiv}
        </Col>
        <Col sm="2">
          <h4>Wallet:</h4>
          {wallet ? `$${wallet}` : '$0.00'}
        </Col>
      </Row>
      <Row>
        <Container>
          <h3>Gallery:</h3>
          {artDiv}
        </Container>
      </Row>
      <Row>
        <Container>
          <h3>Showcases:</h3>
          {showcasesDiv}
        </Container>
      </Row>

      <Modal show={isVisible} onHide={closeDelModal}>
        <Modal.Header>
          <Modal.Title>Congratulations</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            type="submit"
            onClick={() => closeDelModal()}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show} onHide={closePriceModal} autoFocus={false}>
        <Modal.Header>
          <Modal.Title>Set Price</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Price: </Form.Label>
            <Form.Control
              autoFocus
              type="number"
              onChange={handleChange}
              placeholder="0"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            type="submit"
            onClick={() => {
              putSale(id);
              closePriceModal();
            }}
          >
            List for Sale
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

// Really should have re-factored toward the end there, make each modal its own file.
// Perhaps even make the friendsDiv and artDiv its own file

export default Profile;
