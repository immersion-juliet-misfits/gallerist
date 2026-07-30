import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import AuctionItem from './AuctionItem';

function Auction() {
  // State for displaying wallet funds and array of auction items for sale.
  const [auctionArray, setAuctionArray] = useState([]);
  const [wallet, setWallet] = useState(0);

  // State used to trigger component re-render when user purchases an item
  // setSale passed down to each AuctionItem to trigger re-render of parent component
  // i.e. send a db request to get updated auction list
  const [forSale, setSale] = useState(true);

  // Function to check funds of user's wallet and set wallet state
  function getWallet() {
    axios.get('/db/user/')
      .then(({ data }) => {
        setWallet(data.wallet);
      })
      .catch((err) => console.error('Could not GET wallet amount: ', err));
  }

  // Function to get array of all art objects where isForSale === true
  function getAuction() {
    return axios
      .get('/db/auction/')
      .then((response) => {
        setAuctionArray(response.data);
      })
      .catch((err) => console.error('Could not GET auction items: ', err));
  }

  // Initial render useEffect
  useEffect(() => {
    getAuction();
    getWallet();

    // While customer is located in Auction page, setInterval runs to update auction items
    // so that page reflects change if another user purchases an item from array
    const intervalId = setInterval(() => {
      axios
        .get('/db/auction/')
        .then(({ data }) => {
          // Only updates state if length of array is different from what it already is
          if (auctionArray.length !== data.length) {
            setAuctionArray(data);
          }
        })
        .catch((err) => console.error('Could not GET auction items: ', err));
    }, 2000);
    return () => clearInterval(intervalId);
  }, []);

  // useEffect executed every time user purchases something, so that auctionArray updates,
  // and wallet funds reflect purchase
  useEffect(() => {
    if (!forSale) {
      getAuction();
      getWallet();
      setSale(true);
    }
  }, [forSale]);

  // Maps over auctionArray to produce items,
  // pass setSale down as prop to trigger state change in parent
  const auctionItems = auctionArray.map((art) => (
    <AuctionItem key={art._id} art={art} setSale={setSale} />
  ));

  // Wallet not initialized when User created,
  // so ternary is for initial case if User still has an 'undefined' wallet
  return (
    <Container>
      <Row>
        <h3>Wallet:</h3>
        <h3>
          {wallet ? `$${wallet}` : '$0.00'}
        </h3>
      </Row>
      <Row>{auctionItems}</Row>
    </Container>
  );
}

export default Auction;
