var router = require('express').Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

router.post('/',function(req,res, next){
	var author;
	User.findOrCreate({
		where: {
			name: req.body.author_name,
			email: req.body.author_email
		}
	})
	.then(function (users) {
		author = users[0];

		var newPage = Page.build({
			title: req.body.title,
			content: req.body.page_content,
			tags: req.body.tags.split(/\s*,\s*/g), 
			urlTitle: convertTitle(req.body.title),
			status: req.body.status
		});

		return newPage.save()
	})
	.then(function (page) {
		return page.setAuthor(author);
	})
	.then(function (page) {
		res.redirect(page.route);
	}).catch(next);
});

router.get('/', function(req, res){
	Page.findAll({limit: 20})
	.then(function(pages){
		res.render('index', {pages});
	}); 
});

router.get('/add',function(req,res){
	res.render('addPage', {});
});

router.get('/:url_title',function(req,res, next){
	Page.findByUrlTitle(req.params.url_title)
	.then(function(page){
		//console.log(page);
		if(page === null){
			res.status(404).send("404 :O"); 
		}
		else {
			res.render('wikipage', 
			{page});
		}
	}).catch(next);
});

router.get('/:url_title/similar', function(req, res, next){
	Page.findByUrlTitle(req.params.url_title)
	.then(function(page){
		//console.log(page);
		return page.findSimilar()
	})
	.then(function (pages) {
		res.render('index', {pages});
	}).catch(next);

})

module.exports = router; 

function convertTitle (title) {
	var regexp = /[\W]+/g;
	return title.replace(regexp, '_');
}