/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-alert */
import React, {
  useState, useEffect, useMemo, useRef,
} from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

// different seeds to provide unique starting points for styling (avoids voucher repeat styling)
const seedsForStyles = [11, 27, 42, 58, 73, 60, 46, 30, 15];

function BlackMarket() {
  const [listings, setListings] = useState([]);
  const [wallet, setWallet] = useState(0);
  const [vouchers, setVouchers] = useState(0);
  const [hagglesMade, setHagglesMade] = useState(0);
  const [showSellModal, setShowSellModal] = useState(false);
  const [userInventory, setUserInventory] = useState([]);
  // the status text for haggle
  const [haggleStatus, setHaggleStatus] = useState('');
  // state for revealing an item's actual appearance
  const [revealItem, setRevealItem] = useState(null);
  // creating a cache for warped styling
  const styleCacheRef = useRef({});

  const fetchUser = () => {
    axios.get('/db/user/')
      .then((res) => {
        if (res.data) {
          setWallet(res.data.wallet);
          setVouchers(res.data.vouchers);
        }
      })
      .catch((err) => console.error(err));
  };

  const fetchListings = () => {
    axios.get('/db/blackmarket')
      .then((res) => {
        setListings(res.data || []);
      })
      .catch((err) => console.error(err));
  };

  const fetchData = () => {
    fetchUser();
    fetchListings();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBuy = (id) => {
    const purchasedItem = listings.find((item) => item._id === id);
    if (!purchasedItem) return;

    axios.delete(`/db/blackmarket/buy/${id}`, { data: { price: purchasedItem.price } })
      .then(() => {
        setHagglesMade(0);
        setHaggleStatus('');
        setRevealItem(purchasedItem);
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
      .then(() => fetchUser())
      .catch((err) => console.error(err));
  };

  const handleAttemptHaggle = () => {
    if (listings.length === 0) return;

    const artListingIds = listings
      .filter((item) => item.itemType !== 'voucher')
      .map((item) => item._id);

    const vouchersList = listings.filter((item) => item.itemType === 'voucher');

    axios.patch('/db/blackmarket/haggle', {
      listingIds: artListingIds,
      vouchers: vouchersList,
    })
      .then((res) => {
        const updatedListings = [...res.data.listings, ...res.data.vouchers];
        const updatedById = {};
        updatedListings.forEach((updated) => {
          updatedById[updated._id] = updated;
        });

        setListings((prev) => prev.map((item) => updatedById[item._id] || item));
        setHagglesMade((prev) => prev + 1);
        setHaggleStatus(res.data.success ? ' (Success!)' : ' (Failed!)');
      })
      .catch((err) => {
        console.error(err);
        setHaggleStatus(' (Error)');
      });
  };

  // useMemo caches calculations- will only recalc if dependencies change
  // this prevents assigning new styles on unrelated state changes (like opening the buy modal)
  const itemStyles = useMemo(() => {
    // access cache
    const cache = styleCacheRef.current;

    // determine which seeds are being used
    const usedSeeds = listings
      .filter((item) => cache[item._id])
      .map((item) => cache[item._id].seed);

    // we use the ones not in use
    const availableSeeds = seedsForStyles.filter((s) => !usedSeeds.includes(s));
    // and shuffle the seeds array for maximum randomization
    const shuffledSeeds = [...availableSeeds].sort(() => 0.5 - Math.random());

    // find any voucher that does not have a style assigned by cache
    const newVouchers = listings.filter(
      (item) => item.itemType === 'voucher' && !cache[item._id],
    );

    let seedCursor = 0;
    let voucherCursor = 0;

    return listings.map((item) => {
      let entry = cache[item._id];
      // if this is a new item- generate and cache style
      if (!entry) {
        // pick a random seed and fall back to base array if all unique seeds are used
        const seed = shuffledSeeds.length
          ? shuffledSeeds[seedCursor % shuffledSeeds.length]
          : seedsForStyles[seedCursor % seedsForStyles.length];
        seedCursor += 1;

        // calc that shifts the hue so that all vouchers are distinctly colored
        const hueStep = 360 / Math.max(newVouchers.length, 1);
        let hue = null;
        // spreading out item hues + providing a random offset for vouchers
        if (item.itemType === 'voucher') {
          hue = Math.floor((voucherCursor * hueStep) + (Math.random() * hueStep * 0.5));
          voucherCursor += 1;
        }
        // saving style to cache
        entry = { seed, hue };
        cache[item._id] = entry;
      }
      // css filter string
      const hueFilter = entry.hue !== null ? ` hue-rotate(${entry.hue}deg)` : '';
      // returning the styling masterwork
      return {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transform: 'scale(1.1)',
        filter: `url(#mystery-distort-${entry.seed})${hueFilter}`,
      };
    });
  }, [listings]);

  return (
    <Container className="mt-4">

      {/* handles our image distortion, working with Scalable Vector Graphics (https://developer.mozilla.org/en-US/docs/Web/SVG) */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          {seedsForStyles.map((seed) => (
            <filter key={seed} id={`mystery-distort-${seed}`} x="-50%" y="-50%" width="200%" height="200%">
              {/* on feTurbulence- (https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feTurbulence) */}
              <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="2" seed={seed} result="noise" />
              {/* on feDisplacementMap- (https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feDisplacementMap) */}
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="140" xChannelSelector="R" yChannelSelector="G" result="displaced" />
              {/* on feGuassianBlur- (https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feGaussianBlur) */}
              <feGaussianBlur in="displaced" stdDeviation="1" />
            </filter>
          ))}
        </defs>
      </svg>

      {/* header section with Black Market name and wallet */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Black Market</h2>
        <h5 className="mb-0">
          Wallet: $
          {Number(wallet || 0).toFixed(2)}
        </h5>
      </div>

      {/* Black Market listings */}
      <div className="p-4 mb-4" style={{ border: '4px solid black', backgroundColor: '#111' }}>
        <Row className="justify-content-center">
          {listings.map((item, i) => {
            const imgStyle = itemStyles[i];

            return (
              <Col key={item._id} md={4} className="text-center mb-3">
                <h5
                  className="text-white mb-0"
                  style={{
                    backgroundColor: '#000',
                    padding: '8px',
                    border: '3px solid #eff1f1',
                    borderBottom: 'none',
                  }}
                >
                  Mystery Art
                </h5>

                <div className="p-3" style={{ border: '3px solid #e2ebed', backgroundColor: '#000' }}>
                  <div className="bg-dark mb-3" style={{ height: '250px', overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={
                        item.itemType === 'voucher'
                          ? 'https://i.postimg.cc/ZK71b1QY/voucher-square.jpg'
                          : (item.imageUrl || item.url)
                      }
                      alt={item.title || 'Market Item'}
                      style={imgStyle}
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
            );
          })}
        </Row>
      </div>

      {/* Black Market buttons: Redeem Vouchers, Sell Art, and Attempt Haggle */}
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

      {/* modal pop up for user selling art */}
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

      {/* modal pop up for user buying art */}
      <Modal show={!!revealItem} onHide={() => setRevealItem(null)} centered>
        <Modal.Header closeButton className="bg-dark text-white"><Modal.Title>You Purchased:</Modal.Title></Modal.Header>
        <Modal.Body className="bg-dark text-white text-center">
          {revealItem && (
            <>
              <img
                src={
                  revealItem.itemType === 'voucher'
                    ? 'https://i.postimg.cc/ZK71b1QY/voucher-square.jpg'
                    : (revealItem.imageUrl || revealItem.url)
                }
                alt={revealItem.title || 'Purchased item'}
                style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
              />
              <p className="mt-3 mb-0">{revealItem.title}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="info" onClick={() => setRevealItem(null)}>Accept</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default BlackMarket;
