const express = require("express");
const Posts = require("./db");

const router = express.Router();

router.get("/api/posts", (req, res) => {
  Posts.find(req.query)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Could not retrieve posts",
      });
    });

  router.get(`/api/posts/:id`, (req, res) => {
    Posts.findById(req.params.id)
      .then((post) => {
        if (post) {
          res.status(200).json(post);
        } else {
          res.status(404).json({
            message: "Post not found",
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: "The post with the specified ID does not exist.",
        });
      });
  });

  router.get(`/api/posts/:id/comments`, (req, res) => {
    Posts.findPostComments(req.params.id)
      .then((data) => {
        if (!data.length) {
          res.status(404).json({
            message: "Whoops cant find that.",
          });
        } else {
          res.status(200).json(data);
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: "The comments information could not be retrieved.",
        });
      });
  });

  router.post(`/api/posts`, (req, res) => {
    Posts.insert(req.body)
      .then((post) => {
        if (!post) {
          res.status(400).json({
            message: "Please provide title and contents for the post.",
          });
        } else {
          res.status(201).json(post);
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: "There was an error while saving the post to the database",
        });
      });
  });
  router.post(`/api/posts/:id/comments`, (req, res) => {
    const newComment = { post_id: req.params.id, ...req.body };
    Posts.insertComment(newComment)
      .then((post) => {
        res.status(201).json(post);
      })
      .catch(error => {
        console.log(error.message, error.stack) // you need both of these pieces
        res.status(500).json({
          message: error.message,
          stack: error.stack,
        })
    })
  });

  router.delete(`/api/posts/:id`, (req, res) => {
    Posts.remove(req.params.id)
      .then((id) => {
        if (!id) {
          res.status(404).json({
            message: "The post with the specified ID does not exist.",
          });
        } else {
          res.status(200).json({ message: "The post has been deleted" });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: "The post could not be removed" });
      });
  });

  router.put(`/api/posts/:id`, (req, res) => {
    Posts.update(req.params.id, req.body)
      .then((post) => {
        if (!post) {
          res .status(404) .json({
              message: "The post with the specified ID does not exist.",
            });
        } else {
          res.status(200).json(post);
        }
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: "The post information could not be modified." });
      });
  });
});

module.exports = router;
