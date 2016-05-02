var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', {
	logging: false
});

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
    }
},{
	getterMethods: {
		route: function(){ return ("/wiki/" + this.urlTitle) }
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