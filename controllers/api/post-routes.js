const router = require('express').Router();
const { Comment, Post, User } = require('../../models');
const sequelize = require('../../config/connection');

router.get('/', (req, res) => {
    Post.findAll({
        attributes: [
            'id', 
            'body',
            'title',
            'created_at'
        ],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
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
    .then(dbPostData => {
        res.json(dbPostData);
    })
    .catch(e => {
        console.log(e);
        res.status(500).json(e);
    });
});

router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'body',
            'title', 
            'created_at'
        ],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            return res.status(404).json({ message: 'No Posts found with this ID'});
        }
        res.json(dbPostData);
    })
    .catch(e => {
        console.log(e);
        res.status(500).json(e);
    });
});

router.post('/', (req, res) => {
    const { title, body, user_id } = req.body;
    Post.create({
        title,
        body,
        user_id
    })
    .then(dbPostData => {
        res.json(dbPostData);
    })
    .catch(e => {
        res.status(500).json(e);
    });
});

router.put('/:id', (req, res) => {
    const { title, body } = req.body;
    Post.findOne({
        title,
        body
    },
    {
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if(!dbPostData) {
            return res.status(404).json({ message: 'No Post found with this ID'});
        }
        res.json(dbPostData);
    })
    .catch(e => {
        console.log(e);
        res.status(500).json(e);
    });
});

router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if (!dbPostData) {
            return res.status(404).json({ message: 'No Post found with this ID'});
        }

        res.json(dbPostData);
    })
    .catch(e => {
        console.log(e);
        res.status(500).json(e);
    });
});

module.exports = router;