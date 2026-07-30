import React, { useState } from 'react';
import axios from 'axios';

function CommentItem({ comment, retrieveComments }) {
  const [newComment, setNewComment] = useState({ body: comment.body });
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState('');

  if (!userId) {
    axios
      .get('/db/user')
      .then(({ data: user }) => setUserId(user._id.toString()))
      .catch((err) => {
        console.error('Failed to GET user (how???):', err);
      });
  }

  const date = new Date(comment.createdAt).toLocaleString('en-US');

  const updateComment = () => {
    axios
      .patch(
        `/social/comments/${comment._id}`,
        { comment: newComment },
      )
      .then(() => setIsEditing(false))
      .then(retrieveComments)
      .catch((err) => {
        console.error('Failed to PATCH comment:', err);
      });
  };

  const deleteComment = () => {
    axios
      .delete(`/social/comments/${comment._id}`)
      .then(retrieveComments)
      .catch((err) => {
        console.error('Failed to DELETE comment:', err);
      });
  };

  return (
    <div>
      <span>{ `${comment.user?.name}: ` }</span>
      {
        isEditing
          ? (
            <span>
              <input
                value={newComment.body}
                onChange={({ target }) => setNewComment({ body: target.value })}
              />
            </span>
          )
          : (
            <span>
              { comment.body }
            </span>
          )
      }
      <p>
        { date }
        {
          comment.createdAt !== comment.updatedAt
            ? ' (Edited)'
            : null
        }
      </p>
      {
        comment.user?._id.toString() === userId
          ? (
            <span>
              <button type="button" onClick={deleteComment}>Delete</button>
              {
                isEditing
                  ? (
                    <button
                      type="button"
                      onClick={updateComment}
                    >
                      Save Changes
                    </button>
                  )
                  : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </button>
                  )
              }
            </span>
          )
          : null
      }
    </div>
  );
}

export default CommentItem;
