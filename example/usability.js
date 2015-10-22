'use strict';

var TabList = require('tablist/TabList');

var LOREM = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

TabList.tabbifyAll();


// top
TabList({
  el: document.querySelector('#example-top'),
  tabs: [
    {
      title: 'Golf',
      content: '<h2>Golf</h2>' +
        '<form>' +
          '<input id="choice1" type="radio" name="choice" value="1"' +
              'checked="checked" />' +
          '<label for="choice1">Choice 1</label>' +
          '<input id="choice2" type="radio" name="choice" value="2" />' +
          '<label for="choice2">Choice 2</label>' +
          '<input id="choice3" type="radio" name="choice" value="3" />' +
          '<label for="choice3">Choice 3</label>' +
          '<input id="choice4" type="radio" name="choice" value="4" />' +
          '<label for="choice4">Choice 4</label>' +
        '</form>'
    },
    {
      title: 'Soccer',
      content: '<h2>Soccer</h2>' + LOREM
    },
    {
      title: 'Basketball',
      content: '<h2>Basketball</h2>' + LOREM
    },
    {
      title: 'Tennis',
      content: '<h2>Tennis</h2>' + LOREM
    },
    {
      title: 'Track and Field',
      content: '<h2>Track and Field</h2>' + LOREM
    },
    {
      title: 'Bowling',
      content: '<h2>Bowling</h2>' + LOREM
    },
    {
      title: 'Baseball',
      content: '<h2>Baseball</h2>' + LOREM
    },
    {
      title: 'Hockey',
      content: '<h2>Hockey</h2>' + LOREM
    },
    {
      title: 'Squash',
      content: '<h2>Squash</h2>' + LOREM
    }
  ]
});


TabList({
  el: document.querySelector('#example-top-second'),
  tabs: [
    {
      title: 'Golf',
      content: '<h2>Golf</h2>' +
        '<form>' +
          '<input id="choice5" type="radio" name="choice" value="1"' +
              'checked="checked" />' +
          '<label for="choice5">Choice 1</label>' +
          '<input id="choice6" type="radio" name="choice" value="2" />' +
          '<label for="choice6">Choice 2</label>' +
          '<input id="choice7" type="radio" name="choice" value="3" />' +
          '<label for="choice7">Choice 3</label>' +
          '<input id="choice8" type="radio" name="choice" value="4" />' +
          '<label for="choice8">Choice 4</label>' +
        '</form>'
    },
    {
      title: 'Soccer',
      content: '<h2>Soccer</h2>' + LOREM
    },
    {
      title: 'Basketball',
      content: '<h2>Basketball</h2>' + LOREM
    },
    {
      title: 'Tennis',
      content: '<h2>Tennis</h2>' + LOREM
    },
    {
      title: 'Track and Field',
      content: '<h2>Track and Field</h2>' + LOREM
    },
    {
      title: 'Bowling',
      content: '<h2>Bowling</h2>' + LOREM
    },
    {
      title: 'Baseball',
      content: '<h2>Baseball</h2>' + LOREM
    },
    {
      title: 'Hockey',
      content: '<h2>Hockey</h2>' + LOREM
    },
    {
      title: 'Squash',
      content: '<h2>Squash</h2>' + LOREM
    }
  ]
});
