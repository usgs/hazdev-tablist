'use strict';

// sequence for assigning unique element ids, for aria roles
var ID_SEQUENCE = 0;


/**
 * Format tab (summary) content for a list item.
 *
 * @param obj {Object}
 *        object being added to the list.
 * @return {String|DOMElement}
 *         This implementation returns obj.title.
 */
var __getTabContent = function(obj) {
  return obj.title;
};


/**
 * Format panel (detail) content for a list item.
 *
 * @param obj {Object}
 *        object being added to the list.
 * @return {String|DOMElement}
 *         If obj.content is a function, its return value is returned.
 *         Otherwise, this implementation returns obj.content.
 */
var __getPanelContent = function(obj) {
  if (typeof obj.content === 'function') {
    return obj.content(obj);
  } else {
    return obj.content;
  }
};


/**
 * Construct a new ItemList.
 *
 * Sub-classes may override the methods __getTabContent() and
 * getPanelContent() to change list formatting.
 *
 * @param options {Object}
 * @param options.el {DOMElement}
 *        Optional, default is new section element.
 * @param options.header {String}
 *        Optional, markup placed in header for tab list.
 * @param options.tabs {Array<Object>}
 *        Optional, any items are passed to addItem().
 */
var TabList = function (options) {

  var _this,
      _initialize,

      _backward,
      _container,
      _endPosition,
      _header,
      _forward,
      _nav,
      _navPosition,
      _positionChange,
      _selected,
      _startPosition,
      _dontSelect,
      _tabs,

      _centerSelectedTab,
      _checkValueBeforeScrolling,
      _ensureSelected,
      _onDragEnd,
      _onDragScroll,
      _onDragStart,
      _onKeyPress,
      _selectTab,
      _setTranslate,
      _showTabPosition,
      _updateTabIndex;

  _this = Object.create({});


  _initialize = function () {
    _this.el = options.el || document.createElement('section');
    _this.el.classList.add('tablist');

    // add header
    if (options.header) {
      _header = _this.el.appendChild(document.createElement('header'));
      _header.innerHTML = options.header;
    }

    // create tab container
    _container = document.createElement('div');
    _container.className = 'tablist-container';

    // create tab list
    _nav = document.createElement('nav');
    _nav.setAttribute('role', 'tablist');
    _nav.classList.add('smooth');
    _navPosition = 0;
    _positionChange = 0;

    // add tab back/next buttons
    _backward = document.createElement('div');
    _backward.className = 'tablist-backward-button';
    _backward.innerHTML = '<div class="image"></div>';

    _forward = document.createElement('div');
    _forward.className = 'tablist-forward-button';
    _forward.innerHTML = '<div class="image"></div>';

    _container.appendChild(_nav);
    _this.el.appendChild(_backward);
    _this.el.appendChild(_container);
    _this.el.appendChild(_forward);

    _onDragScroll = _onDragScroll.bind(this);
    _onDragStart = _onDragStart.bind(this);
    _onDragEnd = _onDragEnd.bind(this);
    _onKeyPress = _onKeyPress.bind(this);

    // mouse (desktop) interactions
    _backward.addEventListener('click', _this.selectPreviousTab);
    _forward.addEventListener('click', _this.selectNextTab);
    _nav.addEventListener('mousedown', _onDragStart);

    // touch (mobile) interactions
    _nav.addEventListener('touchstart', _onDragStart);

    // keyboard interactions
    _nav.addEventListener('keydown', _onKeyPress);
    _nav.addEventListener('keyup', _onKeyPress);

    // array of tab objects
    _tabs = [];

    // add any items provided when constructing
    if (options.tabs) {
      for (var i=0, len=options.tabs.length; i<len; i++) {
        _this.addTab(options.tabs[i], true);
      }
      _ensureSelected();
    }
  };


  /**
   * Called on "keypress", handles changing the selected tab from the
   * tablist-tab navigation when a enter is clicked on a tab with focus,
   * or the left/right directional pad is clicked.
   *
   * @param  {object} e,
   *         "keypress" event
   */
  _onKeyPress = function (e) {
    var keyCode = e.keyCode;


    if (e.type === 'keydown') {
      // prevent scrolling the window
      if (keyCode === 38 || keyCode === 40) {
        e.preventDefault();
      }
      return;
    }

    if (keyCode === 37 || keyCode === 38) {
      // d-pad left/up key
      _this.selectPreviousTab();
    } else if (keyCode === 39 || keyCode === 40) {
      // d-pad right/down key
      _this.selectNextTab();
    }
  };


  /**
   * Called on "touchstart" or "mousedown", tracks the drag start position
   * and adds event listeners for mouse events or touch events that update
   * the position of the tablist-tab navigation.
   *
   * @param  {object} e,
   *         "mousedown" event OR "touchstart" event
   */
  _onDragStart = function (e) {
    // do not animate a click/touch drag event
    _nav.classList.remove('smooth');

    if (e.type === 'mousedown') {
      _startPosition = e.clientX;
      document.addEventListener('mousemove', _onDragScroll);
      document.addEventListener('mouseup', _onDragEnd);
    } else if (e.type === 'touchstart') {
      // keeps mouse event from being delivered on touch events
      e.preventDefault();
      _startPosition = e.touches[0].clientX;
      document.addEventListener('touchmove', _onDragScroll);
      document.addEventListener('touchend', _onDragEnd);
      document.addEventListener('touchcancel', _onDragEnd);
    }
  };


  /**
   * Called on "touchend" or "mouseup", removes event listeners
   * for mouse events or touch events that update the position
   * of the tablist-tab navigation.
   *
   * @param  {object} e,
   *         "mouseup" event OR "touchend" event
   */
  _onDragEnd = function (e) {

    if (e.type === 'mouseup') {
      document.removeEventListener('mousemove', _onDragScroll);
      document.removeEventListener('mouseup', _onDragEnd);
    } else if (e.type === 'touchend' || e.type === 'touchcancel') {
      document.removeEventListener('touchmove', _onDragScroll);
      document.removeEventListener('touchend', _onDragEnd);
      document.removeEventListener('touchcancel', _onDragEnd);
    }

    _checkValueBeforeScrolling(_navPosition + _positionChange);

    _positionChange = 0;

    // add back the class that animates nav sliding
    _nav.classList.add('smooth');
  };


  /**
   * center the selected tab on the navigation slidfr.
   */
  _centerSelectedTab = function () {
    var tab = _selected.tabEl,
        position;

    // slide all the way to left edge
    position = (tab.offsetLeft * -1);
    // push tab (left-edge of tab) to the middle
    position = position + (_nav.clientWidth / 2);
    // center the tab, by adjusting half of the width right
    position = position - (tab.clientWidth / 2);
    // don't leave half of a px
    position = Math.round(position);

    _checkValueBeforeScrolling(position);
  };


  /**
   * Checks the translate value before it is applied to ensure that
   * tab slider is not scrolled more than it needs to be to make
   * the selected tab visible.
   */
  _checkValueBeforeScrolling = function (value) {
    var maxScroll = 0,
        minScroll = _nav.clientWidth - _nav.scrollWidth;

    // sanitize value
    if (value < minScroll) {
      value = minScroll;
    } else if (value > maxScroll) {
      value = maxScroll;
    }

    // scroll nav slider
    _setTranslate(value);

    // update tracking of navPosition
    _navPosition = value;
  };


  /**
   * Called on "mousemove", updates the scrollLeft position
   * on the nav slider that contains the tab elements.
   *
   * @param  {object} e,
   *         "mousemove" event
   */
  _onDragScroll = function (e) {
    var position,
        positionChange,
        type;

    type = e.type;

    if (type === 'mousemove') {
      position = e.clientX;
    } else if (type === 'touchmove') {
      position = e.touches[0].clientX;
    }

    positionChange = position - _startPosition;
    _positionChange = positionChange;
    _setTranslate(_navPosition + positionChange);

    if (Math.abs(positionChange) >= 5) {
     _dontSelect = true;
    }
  };


  /**
   * Update the position of the nav slider.
   *
   * @param {Number} position,
   *        the x-position of the slider
   */
  _setTranslate = function (position) {

    _nav.style['-webkit-transform'] =
        'translate3d(' + position + 'px, 0px, 0px)';
    _nav.style['-moz-transform'] =
        'translate3d(' + position + 'px, 0px, 0px)';
    _nav.style['-ms-transform'] =
        'translate3d(' + position + 'px, 0px, 0px)';
    _nav.style['-o-transform'] =
        'translate3d(' + position + 'px, 0px, 0px)';
    _nav.style.transform = 'translate3d(' + position + 'px, 0px, 0px)';
  };

  /**
   * Adds/ Updates the span that indicates the current tab position,
   * automatically fades the tab position using the 'fade' class.
   */
  _showTabPosition = function () {
    var span = _this.el.querySelector('.tab-position-indicator'),
        currentTabNumber = _tabs.indexOf(_selected) + 1,
        totalTabNumber = _tabs.length;

    if (!span) {
      // create new span
      span = document.createElement('span');
      _this.el.appendChild(span);
    }

    // update text
    span.className = 'tab-position-indicator';
    span.innerHTML = currentTabNumber + ' of ' + totalTabNumber;

    window.setTimeout(function () {
      span.classList.add('fade');
    }, 500);
  };


  /**
   * Change tabindex to -1 on all tabs. Change tabindex on
   * selected tab to 0.
   */
  _updateTabIndex = function () {
    var tab;

    for (var i = 0; i < _tabs.length; i++) {
      tab = _tabs[i].tabEl;
      if (tab.getAttribute('tabindex') !== -1) {
        tab.setAttribute('tabindex', -1);
        tab.setAttribute('aria-hidden', true);
      }
    }

    _selected.tabEl.setAttribute('tabindex', 0);
    _selected.tabEl.setAttribute('aria-hidden', false);
  };


  /**
   * Select a tab in this list.
   *
   * @param  toSelect {Object}
   *         the tab to select, as returned by addTab().
   */
  _selectTab = function (toSelect) {
    var previouslySelected = _selected;

    for (var i=0, len=_tabs.length; i<len; i++) {
      var tab = _tabs[i],
          options = tab.options,
          tabEl = tab.tabEl,
          panelEl = tab.panelEl;
      if (tab === toSelect) {
        // load tab content, if needed...
        if (!tab.contentReady) {
          var panelContent = __getPanelContent(options);
          if (typeof panelContent === 'string') {
            tab.panelEl.innerHTML = panelContent;
          } else {
            tab.panelEl.appendChild(panelContent);
          }
          tab.contentReady = true;
        }
        // update state classes
        tabEl.classList.add('tablist-tab-selected');
        panelEl.classList.add('tablist-panel-selected');
        // notify tab it is visible, if needed...
        if (typeof options.onSelect === 'function') {
          options.onSelect();
        }
        // update selected tab
        _selected = tab;
        _updateTabIndex();
        _centerSelectedTab();
        tab.tabEl.focus();
        _showTabPosition();
      } else {
        tabEl.classList.remove('tablist-tab-selected');
        panelEl.classList.remove('tablist-panel-selected');
        // notify tab it is hidden, if needed...
        if (tab === previouslySelected &&
            typeof options.onDeselect === 'function') {
          options.onDeselect();
        }
      }
    }
  };


  _ensureSelected = function () {
    var selectedPanel = _this.el.querySelector('.tablist-panel-selected'),
        tabs;
    if (selectedPanel === null) {
      tabs = _tabs;
      if (tabs.length > 0) {
        // select first tab by default
        tabs[0].select();
      }
    }
  };


  /**
   * Add an item to this list.
   *
   * @param options {Object}
   *        item being added to list.
   * @param options.onSelect {Function}
   *        Optional.
   *        Called when tab is selected.
   * @see __getTabContent(), __getPanelContent()
   *      these methods format content shown in tabs and panels,
   *      and use the following parameters by default.
   * @param options.title {String|DOMElement}
   *        Used by __getTabContent() to generate tab content.
   * @param options.content {String|DOMElement|Function}
   *        Used by __getPanelContent() to generate panel content.
   * @return object with select() method that can be used to show the tab.
   */
  _this.addTab = function (options, dontEnsureSelected) {
    // assign unique ids to this items elements
    var id = ++ID_SEQUENCE;
    var tabId = 'tablist-tab-' + id;
    var panelId = 'tablist-panel-' + id;

    // summary element
    var tabEl = document.createElement('section');
    tabEl.id = tabId;
    tabEl.className = 'tablist-tab';
    tabEl.setAttribute('role', 'tab');
    tabEl.setAttribute('tabindex', -1);
    tabEl.setAttribute('aria-controls', panelId);
    var tabContent = __getTabContent(options);
    if (typeof tabContent === 'string') {
      tabEl.innerHTML = tabContent;
    } else {
      tabEl.appendChild(tabContent);
    }

    // detail element
    var panelEl = document.createElement('section');
    panelEl.id = panelId;
    panelEl.className = 'tablist-panel';
    panelEl.setAttribute('role', 'tabpanel');
    panelEl.setAttribute('aria-labelledby', tabId);
    // content added by _selectTab()

    // save reference to tab and elements
    var tab = {
      options: options,
      tabEl: tabEl,
      panelEl: panelEl,
      select: function () {
        if (_dontSelect === true) {
          _dontSelect = false;
        } else {
          _selectTab(tab);
        }
        return false;
      },
      touchend: function () {
        _nav.classList.add('smooth');
        tab.select();
        return false;
      },
      contentReady: false
    };

    _tabs.push(tab);

    // click handler for tab
    tabEl.addEventListener('click', tab.select);
    tabEl.addEventListener('touchend', tab.touchend);

    // select the first, or specified item
    if (options.selected === true) {
      tab.select();
    } else if (dontEnsureSelected !== true) {
      _ensureSelected();
    }

    // add elements to dom
    _nav.appendChild(tabEl);
    _this.el.appendChild(panelEl);

    // return reference to tab for selecting
    return tab;
  };

  _this.destroy = function () {
    var tab;

    // event bindings
    _nav.removeEventListener('mousedown', _onDragStart);
    _nav.removeEventListener('touchstart', _onDragStart);
    _nav.removeEventListener('keyup', _onKeyPress);
    _backward.removeEventListener('click', _this.selectPreviousTab);
    _forward.removeEventListener('click', _this.selectNextTab);

    // remove tabEl bindings
    if (_tabs) {
      for (var i = 0; i < _tabs.length; i++) {
        tab = _tabs[i];

        // if tab has onDestroy method, call onDestroy()
        if (typeof tab.options.onDestroy === 'function') {
          tab.options.onDestroy();
        }

        // remove click/tap event bindings
        tab.tabEl.removeEventListener('click', tab.select);
        tab.tabEl.removeEventListener('touchend', tab.touchend);
      }
    }

    // methods bound to 'this'
    _onDragScroll = null;
    _onDragStart = null;
    _onDragEnd = null;
    _onKeyPress = null;

    // DOM elements
    _this.el = null;
    _header = null;
    _container = null;
    _nav = null;
    _forward = null;
    _backward = null;

    // Position variables
    _navPosition = null;
    _positionChange = null;
    _startPosition = null;
    _endPosition = null;

    // tab objects
    _selected = null;
    _tabs = null;
  };

  /*
   * Called on 'backward' button click, and also called on
   * 'up'/'left' d-pad keyboard click. Selects the appropropriate tab
   * in the list. This includes wrapping from the last tab in the list
   * to the first.
   */
  _this.selectNextTab = function () {
    var increment = 1,
        currentIndex = _tabs.indexOf(_selected) + increment,
        maxTabIndex = _tabs.length - 1,
        minTabIndex = 0;

    // if at the end of the tablist, jump to start
    if (currentIndex > maxTabIndex) {
      currentIndex = minTabIndex;
    }

    _tabs[currentIndex].select();
  };

  /**
   * Called on 'forward' button click, and also called on
   * 'down'/'right' d-pad keyboard click. Selects the appropropriate tab
   * in the list. This includes wrapping from the first tab in the list
   * to the last.
   */
  _this.selectPreviousTab = function () {
    var increment = -1,
        currentIndex = _tabs.indexOf(_selected) + increment,
        maxTabIndex = _tabs.length - 1,
        minTabIndex = 0;

    // if at the start of the tablist, jump to end
    if (currentIndex < minTabIndex) {
      currentIndex = maxTabIndex;
      // bug with translate position, remove class that animates
      _nav.classList.remove('smooth');
      _tabs[currentIndex].select();
      _nav.classList.add('smooth');
    } else {
      _tabs[currentIndex].select();
    }
  };


  _initialize();
  return _this;
};


var tabbifyOne = function (el) {
  var tabs = [],
      panels,
      panel,
      i, len,
      tablist;

  panels = el.querySelectorAll('.panel');
  for (i = 0, len = panels.length; i < len; i++) {
    panel = panels[i];
    tabs.push({
      'title': panel.getAttribute('data-title') ||
          panel.querySelector('header').innerHTML,
      'content': panel.innerHTML,
      'selected': panel.getAttribute('data-selected') === 'true'
    });
  }

  tablist = TabList({
    'tabs': tabs
  });

  el.parentNode.replaceChild(tablist.el, el);
};

var tabbifyAll = function () {
  var lists,
      i;
  lists = document.querySelectorAll('.tablist');
  for (i = lists.length - 1; i >= 0; i--) {
    TabList.tabbifyOne(lists[i]);
  }
};


// Expose public methods
TabList.tabbifyAll = tabbifyAll;
TabList.tabbifyOne = tabbifyOne;

module.exports = TabList;
