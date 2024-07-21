import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import GalleryListItem from './GalleryListItem';
import MemeListItem from './meme/MemeListItem';

function Gallery() {
  // use useState to define an images array and method to store and update gallery images
  const [images, setImages] = useState([]);
  // use useState to define a user array and set the values on the array
  const [usersArray, setUsersArray] = useState([]);
  // use useState to define an array of cultures to sort by
  const [cultures, setCulturesArray] = useState([]);
  // add in a curr user to state for accessing user in culture/user filter
  const [currUser, setCurrUser] = useState('');
  // add meme check
  const [meme, setMeme] = useState(false);
  // hold three memes
  const [threeMemes, setThreeMemes] = useState([]);
  // hold number used for checking data
  const [number, setNumber] = useState(0);
  // meme array
  const [memeArray, setMemeArray] = useState([]);

  // send a request to get all users in the db
  const getAllUsers = () => {
    axios('/db/users/')
      .then((users) => {
        setUsersArray(users.data);
      })
      .catch((err) => console.log(err));
  };

  // use an axios request to get all saved images from art db
  const getAllImages = () => {
    axios('/db/art')
      .then((art) => {
        const newCults = art.data.reduce((acc, curr) => {
          if (!acc.includes(curr.culture)) {
            acc.push(curr.culture);
          }
          return acc;
        }, []);
        setImages(art.data);
        setCulturesArray(newCults);
      })
      .catch((err) => console.log(err));
  };

  // use an axios request to get a list of filtered images from art db based on user
  const getImagesByUser = (user) => {
    setCurrUser(user);
    axios(`/db/art/${user}`)
      .then((art) => {
        setImages(art.data);
        const newCults = art.data.reduce((acc, curr) => {
          if (!acc.includes(curr.culture)) {
            acc.push(curr.culture);
          }
          return acc;
        }, []);
        setCulturesArray(newCults);
      })
      .catch((err) => console.log('get filtered images failed', err));
  };
  // send a request to filter by culture
  const getImagesByCulture = (filter) => {
    if (!filter || filter === '') {
      setMeme(false);
      getAllImages();
    } else if (filter === 'meme') {
      axios.get('/meme/get')
        .then((result) => {
          setMemeArray(result.data);
          setThreeMemes([result.data[0], result.data[1], result.data[2]]);
          //  setThreeMemes([result.data[0]]);
          setMeme(true);
        }).catch((err) => {
          console.error('axios get request error in Gallery.jsx: ', err);
        });
    } else {
      setMeme(false);
      axios.post(`/db/culture/${filter}`, { name: currUser })
        .then((art) => {
          setImages(art.data);
        })
        .catch((err) => console.log('get images by culture failed', err));
    }
  };

  // set the three memes to render
  const getThreeMemes = (num) => {
    if (num) {
      setThreeMemes([memeArray?.[0 + num], memeArray?.[1 + num], memeArray?.[2 + num]]);
      // setThreeMemes([images?.[0 + num]]);
    } else {
      setThreeMemes([memeArray?.[0], memeArray?.[1], memeArray?.[2]]);
      //  setThreeMemes([images?.[0]]);
    }
  };

  // check num to see what need to be render
  const changeNum = (num) => {
    if (images.length > number + num && number + num >= 0) {
      setNumber(number + num);
      getThreeMemes(number + num);
    }
  };

  // create a userList to populate user dropdown
  const userList = usersArray.map((user, i) => (
    <option
      value={user.name}
      key={`${user.googleId}-${i}`}
    >
      {user.name}
    </option>
  ));

  // create the option tags for cultures dropdown
  const culturesList = cultures.map((culture, i) => (
    <option
      value={culture}
      key={`${culture}-${i}`}
    >
      {culture}
    </option>
  ));
  // put the initial db request into useEffect to auto render images when you get to page
  useEffect(() => {
    getAllImages();
    getAllUsers();
    getThreeMemes();
  }, []);

  return (
    <Container>
      <Row>
        <Col md={8}>
          <h1><strong>Gallery</strong></h1>
        </Col>
        <Col md={2}>
          <div className="dropdown">
            <h3 className="section-header text-center">Curators</h3>
            <Form.Select defaultValue="" onChange={(e) => getImagesByUser(e.target.value)}>
              <option value="" key="54321">All</option>
              {userList}
            </Form.Select>
          </div>
        </Col>
        <Col md={2}>
          <div className="dropdown">
            <h3 className="section-header text-center">Cultures</h3>
            <Form.Select defaultValue="" onChange={(e) => getImagesByCulture(e.target.value)}>
              <option value="" key="296573">All</option>
              <option key="21meme">meme</option>
              {culturesList}
            </Form.Select>
          </div>
        </Col>
      </Row>
      <Row>
        {meme === false && images.map((image, i) => (
          <Col key={`${image.imageId}-${i}`}>
            <GalleryListItem
              image={image}
              users={usersArray}
            />
          </Col>
        ))}
      </Row>
      {meme === true && (
        <>
          <button onClick={() => { changeNum(-3); }}>{'<'}</button>
          <button onClick={() => { changeNum(3); }}>{'>'}</button>
        </>
      )}
      {meme === true && threeMemes.map((image, i) => {
        if (image !== undefined) {
          return (
            <Col key={`${i}`}>
              <MemeListItem
                image={image}
                num={i}
              />
            </Col>
          );
        }
      })}
    </Container>

  );
}

export default Gallery;
