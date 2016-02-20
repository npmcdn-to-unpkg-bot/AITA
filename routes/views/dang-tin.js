var keystone = require('keystone');
var async = require('async');
var Handlebars = require('handlebars');
var moment = require('moment');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	// locals.user = req.user;
	locals.user = req.session.passport.user;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'dang-tin';
	
	locals.data = {
		districts: [],
		wards: [],
		estateCategories: []
	};

	view.on('init', function(next) {
		keystone.list('District').model.find().sort('name').exec(function(err, results) {

			if (err || !results.length) {
				return next(err);
			}

			locals.data.districts = results;
			next();
		});
	});

	view.on('init', function(next) {
		keystone.list('Ward').model.find().sort('name').exec(function(err, results) {

			if (err || !results.length) {
				return next(err);
			}

			locals.data.wards = results;
			next();
		});
	});

	view.on('init', function(next) {
		keystone.list('EstateCategory').model.find().sort('name').exec(function(err, results) {

			if (err || !results.length) {
				return next(err);
			}

			locals.data.estateCategories = results;
			next();
		});
	});

	Handlebars.registerHelper('getFullname', function(user) {
		return [user.name.first, user.name.last].join(' ');
	});

	Handlebars.registerHelper('currentDate', function() {
		return moment().format('YYYY-MM-DD');
	});

	// Render the view
	view.render('dang-tin');
};
