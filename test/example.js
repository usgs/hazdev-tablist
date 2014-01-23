
require([
	'tablist/TabList',
	'tablist/ImageList'
], function (
	TabList,
	ImageList
) {
	'use strict';

	var LOREM = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';


	// left
	new ImageList({
		el: document.querySelector('#example-left'),
		tabPosition: 'left',
		tabs: [
			{
				title: 'Tab 1 - full title',
				header: '<p>This is an image from placehold.it</p>',
				image: 'http://placehold.it/640x480',
				footer: '<footer><small>blah, blah, this is a footer, blah.</small></footer>',
				thumbnailTitle: 'Tab 1',
				thumbnailImage: 'http://placehold.it/320x240'
			},
			{
				title: 'Bacon - full title',
				header: '<p>This is an image from baconmockup.com</p>',
				image: 'http://baconmockup.com/640/480',
				footer: '<footer><small>blah, blah, this is a footer, blah.</small></footer>',
				thumbnailTitle: 'Bacon',
				thumbnailImage: 'http://baconmockup.com/320/240'
			},
			{
				title: 'Bill Murray - full title',
				header: '<p>This is an image from fillmurray.com</p>',
				image: 'http://fillmurray.com/640/480',
				footer: '<footer><small>blah, blah, this is a footer, blah.</small></footer>',
				thumbnailTitle: 'Bill Murray',
				thumbnailImage: 'http://fillmurray.com/320/240'
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
