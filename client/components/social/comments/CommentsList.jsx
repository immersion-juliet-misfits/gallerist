import React, { useState } from 'react';
import axios from 'axios';

import CommentItem from './CommentItem';

function CommentsList({ id, comments, retrieveComments }) {
  const [newComment, setNewComment] = useState({ body: '' });

  const createComment = () => {
    axios
      .post(`/social/comments/art/${id}`, { comment: newComment })
      .then(() => setNewComment({ body: '' }))
      .then(retrieveComments)
      .catch((err) => {
        console.error('Failed to POST new comment:', err);
      });
  };

  return (
    <div>
      <input
        value={newComment.body}
        onChange={({ target }) => setNewComment({ body: target.value })}
      />
      <button type="button" onClick={createComment}>Send!</button>
      {
        comments.map((comment) => (
          <CommentItem
            comment={comment}
            retrieveComments={retrieveComments}
            key={comment._id}
          />
        ))
      }
    </div>
  );
}

export default CommentsList;
