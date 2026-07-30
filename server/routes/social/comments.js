const express = require('express');

const commentsRouter = express.Router();

const { Comment } = require('../../db/index');

commentsRouter.get('/art/:imageId', (req, res) => {
  const { imageId } = req.params;

  Comment
    .find({ art: imageId })
    .populate('user')
    .sort({ createdAt: -1 })
    .then((comments) => res.status(200).json(comments))
    .catch((err) => {
      console.error('Failed to find comments in database:', err);
      res.sendStatus(500);
    });
});

commentsRouter.post('/art/:imageId', (req, res) => {
  const userId = req.user.doc._id;
  const { imageId } = req.params;
  const { comment } = req.body; // { body: '' }
  console.log(userId, 'TEST USER ID');

  const newComment = {
    user: userId,
    art: imageId,
    body: comment.body,
  };

  Comment
    .create(newComment)
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.error('Failed to create new comment in database:', err);
      res.sendStatus(500);
    });
});

commentsRouter.patch('/:id', (req, res) => {
  const userId = req.user.doc._id;
  const { id } = req.params;
  const { comment } = req.body; // { body: '' }
  Comment
    .findById(id)
    .then((targetComment) => {
      if (targetComment) {
        if (targetComment.user?.toString() === userId) {
          Comment
            .findOneAndUpdate(targetComment, { body: comment.body })
            .then(() => res.sendStatus(200));
        } else {
          res.sendStatus(401);
        }
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error('Failed to update comment in database:', err);
      res.sendStatus(500);
    });
});

commentsRouter.delete('/:id', (req, res) => {
  const userId = req.user.doc._id;
  const { id } = req.params;

  Comment
    .findById(id)
    .then((targetComment) => {
      if (targetComment) {
        if (targetComment.user?.toString() === userId) {
          Comment
            .findOneAndDelete(targetComment)
            .then(() => res.sendStatus(200));
        } else {
          res.sendStatus(401);
        }
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error('Failed to delete comment from database:', err);
      res.sendStatus(500);
    });
});

module.exports = { commentsRouter };
