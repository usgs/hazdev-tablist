
require([
	'tablist/TabList'
], function (
	TabList
) {
	'use strict';

	var LOREM = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

	TabList.tabbifyAll();


	// left
	new TabList({
		el: document.querySelector('#example-left'),
		tabPosition: 'left',
		tabs: [
			{
				title: '<header>Tab 1</header>' +
						'<img src="http://placehold.it/320x240"/>',
				content: '<header>Tab 1 - full title</header>' +
						'<p>This is an image from placehold.it</p>' +
						'<img src="http://placehold.it/640x480"/>' +
						'<footer>blah, blah, this is a footer, blah.</footer>'
			},
			{
				title: '<header>Bacon</header>' +
						'<img src="http://baconmockup.com/320/240"/>',
				content: '<header>Bacon - full title</header>' +
						'<p>This is an image from baconmockup.com</p>' +
						'<img src="http://baconmockup.com/640/480"/>' +
						'<footer>blah, blah, this is a footer, blah.</footer>'
			},
			{
				title: '<header>Bill Murray</header>' +
						'<img src="http://fillmurray.com/320/240"/>',
				content: '<header>Bill Murray - full title</header>' +
						'<p>This is an image from fillmurray.com</p>' +
						'<img src="http://fillmurray.com/640/480"/>' +
						'<footer>blah, blah, this is a footer, blah.</footer>'
			}
		]
	});

	// top
	new TabList({
		el: document.querySelector('#example-top'),
		tabPosition: 'top',
		tabs: [
			{
				title: 'Tab 1 title',
				content: '<header>Tab 1 title</header>' + LOREM
			},
			{
				title: 'Tab 2 title',
				content: '<header>Tab 2 title</header>' + LOREM + LOREM
			},
			{
				title: 'Tab 3 title',
				content: '<header>Tab 3 title</header>' + LOREM + LOREM + LOREM
			},
			{
				title: 'Tab 4 title',
				content: '<header>Tab 4 title</header>' + LOREM
			},
			{
				title: 'Tab 5 title',
				content: '<header>Tab 5 title</header>' + LOREM + LOREM
			},
			{
				title: 'Tab 6 title',
				content: '<header>Tab 6 title</header>' + LOREM + LOREM + LOREM
			}
		]
	});

	// right
	new TabList({
		el: document.querySelector('#example-right'),
		tabPosition: 'right',
		tabs: [
			{
				title: 'Tab 1 title',
				content: '<header>Tab 1 title</header>' + LOREM
			},
			{
				title: 'Tab 2 title',
				content: '<header>Tab 2 title</header>' + LOREM + LOREM
			},
			{
				title: 'Tab 3 title',
				content: '<header>Tab 3 title</header>' + LOREM + LOREM + LOREM
			}
		]
	});

});
