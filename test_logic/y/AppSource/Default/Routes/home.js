var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Game Server' });
});
/* GET home page. */
router.get('/admin', function(req, res, next) {
  res.render('index', { title: 'Game Server', layout: 'angular' });
});
module.exports = router;
