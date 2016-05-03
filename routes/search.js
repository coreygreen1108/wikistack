var router = require('express').Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

module.exports = router; 

router.get('/', function(req, res){
	res.render('search');
});

router.get('/tags', function(req, res, next){
	//console.log(req.query.tags);
	//console.log("These are the tags taken: " + req.query.tags);
	var pagePromise = Page.findAll({
		where: {
			tags: {
					$overlap: req.query.tags.split(/\s*,\s*/g)	
				}
			}
	}).then(function(pages) {
		console.log(pages);
		res.render('index', {pages})
	}).catch(next);
});