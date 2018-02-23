/*
 * @Author: AngelaDaddy 
 * @Date: 2018-02-21 16:53:09 
 * @Last Modified by: AngelaDaddy
 * @Last Modified time: 2018-02-23 07:11:18
 * @Description: rooter root
  */
const express = require('express');
const userRoutes = require('../components/user/user.route');

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
	res.send('OK')
);

// mount user routes at /users
router.use('/users', userRoutes);



module.exports = router;
