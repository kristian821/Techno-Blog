const router = require('express').Router();
const { User, Post } = require('../../models');

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
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'body', 'created_at']
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
    const { username, email, password } = req.body;

    User.create({
        username,
        email,
        password
    })
    .then(dbUserData => {
        res.json(dbUserData);
    })
    .catch(e => {
        console.log(e);
        res.status(500).json(e);
    });
});

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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