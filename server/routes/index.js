const express = require('express');
const router = express.Router({ mergeParams: true });

router.use('/auth', require('./auth'));
router.use('/user', require('./user'));
router.use('/report', require('./report'));
router.use('/depart', require('./depart'));

module.exports = router;
