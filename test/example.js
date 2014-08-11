
require([
	'tablist/TabList'
], function (
	TabList
) {
	'use strict';

	var LOREM = '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>';

	TabList.tabbifyAll();

	new TabList({
		el: document.querySelector('#example-left'),
		tabs: [
			{
				title: '<header>Tab 1</header>',
				content: '<header><h2>Tab 1 - full title<h2></header>' +
						'<p>This is an image from placehold.it</p>' +
						'<img src="http://placehold.it/640x480"/>' +
						'<footer>blah, blah, this is a footer, blah.</footer>'
			},
			{
				title: '<header>Bacon</header>',
				content: '<header><h2>Bacon - full title</h2></header>' +
						'<p>This is an image from baconmockup.com</p>' +
						'<img src="http://baconmockup.com/640/480"/>' +
						'<footer>blah, blah, this is a footer, blah.</footer>'
			},
			{
				title: '<header>Bill Murray</header>',
				content: '<header><h2>Bill Murray - full title</h2></header>' +
						'<p>This is an image from fillmurray.com</p>' +
						'<img src="http://fillmurray.com/640/480"/>' +
						'<footer>blah, blah, this is a footer, blah.</footer>'
			}
		]
	});

	new TabList({
		el: document.querySelector('#example-top'),
		tabs: [
			{
				title: 'Golf',
				content: '<header><h2>Golf</h2></header>' + LOREM + LOREM
			},
			{
				title: 'Soccer',
				content: '<header><h2>Soccer</h2></header>' + LOREM + LOREM
			},
			{
				title: 'Basketball',
				content: '<header><h2>Basketball</h2></header>' + LOREM + LOREM + LOREM
			},
			{
				title: 'Tennis',
				content: '<header><h2>Tennis</h2></header>' + LOREM + LOREM
			},
			{
				title: 'Track and Field',
				content: '<header><h2>Track and Field</h2></header>' + LOREM + LOREM
			},
			{
				title: 'Bowling',
				content: '<header><h2>Bowling</h2></header>' + LOREM + LOREM + LOREM
			},
			{
				title: 'Baseball',
				content: '<header><h2>Baseball</h2></header>' + LOREM + LOREM + LOREM
			}
		]
	});

	new TabList({
		el: document.querySelector('#example-right'),
		tabs: [
			{
				title: 'Tab 1 title',
				content: '<header><h2>Tab 1 title</h2></header>' + LOREM
			},
			{
				title: 'Tab 2 title',
				content: '<header><h2>Tab 2 title</h2></header>' + LOREM + LOREM
			},
			{
				title: 'Tab 3 title',
				content: '<header><h2>Tab 3 title</h2></header>' + LOREM + LOREM + LOREM
			}
		]
	});

});
