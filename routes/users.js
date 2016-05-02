var router = require('express').Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

module.exports = router;

router.get('/', function (req, res) {
	User.findAll({})
	.then(function (users) {
		res.render('users', {users});
	});
});

router.get('/:id', function (req, res, next) {
	Page.findAll({
		where: {
			authorId: req.params.id
		}
	})
	.then(function (pages) {
		res.render('index', {pages})
	})
	.catch(next);
});