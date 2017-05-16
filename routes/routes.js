var express = require('express');
var router = express.Router();

var index = require('../controller/index');


router.get('/', index.index);
router.get('/hot', index.hot);
router.get('/banner', index.banner);

module.exports = router;
