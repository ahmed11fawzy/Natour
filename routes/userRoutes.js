const router = require('express').Router();
const {signup}=require('../controllers/authController');
const {getAllUsers, updateUser, getUser}=require('../controllers/userController');



router.post('/signup', signup);

router.route('/')
     .get(getAllUsers)

router.route('/:id').get(getUser).patch(updateUser)


module.exports = router;