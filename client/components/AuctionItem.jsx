import React from 'react';
import axios from 'axios';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';

function AuctionItem({ art, setSale }) {
  // destructure props of art document and setSale method from parent

  // bidClick puts an update on art object, sets isForSale back to false
  // db router gets user's info from req.user to update userGallery based on who sends request
  // this is how ownership is reassigned.
  // (same endpoint used in profile for selling the artwork)
  function bidClick(event) {
    axios
      .put(`/db/art/${event.target.value}`, {
        isForSale: false,
        price: 0,
      })
      .then(() => setSale(false))
      .catch((err) => console.error('Could not Put update on artwork: ', err));
  }

  // Function for exchanging funds between wallet.
  // Just wrote two endpoints to increment one user's wallet field
  // And decrement (or increment negatively) the buyer's wallet
  function payOwner() {
    axios
      .put(`/db/giveMoney/${art.userGallery.name}`, {
        price: art.price,
      })
      .then(() => {
        // Similar to above function, router simply pulls user info out of request
        axios
          .put('/db/deductWallet/', {
            price: art.price,
          })
          .catch((err) => console.error('Could not deduct from wallet: ', err));
      })
      .catch((err) => console.error('Could not pay owner: ', err));
  }

  return (
    <Col>
      <Card style={{ width: '20rem' }}>
        <Card.Img
          variant="top"
          alt={art.title}
          // style={{ width: '250px', height: 'auto' }}
          src={art.imageUrl}
        />
        <Card.Body>
          <Card.Title>{art.title}</Card.Title>
          <Card.Text>{art.artist}</Card.Text>
          <Button
            onClick={(e) => {
              bidClick(e);
              payOwner();
            }}
            value={art._id}
            variant="outline-dark"
          >
            {`Buy from ${art.userGallery.name} for $${art.price}`}
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default AuctionItem;
