const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('./../model').User;
const ReportAccess = require('./../model').ReportAccess;
const ExcelData = require('./../model').ExcelData;
const auth = require('../../helpers/auth');
const userHelper = require('./../../helpers/user')
const sequelize = require('./../model').sequelize;

router.post('/login', async (req, res, next) => {
  try {
    let user = await User.findOne({
      where: {
        email: req.body.email,
      }
    })
    if (!user) {
      return res.send({success: false, error: 'User not found'});
    }
    auth.login(req, res, next);
  } catch (e) {
    console.log(e);
    return res.send(500)
  }
})


router.all('/*', auth.isAuthorized, (req, res, next) => {
  next();
})

router.delete('/:id', async (req, res, next) => {
  let user = req.user;

  if (user.dataValues.role !== User.getAdminRole()) {
    return res.send({success: false, error: 'You dont have permission'})
  }
  const t = await sequelize.transaction();

  try {
    await ReportAccess.destroy({
      where: {USER_ID: req.params.id}
    }, {transaction: t})

    await User.destroy({
      where: {ID: req.params.id}
    }, {transaction: t})

    await ExcelData.destroy({
      where: {USER_ID: req.params.id}
    }, {transaction: t})

    await t.commit();
    return res.send({success: true})

  } catch (e) {
    await t.rollback();
    res.send({success: false, error: 'Could not delete user'})

  }


})

router.put('/', async (req, res, next) => {
  let user = req.user;

  if (user.dataValues.role !== User.getAdminRole()) {
    return res.send({success: false, error: 'You dont have permission'})
  }

  try {

    let updateData = {
      ...req.body.user
    }

    if (updateData.password) {
      let salt = await bcrypt.genSalt(10)
      let hash = await bcrypt.hash(updateData.password, salt);
      updateData.password_hash = hash;
    }

    await User.update(updateData, {
      where: {
        id: updateData.id
      }
    })


    return res.send({success: true})

  } catch (e) {
    res.send({success: false, error: 'Could not delete user'})

  }

})


router.post('/register', async function (req, res, next) {
  try {
    let token = req.headers.authorization.split(' ')[1];
    let user = await userHelper.getCurrentUser(token);

    if (user.dataValues.role !== User.getAdminRole()) {
      return res.send({success: false, error: 'You dont have permission'})
    }

    const newUser = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password_hash: req.body.password,
      role: req.body.role,
    }
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password_hash, salt, (err, hash) => {
        newUser.password_hash = hash;
        User.create(newUser).then(async (user) => {
          res.send({success: true});
        }).catch((err) => {
          console.log('ERROR', err);
        })
      })
    })
  } catch (e) {
    console.log(e);
    res.send({success: false});
  }
});
router.post('/trigger-del', async (req, res, next) => {
  let user = req.user.dataValues;

  if (user.role !== User.getAdminRole()) {
    return res.send({success: false, error: 'You dont have permission'})
  }

  try {
    let user = await User.findOne({where: {ID: req.body.id}});

    if (!user) {
      return res.send({success: false, error: 'User Not found'});
    }
    user.DEL_FLAG = !user.DEL_FLAG;
    await user.save();
    return res.send({success: true})

  } catch (e) {
    console.log(e);
    return res.send({success: false, error: 'Error occurred'});
  }
})


router.get('/', async (req, res, next) => {
  let users = await User.findAll();

  let data = users.map((elem) => elem.getJson());

  return res.send({success: true, data})


})


module.exports = router;
