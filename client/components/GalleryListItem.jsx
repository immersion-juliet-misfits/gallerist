import React from 'react';
import axios from 'axios';

function GalleryListItem({ image }) {
  // add a friend to users friend array
  function addFriend(name) {
    axios.put('/db/friends/', { friend: name })
      .then(() => console.log('added friend!'))
      .catch((err) => console.log(err, 'friend not added'));
  }

  return (
    <div>
      <img
        style={{ width: '250px', height: 'auto' }}
        src={image.imageUrl}
        id={image.imageId}
        alt={image.title}
      />
      <h1>
        Title:
        {' '}
        {image.title}
      </h1>
      <div>
        Artist:
        {' '}
        {image.artist}
      </div>
      <div>
        Date:
        {' '}
        {image.date}
      </div>
      <div
        onClick={() => {
          addFriend(image.userGallery.name)
        }}
      >
        User:
        {' '}
        {image.userGallery.name}
      </div>
    </div>
  );
}

export default GalleryListItem;
