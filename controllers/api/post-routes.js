const router = require('express').Router();
const { Comment, Post, User } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
    Post.findAll({
        attributes: [
            'id', 
            // 'post_text',
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
            'post_text',
            'title', 
            'created_at'
        ],
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

router.post('/', withAuth, (req, res) => {
    console.log(req.body);
    Post.create({
        title: req.body.title,
        post_text: req.body.post_text,
        user_id: req.session.user_id
    })
    .then(dbPostData => {
        res.json(dbPostData);
    })
    .catch(e => {
        console.log(e);
        res.status(500).json(e);
    });
});

router.put('/:id', withAuth, (req, res) => {
    const { title, post_text } = req.body;
    Post.findOne({
        title,
        post_text
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

router.delete('/:id', withAuth, (req, res) => {
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