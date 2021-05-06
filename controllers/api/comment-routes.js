const router = require('express').Router();
const { Comment, Post, User } = require('../../models');

router.get('/', (req, res) => {
    Comment.findAll({
        attributes: [
            'id',
            'comment_text',
            'user_id',
            'created_at'
        ],
        include: [
            {
                model: Post,
                attributes: ['id', 'post_text', 'title'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbCommentData => {
        res.json(dbCommentData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
    const { comment_text, user_id, post_id } = req.body;
    Comment.create({
        comment_text,
        user_id,
        post_id
    })
    .then(dbCommentData => {
        res.json(dbCommentData);
    })
    .catch(e => {
        console.log(e);
        res.status(400).json(e);
    });
});

router.delete('/:id', (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbCommentData => {
        if (!dbCommentData) {
            return res.status(404).json({ message: "No comment found with this ID"});
        }
        res.json(dbCommentData);
    })
    .catch(e => {
        console.log(e);
        res.status(500).json(e);
    });
});

module.exports = router;