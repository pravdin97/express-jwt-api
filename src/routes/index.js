const { Router } = require('express');
const models = require('../models');
const { generateToken, verifyToken } = require('../auth');

const router = Router({ mergeParams: true });

router.post('/signup', async (req, res) => {
  const { name, password } = req.body;
  try {
    if (!name || !password) throw new Error('There is no username or password');

    const user = await models.users.create({ name, password });
    res.json({ id: user.id, msg: 'account created successfully' });
  } catch(error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { name, password } = req.body;
  if (name && password) {
    let user = await models.users.findOne({ where: { name } });
    if (!user) {
      res.status(401).json({ message: 'No such user found' });
    }
    if (user.password === password) {
      const token = await generateToken(user);
      res.json({ msg: 'ok', token: token });
    } else {
      res.status(401).json({ msg: 'Password is incorrect' });
    }
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    const users = await models.users.findAll();
    return res.json({ message: 'it works!', users });
  } catch(error) {
    console.error(error);
    return res.status(500).json({ error });
  }
});

module.exports = router;
