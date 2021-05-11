const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password'] }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(e => {
        console.log(e);
        res.status(500).json(e);
    });
});

router.get('/:id', (req, res) => {
    User.findOne({
        where: {
            id: req.params.id
        },
        attributes: { exclude: ['password']},
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'post_text', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            },
            {
                model: Post,
                attributes: ['title', 'body']
            }
        ]
    })
    .then(dbUserData => {
        if (!dbUserData) {
            return res.status(404).json({ message: 'No User found with this ID'});
        }
        res.json(dbUserData);
    })
    .catch(e => {
        console.log(e);
        res.status(500).json(e);
    });
});

router.post('/', (req, res) => {
    console.log(req.body);
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => {
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;
        
            res.json(dbUserData);
        });
    })
    .catch(e => {
        console.log(e);
        res.status(500).json(e);
    });
});

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            return res.status(400).json({ message: 'No user found with this ID'});
        }

        const validatePassword = dbUserData.validatePassword(req.body.password);
        
        if (!validatePassword) {
            return res.status.json({ message: 'Your password was entered incorrectly.'});
        }

        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json({ user: dbUserData, message: 'You are now logged in.'});
        });
    })
    .catch(e => {
        console.log(e);
        res.status(500).json(e);
    });
});

router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

router.put('/:id', withAuth, (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            return res.status(404).json({ message: 'No User found with this ID'});
        }
        res.json(dbUserData);
    })
    .catch(e => {
        console.log(e);
        res.status(500).json(e);
    });
});

router.delete('/:id', withAuth, (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            return res.status(404).json({ message: 'No User found with this ID'});
        }
        res.json(dbUserData);
    })
    .catch(e => {
        console.log(e);
        res.status(500).json(e);
    });
})

module.exports = router;