/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-alert */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function BlackMarket() {
  const [listings, setListings] = useState([]);
  const [wallet, setWallet] = useState(0);
  const [vouchers, setVouchers] = useState(0);
  const [hagglesMade, setHagglesMade] = useState(0);
  const [showSellModal, setShowSellModal] = useState(false);
  const [userInventory, setUserInventory] = useState([]);
  const [haggleStatus, setHaggleStatus] = useState(''); // Status text

  const fetchData = () => {
    axios.get('/db/user/')
      .then((res) => {
        if (res.data) {
          setWallet(res.data.wallet);
          setVouchers(res.data.vouchers);
        }
      })
      .catch((err) => console.error(err));

    axios.get('/db/blackmarket')
      .then((res) => {
        setListings(res.data || []);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBuy = (id) => {
    axios.delete(`/db/blackmarket/buy/${id}`)
      .then(() => {
        setHagglesMade(0);
        fetchData();
      })
      .catch((err) => console.error(err));
  };

  const handleOpenSellModal = () => {
    axios.get('/db/userArt/')
      .then((res) => {
        setUserInventory(res.data || []);
        setShowSellModal(true);
      })
      .catch((err) => console.error('Failed to fetch user art', err));
  };

  const handleConfirmSell = (artId) => {
    axios.post(`/db/blackmarket/sell/${artId}`)
      .then(() => {
        setShowSellModal(false);
        fetchData();
      })
      .catch((err) => console.error('Failed to sell art', err));
  };

  const handleRedeemVoucher = () => {
    if (vouchers < 1) return;
    axios.patch('/db/blackmarket/voucher')
      .then(() => fetchData())
      .catch((err) => console.error(err));
  };

  const handleAttemptHaggle = () => {
    const listingIds = listings.map((item) => item._id);
    if (listingIds.length === 0) return;

    axios.patch('/db/blackmarket/haggle', { listingIds })
      .then((res) => {
        setListings(res.data.listings);
        setHagglesMade((prev) => prev + 1);
        setHaggleStatus(res.data.success ? ' (Success!)' : ' (Failed!)');
      })
      .catch((err) => {
        console.error(err);
        setHaggleStatus(' (Error)');
      });
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Black Market</h2>
        <h5 className="mb-0">
          Wallet: $
          {Number(wallet || 0).toFixed(2)}
        </h5>
      </div>

      <div className="p-4 mb-4" style={{ border: '4px solid black', backgroundColor: '#111' }}>
        <Row className="justify-content-center">
          {listings.map((item) => (
            <Col key={item._id} md={4} className="text-center mb-3">
              <h5
                className="text-white mb-0"
                style={{
                  backgroundColor: '#000',
                  padding: '8px',
                  border: '3px solid #00d2ff',
                  borderBottom: 'none',
                }}
              >
                {item.itemType === 'voucher' ? 'Mysterious Voucher' : 'Mystery Art'}
              </h5>

              <div className="p-3" style={{ border: '3px solid #00d2ff', backgroundColor: '#000' }}>
                <div className="bg-dark mb-3" style={{ height: '250px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={item.imageUrl || item.url || 'https://via.placeholder.com/250'}
                    alt={item.title || 'Market Item'}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/250';
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: 'scale(1.1)',
                    }}
                  />
                </div>
                <Button
                  variant="info"
                  className="w-100 fw-bold rounded"
                  style={{
                    backgroundColor: '#00d2ff',
                    color: '#000',
                    border: 'none',
                    padding: '10px',
                  }}
                  onClick={() => handleBuy(item._id)}
                >
                  BUY FOR: $
                  {item.price}
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      <Row className="text-center mt-5">
        <Col md={4}>
          <p className="fw-bold mb-2">
            vouchers owned: {vouchers}
          </p>
          <Button variant="dark" className="border border-info rounded px-4" onClick={handleRedeemVoucher}>Redeem Voucher</Button>
        </Col>
        <Col md={4}>
          <Button variant="dark" className="btn-lg border border-info rounded" onClick={handleOpenSellModal}>Sell Art</Button>
        </Col>
        <Col md={4}>
          <p className="fw-bold mb-2">
            haggles made: {hagglesMade} {haggleStatus}
          </p>
          <Button variant="dark" className="border border-info rounded px-4" onClick={handleAttemptHaggle}>Attempt Haggle</Button>
        </Col>
      </Row>

      <Modal show={showSellModal} onHide={() => setShowSellModal(false)} centered>
        <Modal.Header closeButton className="bg-dark text-white"><Modal.Title>Select Art</Modal.Title></Modal.Header>
        <Modal.Body className="bg-dark text-white">
          {userInventory.map((art) => (
            <div key={art._id} className="d-flex justify-content-between align-items-center mb-3">
              <span>{art.title || 'Untitled'}</span>
              <Button variant="info" size="sm" onClick={() => handleConfirmSell(art._id)}>Sell ($1000)</Button>
            </div>
          ))}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default BlackMarket;
