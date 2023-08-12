const express = require('express');
const router = express.Router({ mergeParams: true });

router.use('/auth', require('./auth.routes'));
router.use('/user', require('./user.routes'));
router.use('/report', require('./report.routes'));
router.use('/depart', require('./depart.routes'));

module.exports = router;
