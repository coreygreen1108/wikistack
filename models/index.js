var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', {
	logging: false
});
var marked = require('marked');

var Page = db.define('page', {
    title: {
        type: Sequelize.STRING, allowNull: false
    },
    urlTitle: {
        type: Sequelize.STRING, allowNull: false
    },
    content: {
        type: Sequelize.STRING, allowNull: false
    },
    status: {
        type: Sequelize.ENUM('open', 'closed'), defaultValue: 'open'
    },
    date: {
        type: Sequelize.DATE, defaultValue: Sequelize.NOW 
    },
    tags: {
        type: Sequelize.ARRAY(Sequelize.STRING)
    }
},{
	getterMethods: {
	   route: function(){ return ("/wiki/" + this.urlTitle) },
	   renderedContent: function () {
            marked(this.content, function (markdownString) {
                return markdownString
            })
       }
    },
    instanceMethods:
    {
        findSimilar: function () {
            return Page.findAll({
                where: {
                    id: {
                        $ne: this.id
                    },
                    tags: {
                        $overlap: this.tags  
                    }
                }
            })
        }
    },
    classMethods: 
    {
        findByUrlTitle: function (urlTitle) {
            return Page.findOne({where: {urlTitle: urlTitle}, include: {model: User, as: "author"}})
        },
        findByTag: function(tag) {
            return (this.tags === tag);
        }
    }
  
});

var User = db.define('user', {
    name: {
        type: Sequelize.STRING, allowNull: false
    },
    email: {
        type: Sequelize.STRING, isEmail: true, allowNull: false
    }
});

// Associations
Page.belongsTo(User, { as: 'author' });

module.exports = {
  Page: Page,
  User: User
};