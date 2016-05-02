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
	// .catch(function () {
	// 	User.build({
	// 		name: req.body.author_name,
	// 		email: req.body.author_email
	// 	})
	// 	.save()
	// 	.then(function (author) {
	// 		author = author.name
	// 	})
	// });
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
	Page.findOne({where: {urlTitle: req.params.url_title}})
	.then(function(page){
		res.render('wikipage', 
		{title: page.title, 
		author_name: "Taylor Swift",
		content: page.content});
	}).catch(next);
});


module.exports = router; 

function convertTitle (title) {
	var regexp = /[\W]+/g;
	return title.replace(regexp, '_');
}