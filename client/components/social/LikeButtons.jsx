import React from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

function LikeButtons({ image, getAllImages }) {
  const updateLikes = ({ target }) => {
    const updObj = {
      likeInfo: {
        likes: target.value === 'like' ? 1 : 0,
        dislikes: target.value === 'dislike' ? 1 : 0,
      },
    };

    axios
      .patch(`/social/likes/art/${image._id}`, updObj)
      .then(getAllImages)
      .catch((err) => {
        console.error('Error patching art in database!:', err);
      });
  };

  return (
    <div>
      <Button
        variant="outline-dark"
        value="like"
        onClick={updateLikes}
      >
        { `👍 ${image.likes}` }
      </Button>
      <Button
        variant="outline-dark"
        value="dislike"
        onClick={updateLikes}
      >
        { `👎 ${image.dislikes}` }
      </Button>
    </div>
  );
}

export default LikeButtons;
