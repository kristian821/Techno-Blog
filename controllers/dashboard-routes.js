const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: ['id', 'title', 'post_text', 'created_at'],
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
    }).then(dbPostData => {
      const posts = dbPostData.map(post => post.get({ plain: true }));
        console.log(posts);
        res.render('dashboard', {
            posts,
            loggedIn: true
        });
    })
    .catch(e => {
        console.log(e);
        res.status(500).json(e);
    });
});

router.get('/addPost/', withAuth, (req, res) => {
    res.render('new-post'); 
});

router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
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
        const post = dbPost.data.get({ plain: true });
        res.render('edit-post', {
            post,
            loggedIn: true
        });
    })
    .catch(e => {
        console.log(e);
        res.status(500).json(e);
    });
});

module.exports = router;