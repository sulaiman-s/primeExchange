const express = require('express');
const { Package } = require('../models/packages');
const { User } = require('../models/user');
const {Purchase} = require('../models/purchase');
const {Wallet} = require('../models/wallet');
const IsUser=require("../middlewares/AuthMiddleware")
const router = express.Router();

router.use(IsUser);

router.post('/', async (req, res) => {
  try {
    const { package_id, user_id } = req.body;

    const package = await Package.findByPk(package_id);
    if (!package) {
      return res.status(404).send('Package not found');
    }

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const wallet = await Wallet.findOne({ where: { user_id } });
    if (!wallet) {
      return res.status(404).send('Wallet not found');
    }

    if (wallet.balance < package.price) {
      return res.status(400).send('Insufficient balance in wallet');
    }

    await Purchase.create({ package_id, user_id });

    await Wallet.update({ balance: wallet.balance - package.price }, {
      where: { user_id }
    });

    return res.send('Package purchased successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});


router.get('/', async (req, res) => {
    try {
      const purchases = await Purchase.findAll({
        include: [
          {
            model: User,
            as: 'user',
          },
          {
            model: Package,
            as: 'package',
          },
        ],
      });
  
      return res.send(purchases);
    } catch (error) {
      console.error(error);
      return res.status(500).send('An error occurred');
    }
  });

router.get('/:user_id', async (req, res) => {
    try {
      const purchases = await Purchase.findAll({
        where:{user_id:req.params.user_id},
        include: [
          {
            model: User,
            as: 'user',
          },
          {
            model: Package,
            as: 'package',
          },
        ],
      });
  
      return res.send(purchases);
    } catch (error) {
      console.error(error);
      return res.status(500).send('An error occurred');
    }
  });



module.exports = router;
