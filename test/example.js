
require(['tablist/TabList'], function (TabList) {
	'use strict';

	// left
	new TabList({
		el: document.querySelector('#example-left'),
		tabPosition: 'left',
		tabs: [
			{
				title: 'Tab 1 title',
				content: '<header>Tab 1 title</header>Tab 1 content'
			},
			{
				title: 'Tab 2 title',
				content: '<header>Tab 2 title</header>Tab 2 content'
			},
			{
				title: 'Tab 3 title',
				content: '<header>Tab 3 title</header>Tab 3 content'
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
				content: '<header>Tab 1 title</header>Tab 1 content'
			},
			{
				title: 'Tab 2 title',
				content: '<header>Tab 2 title</header>Tab 2 content'
			},
			{
				title: 'Tab 3 title',
				content: '<header>Tab 3 title</header>Tab 3 content'
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
				content: '<header>Tab 1 title</header>Tab 1 content'
			},
			{
				title: 'Tab 2 title',
				content: '<header>Tab 2 title</header>Tab 2 content'
			},
			{
				title: 'Tab 3 title',
				content: '<header>Tab 3 title</header>Tab 3 content'
			}
		]
	});

});
