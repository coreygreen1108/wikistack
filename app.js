var express = require('express');
var app = express();
var morgan = require('morgan');
var swig = require('swig');
var path = require('path');
var bodyparser = require('body-parser');
var models = require('./models'); //by default node will import index as default. 
var wikiRoutes = require('./routes/wiki');
var userRoutes = require('./routes/users');

//This block is implementation of swig. 
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'html');
app.engine('html', swig.renderFile); 
swig.setDefaults({ cache: false });

models.User.sync({})
.then(function () {
    return models.Page.sync({})
})
.then(function () {
    app.listen(3001, function () {
        console.log('Server is listening on port 3001!');
    });
})
.catch(console.error);

app.use(express.static('./public'));

// body parser
app.use(bodyparser.urlencoded());
app.use(bodyparser.json()); // application/json

app.use('/wiki', wikiRoutes);
app.use('/users', userRoutes); 