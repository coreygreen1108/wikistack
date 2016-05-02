var router = require('express').Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;
var Promise = require('sequelize').Promise;

module.exports = router;

router.get('/', function (req, res) {
	User.findAll({})
	.then(function (users) {
		res.render('users', {users});
	});
});

router.get('/:id', function (req, res, next) {
	var userPromise = User.findById(req.params.id);
	var pagePromise = Page.findAll({
		where: {
			authorId: req.params.id
		}
	});

	Promise.all([userPromise, pagePromise])
	.then(function (result) {
		var user = result[0];
		var pages = result[1];
		res.render('index', {user, pages})
	})
	.catch(next);
});