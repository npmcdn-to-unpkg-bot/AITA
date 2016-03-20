/**
 * Aita 2016
 * Author: Tri
 */

var keystone = require('keystone');
var Handlebars = require('handlebars');
var async = require('async');
var EXPIRE_PERIOD = 21;

exports = module.exports = function(req, res) {
	console.log('params', req.params._id);

	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.user = req.user;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'chi-tiet';

	// Init locals's data
	locals.data = {
		post: {},
		relatedPosts: []
	};

	// Get Id from index
	var id = req.params._id;
	// Store type & category of post
	var type;
	
	// Load post with Id
	view.on('init', function(next) {

		keystone.list('Post').model.findOne({ '_id' : id }).populate('author district type ward').exec(function(err, result) {
			if (!result) {
				return;
			}

			locals.data.post = result;
			type = result.type;

			keystone.list('Post').model.count().exec(function(err, count) {
				locals.data.post.postCount = count;
				next(err);
			});

		});
		
	});

	// Load related posts
	view.on('init', function(next) {

		keystone.list('Post').model.find({ 'type': type,
			'activeDate': {
				$gte:minusDays(Date.now(), EXPIRE_PERIOD),
				$lte:Date.now()
			}}).
			where('_id').ne(locals.data.post._id).
				populate('author district type ward').
					limit(3).
						sort({'publishedDate': -1}).
							exec(function(err, results) {
			
			if (!results) {
				return;
			}

			locals.data.relatedPosts = results;

			return next(err);
		});
	
	});

	// Register toCurrency function, which changes price to decimal format
	Handlebars.registerHelper('toCurrency', function(number) {
		if (number != null)
			return number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
	});
	// Register toAuthorName function, which gives full name of author
	Handlebars.registerHelper('toAuthorName', function(author) {
		return (author) ? (author.name.first + ' ' + author.name.last) : 'null';
	});
	// Register districtName function, which return name of District
	Handlebars.registerHelper('districtName', function(district) {
		return (district) ? (district.name) : 'null';
	});
	// Register typeName function, which return name of Type
	Handlebars.registerHelper('typeName', function(type) {
		return (type) ? (type.name) : 'null';
	});
	// Register isMedium function
	Handlebars.registerHelper('isMedium', function(medium) {
		return (medium) ? 'Tiếp' : 'Không Tiếp';
	});

	// Add Days
	function minusDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
	}

	// Render the view
	view.render('chi-tiet');
};
