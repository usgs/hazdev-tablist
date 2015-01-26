
require([
  'tablist/TabList'
], function (
  TabList
) {
  'use strict';

  var LOREM = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

  TabList.tabbifyAll();


  // top
  new TabList({
    el: document.querySelector('#example-top'),
    tabs: [
      {
        title: 'Golf',
        content: '<header>Golf</header>' +
            '<form>' +
              '<label>Choice 1</label>' +
              '<input type="radio" name="choice" value="1"' +
                  'checked="checked" />' +
              '<br />' +
              '<label>Choice 2</label>' +
              '<input type="radio" name="choice" value="2" />' +
              '<br />' +
              '<label>Choice 3</label>' +
              '<input type="radio" name="choice" value="3" />' +
              '<br />' +
              '<label>Choice 4</label>' +
              '<input type="radio" name="choice" value="4" />' +
            '</form>'
      },
      {
        title: 'Soccer',
        content: '<header>Soccer</header>' + LOREM
      },
      {
        title: 'Basketball',
        content: '<header>Basketball</header>' + LOREM
      },
      {
        title: 'Tennis',
        content: '<header>Tennis</header>' + LOREM
      },
      {
        title: 'Track and Field',
        content: '<header>Track and Field</header>' + LOREM
      },
      {
        title: 'Bowling',
        content: '<header>Bowling</header>' + LOREM
      },
      {
        title: 'Baseball',
        content: '<header>Baseball</header>' + LOREM
      },
      {
        title: 'Hockey',
        content: '<header>Hockey</header>' + LOREM
      },
      {
        title: 'Squash',
        content: '<header>Squash</header>' + LOREM
      }
    ]
  });


  new TabList({
    el: document.querySelector('#example-top-second'),
    tabs: [
      {
        title: 'Golf',
        content: '<header>Golf</header>' +
            '<form>' +
              '<label>Choice 1</label>' +
              '<input type="radio" name="choice" value="1"' +
                  'checked="checked" />' +
              '<br />' +
              '<label>Choice 2</label>' +
              '<input type="radio" name="choice" value="2" />' +
              '<br />' +
              '<label>Choice 3</label>' +
              '<input type="radio" name="choice" value="3" />' +
              '<br />' +
              '<label>Choice 4</label>' +
              '<input type="radio" name="choice" value="4" />' +
            '</form>'
      },
      {
        title: 'Soccer',
        content: '<header>Soccer</header>' + LOREM
      },
      {
        title: 'Basketball',
        content: '<header>Basketball</header>' + LOREM
      },
      {
        title: 'Tennis',
        content: '<header>Tennis</header>' + LOREM
      },
      {
        title: 'Track and Field',
        content: '<header>Track and Field</header>' + LOREM
      },
      {
        title: 'Bowling',
        content: '<header>Bowling</header>' + LOREM
      },
      {
        title: 'Baseball',
        content: '<header>Baseball</header>' + LOREM
      },
      {
        title: 'Hockey',
        content: '<header>Hockey</header>' + LOREM
      },
      {
        title: 'Squash',
        content: '<header>Squash</header>' + LOREM
      }
    ]
  });


});
