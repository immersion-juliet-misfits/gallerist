import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';

function PhotoInfo() {
  const { _id } = useParams();
  const [currPhoto, changePhoto] = useState([]);
  const [photoOwner, befriendOwner] = useState('');
  function getPhotoInfo() {
    axios(`/db/artwork/${_id}`)
      .then((results) => {
        // console.log(results.data[0].userGallery.name)
        changePhoto(results.data);
        befriendOwner(results.data.userGallery.name)
      })
      .catch((err) => console.error(err));
  }

  function addFriend(e) {
    // console.log(e.target.value)
    axios.put('/db/friends/', { friend: e.target.value })
      .then(() => console.log('added friend!', e.target.value))
      .catch((err) => console.log(err, 'friend not added'));
  } 

  useEffect(() => {
    getPhotoInfo();
  }, []);

  return (
    <div>
      <Image fluid alt={currPhoto.title} src={currPhoto.imageUrl} />
      <Container style={{display: 'flex', justifyContent: 'center'}}>
        
      <h1 id="PhotoInfo" >{currPhoto.title}</h1>
      <ul>
        <li>
          Title:
          {' '}
          {currPhoto.title}
        </li>
        <li>
          Artist:
          {' '}
          {currPhoto.artist}
        </li>
        <li>
          Date:
          {' '}
          {currPhoto.date}
        </li>
        <li>
          Culture:
          {' '}
          {currPhoto.culture}
        </li>
        <li>
          <a href={currPhoto.url}>Click for More Info</a>
        </li>
          <Button variant="secondary" value={photoOwner} onClick={addFriend}>Add Friend</Button>
      </ul>
      </Container>
    </div>
  );
}

export default PhotoInfo;
