import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';

// react bootstrap components
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import SearchItem from './SearchItem';

// '/huam/object/:imageid' --For detailed object about image
// '/huam/image/:keyword' --For an array of images

function Search() {
  const [search, setSearch] = useState('');
  // state images array
  const [images, setImages] = useState([]);
  // alert messages
  const [message, setMessage] = useState('');
  // boolean state value for spinner
  const [isLoading, setIsLoading] = useState(false);

  // state to check if something is owned
  const [ownedInventory, setOwnedInventory] = useState([]);

  // Modal state for 404 errors
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // function to fetch all pieces of art currently in the database
  const fetchInventory = () => {
    axios.get('/db/art/')
      .then((res) => {
        const urls = res.data.map((art) => art.imageUrl);
        setOwnedInventory(urls);
      })
      .catch((err) => console.error('Failed to fetch global inventory:', err));
  };

  // axios post request to user's gallery
  function postToGallery(artObj, imageUrl) {
    axios.post('/db/art', {
      art: {
        title: artObj.title,
        artist: artObj.people?.[0].displayname || 'unknown',
        date: artObj.dated,
        culture: artObj.culture,
        url: artObj.url,
        imageUrl,
        isForSale: false,
        price: 0,
      },
    }).then(() => {
      // console.log('succesfully posted to db');
      setMessage('Piece acquired for $5!');
      handleShow();
      // if something is bought- fetch the inventory:
      fetchInventory();
      // deduct $5 from wallet upon adding to gallery
      axios
        .put('/db/deductWallet/', {
          price: 5,
        })
        .catch((err) => console.error('Could not deduct from wallet: ', err));
    })
      .catch((err) => {
        // error message, another user already has this piece
        setMessage('This piece has already been acquired');
        handleShow();
        console.error('Could not post to gallery ', err);
      });
  }

  // search by keyword
  function keywordSearch(term) {
    axios(`/huam/image/${term}`)
      .then((response) => {
        // console.log(response.data);
        setImages(response.data);
      })
      .catch((err) => console.error(err));
  }

  // handleClick will call idSearch
  function idSearch(id) {
    axios(`/huam/object/${id}`)
      .then(({ data }) => {
        const artObj = data[0];
        const imageUrl = artObj.images?.[0]?.baseimageurl
          || artObj.primaryimageurl
          || artObj.baseimageurl;

        if (!imageUrl) {
          setMessage('Sorry, this piece has no image available');
          handleShow();
          return;
        }

        // eslint-disable-next-line consistent-return
        return postToGallery(artObj, imageUrl);
      })
      .catch((err) => console.error(err));
  }
  // handleClick function allows ability to pass down idSearch as props using useCallback
  const handleClick = useCallback((id) => {
    idSearch(id);
  });

  // set default search on mount and fetchInventory on mount
  useEffect(() => {
    keywordSearch('abstract');
    fetchInventory();
  }, []);

  return (
    <Container className="search">
      <input
        type="text"
        value={search}
        placeholder="Search for Art"
        onKeyDown={(e) => {
          if (search.length > 0 && e.key === 'Enter') {
            keywordSearch(search);
            setSearch('');
          }
        }}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => {
          if (search.length > 0) {
            keywordSearch(search);
            setIsLoading(true);
          }
          setSearch('');
          setInterval(setIsLoading, 500, false);
        }}
      >
        {
          isLoading ? (
            <Spinner animation="border" size="sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : '🔍'
        }
      </Button>
      <br />
      <Row align="center" gap={3} style={{ listStyleType: 'none', paddingTop: '20px' }}>
        {images.map((image) => {
          const isOwned = ownedInventory.includes(image.baseimageurl);

          return (
            <SearchItem
              image={image}
              key={image.id}
              idSearch={handleClick}
              isOwned={isOwned}
            />
          );
        })}
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Body>{ message }</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Search;
