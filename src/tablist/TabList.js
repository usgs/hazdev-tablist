/* global define */
define([], function () {
	'use strict';

	// sequence for assigning unique element ids, for aria roles
	var ID_SEQUENCE = 0;


	/**
	 * Construct a new ItemList.
	 *
	 * Sub-classes may override the methods getTabContent() and
	 * getPanelContent() to change list formatting.
	 *
	 * @param options {Object}
	 * @param options.el {DOMElement}
	 *        Optional, default is new section element.
	 * @param options.header {String}
	 *        Optional, markup placed in header for tab list.
	 * @param options.tabs {Array<Object>}
	 *        Optional, any items are passed to addItem().
	 * @param options.tabPosition {String}
	 *        Optional, default "left".
	 *        "left", "right", "top" are only supported options.
	 */
	var TabList = function (options) {
		var backward, forward, container;

		this.el = options.el || document.createElement('section');
		this.el.classList.add('tablist');

		// add tab position class, if needed
		if (options.tabPosition === 'right') {
			this.el.classList.add('tablist-right');
		} else if (options.tabPosition === 'top') {
			this.el.classList.add('tablist-top');
		} else {
			this.el.classList.add('tablist-left');
		}

		// add header
		if (options.header) {
			this._header = this.el.appendChild(document.createElement('header'));
			this._header.innerHTML = options.header;
		}

		// create tab container 
		container = this._container = document.createElement('div');
		container.className = 'tablist-container';

		// create tab list
		this._nav = document.createElement('nav');
		this._nav.setAttribute('role', 'tablist');
		this._nav.classList.add('smooth');
		this._navPosition = 0;
		this._positionChange = 0;

		// add tab back/next buttons
		backward = this._backward = document.createElement('div');
		backward.className = 'tablist-backward-button';
		backward.innerHTML = '<div class="image"></div>';

		forward = this._forward = document.createElement('div');
		forward.className = 'tablist-forward-button';
		forward.innerHTML = '<div class="image"></div>';


		container.appendChild(this._nav);
		this.el.appendChild(backward);
		this.el.appendChild(container);
		this.el.appendChild(forward);

		this._clickNavScrolling = this._clickNavScrolling.bind(this);
		this._touchNavScrolling = this._touchNavScrolling.bind(this);
		this._onDragStart = this._onDragStart.bind(this);
		this._onDragEnd = this._onDragEnd.bind(this);
		this._onKeyPress = this._onKeyPress.bind(this);
		this._selectPreviousTab = this._selectPreviousTab.bind(this);
		this._selectNextTab = this._selectNextTab.bind(this);

		// mouse (desktop) interactions
		this._backward.addEventListener('click', this._selectPreviousTab);
		this._forward.addEventListener('click', this._selectNextTab);


		this._nav.addEventListener('mousedown', this._onDragStart);
		this._nav.addEventListener('mouseup', this._onDragEnd);

		// touch (mobile) interactions
		this._nav.addEventListener('touchstart', this._onDragStart);
		this._nav.addEventListener('touchend', this._onDragEnd);

		// keyboard interactions
		this._nav.addEventListener('keyup', this._onKeyPress);


		// array of tab objects
		this._tabs = [];

		// add any items provided when constructing
		if (options.tabs) {
			for (var i=0, len=options.tabs.length; i<len; i++) {
				this.addTab(options.tabs[i], true);
			}
			this._ensureSelected();
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
	TabList.prototype._onKeyPress = function (e) {
		var keyCode = e.keyCode;

		// only trigger event on keyup
		if (e.type === 'keydown') {
			return;
		}

		// up/down key, shouldn't scroll the page when this._nav has focus
		if (e.keyCode === 38 || e.keyCode === 40) {
			e.preventDefault();
		}

		if (keyCode === 37 || keyCode === 38) {
			// d-pad left/up key
			this._selectPreviousTab();
		} else if (keyCode === 39 || keyCode === 40) {
			// d-pad right/down key
			this._selectNextTab();
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
	TabList.prototype._onDragStart = function (e) {
		// if no saved navigation position exists, start at zero
		if (!this._navPosition) {
			this._navPosition = 0;
		}
		// do not animate a click/touch drag event
		this._nav.classList.remove('smooth');
		// reset the position change, used to determine click vs scroll
		this._positionChange = 0;

		if (e.type === 'mousedown') {
			this._startPosition = e.clientX;
			document.addEventListener('mousemove', this._clickNavScrolling);
			this._nav.addEventListener('mouseleave', this._onDragEnd);
		} else if (e.type === 'touchstart') {
			// keeps mouse event from being delivered on touch events
			e.preventDefault();
			this._startPosition = e.touches[0].clientX;
			document.addEventListener('touchmove', this._touchNavScrolling);
			this._nav.addEventListener('touchleave', this._onDragEnd);
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
	TabList.prototype._onDragEnd = function (e) {
		// maxScroll = container width - total nav width
		var maxScroll = 0,
		    minScroll = this._nav.clientWidth - this._nav.scrollWidth;

		// set final position to current position for navigation
		this._navPosition = this._navPosition + this._positionChange;

		if (e.type === 'mouseup' || e.type === 'mouseleave') {
			document.removeEventListener('mousemove', this._clickNavScrolling);
			this._nav.removeEventListener('mouseleave', this._onDragEnd);
		} else if (e.type === 'touchend') {
			document.removeEventListener('touchmove', this._touchNavScrolling);
			this._nav.removeEventListener('touchleave', this._onDragEnd);
		}

		// if the user scrolls outside of the content (snap to min or max scroll)
		// this happens after mouseup, mouseleave, touchend, or touchleave
		if (this._navPosition < minScroll) {
			this._navPosition = minScroll;
			this._setTranslate(this._navPosition);
		} else if (this._navPosition > maxScroll) {
			this._navPosition = maxScroll;
			this._setTranslate(this._navPosition);
		}

		// add back the class that animates nav sliding
		this._nav.classList.add('smooth');
	};


	/**
	 * center the selected tab on the navigation slidfr.
	 */
	TabList.prototype._centerSelectedTab = function () {
		var tab = this._selected.tabEl,
		    position;

		// slide all the way to left edge
		position = (tab.offsetLeft * -1);
		// push tab (left-edge of tab) to the middle
		position = position + (this._nav.clientWidth / 2);
		// center the tab, by adjusting half of the width right
		position = position - (tab.clientWidth / 2);
		// don't leave half of a px
		position = Math.round(position);

		this._checkValueBeforeScrolling(position);
	};


	/**
	 * Checks the translate value before it is applied to ensure that
	 * tab slider is not scrolled more than it needs to be to make
	 * the selected tab visible.
	 */
	TabList.prototype._checkValueBeforeScrolling = function (value) {
		var maxScroll = 0,
		    minScroll = this._nav.clientWidth - this._nav.scrollWidth;

		// sanitize value
		if (value < minScroll) {
			value = minScroll;
		} else if (value > maxScroll) {
			value = maxScroll;
		}

		// scroll nav slider
		this._setTranslate(value);

		// update tracking of navPosition
		this._navPosition = value;
	};

	/**
	 * Called on "mousemove", updates the scrollLeft position
	 * on the nav slider that contains the tab elements.
	 *
	 * @param  {object} e,
	 *         "mousemove" event
	 */
	TabList.prototype._clickNavScrolling = function (e) {
		this._endPosition = e.clientX;
		this._positionChange = this._endPosition - this._startPosition;
		this._setTranslate(this._navPosition + this._positionChange);
	};

	/**
	 * Called on "touchmove", updates the scrollLeft position
	 * on the nav slider that contains the tab elements.
	 *
	 * @param  {object} e,
	 *         "touchmove" event
	 */
	TabList.prototype._touchNavScrolling = function (e) {
		this._endPosition = e.touches[0].clientX;
		this._positionChange = this._endPosition - this._startPosition;
		this._setTranslate(this._navPosition + this._positionChange);
	};

	/**
	 * Update the position of the nav slider.
	 *
	 * @param {Number} position,
	 *        the x-position of the slider
	 */
	TabList.prototype._setTranslate = function (position) {

		this._nav.style['-webkit-transform'] =
				'translate3d(' + position + 'px, 0px, 0px)';
		this._nav.style['-moz-transform'] =
				'translate3d(' + position + 'px, 0px, 0px)';
		this._nav.style['-ms-transform'] =
				'translate3d(' + position + 'px, 0px, 0px)';
		this._nav.style['-o-transform'] =
				'translate3d(' + position + 'px, 0px, 0px)';
		this._nav.style.transform = 'translate3d(' + position + 'px, 0px, 0px)';
	};


	/**
	 * Called on 'forward' button click, and also called on
	 * 'down'/'right' d-pad keyboard click. Selects the appropropriate tab
	 * in the list. This includes wrapping from the first tab in the list
	 * to the last.
	 */
	TabList.prototype._selectPreviousTab = function () {
		var increment = -1,
		    currentIndex = this._tabs.indexOf(this._selected) + increment,
		    maxTabIndex = this._tabs.length - 1,
		    minTabIndex = 0;


		// if at the start of the tablist, jump to end
		if (currentIndex < minTabIndex) {
			currentIndex = maxTabIndex;
			// bug with translate position, remove class that animates
			this._nav.classList.remove('smooth');
			this._tabs[currentIndex].select();
			this._nav.classList.add('smooth');
		} else {
			this._tabs[currentIndex].select();
		}

	};



	/**
	 * Called on 'backward' button click, and also called on
	 * 'up'/'left' d-pad keyboard click. Selects the appropropriate tab
	 * in the list. This includes wrapping from the last tab in the list
	 * to the first.
	 */
	TabList.prototype._selectNextTab = function () {
		var increment = 1,
		    currentIndex = this._tabs.indexOf(this._selected) + increment,
		    maxTabIndex = this._tabs.length - 1,
		    minTabIndex = 0;

		// if at the end of the tablist, jump to start
		if (currentIndex > maxTabIndex) {
			currentIndex = minTabIndex;
		}

		this._tabs[currentIndex].select();
	};


	/**
	 * Adds/ Updates the span that indicates the current tab position,
	 * automatically fades the tab position using the 'fade' class.
	 */
	TabList.prototype._showTabPosition = function () {
		var span = this.el.querySelector('.tab-position-indicator'),
		    currentTabNumber = this._tabs.indexOf(this._selected) + 1,
		    totalTabNumber = this._tabs.length;

		if (span) {
			// update text
			span.className = 'tab-position-indicator';
			span.innerHTML = currentTabNumber + ' of ' + totalTabNumber;
		} else {
			// create new span
			span = document.createElement('span');
			span.className = 'tab-position-indicator';
			span.innerHTML = currentTabNumber + ' of ' + totalTabNumber;
			this.el.appendChild(span);
		}

		window.setTimeout(function () {
			span.classList.add('fade');
		}, 500);
	};

	/**
	 * Change tabindex to -1 on all tabs. Change tabindex on
	 * selected tab to 0.
	 */
	TabList.prototype._updateTabIndex = function () {
		var tab;

		for (var i = 0; i < this._tabs.length; i++) {
			tab = this._tabs[i].tabEl;
			if (tab.getAttribute('tabindex') !== -1) {
				tab.setAttribute('tabindex', -1);
				tab.setAttribute('aria-hidden', true);
			}
		}

		this._selected.tabEl.setAttribute('tabindex', 0);
		this._selected.tabEl.setAttribute('aria-hidden', false);
	};


	/**
	 * Format tab (summary) content for a list item.
	 *
	 * @param obj {Object}
	 *        object being added to the list.
	 * @return {String|DOMElement}
	 *         This implementation returns obj.title.
	 */
	TabList.prototype.getTabContent = function(obj) {
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
	TabList.prototype.getPanelContent = function(obj) {
		if (typeof obj.content === 'function') {
			return obj.content();
		} else {
			return obj.content;
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
	 * @see getTabContent(), getPanelContent()
	 *      these methods format content shown in tabs and panels,
	 *      and use the following parameters by default.
	 * @param options.title {String|DOMElement}
	 *        Used by getTabContent() to generate tab content.
	 * @param options.content {String|DOMElement|Function}
	 *        Used by getPanelContent() to generate panel content.
	 * @return object with select() method that can be used to show the tab.
	 */
	TabList.prototype.addTab = function (options, dontEnsureSelected) {
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
		var tabContent = this.getTabContent(options);
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

		var _this = this;
		// save reference to tab and elements
		var tab = {
			options: options,
			tabEl: tabEl,
			panelEl: panelEl,
			select: function (e) {
				// smooth the touchend click, without smoothing any drag events
				if (e && e.type === 'touchend') {
					_this._nav.classList.add('smooth');
				}
				if (_this._clickOccurred()) {
					_this._selectTab(tab);
				}
				return false;
			},
			contentReady: false
		};
		this._tabs.push(tab);

		// click handler for tab
		tabEl.addEventListener('click', tab.select);
		tabEl.addEventListener('touchend', tab.select);

		// select the first, or specified item
		if (options.selected === true) {
			tab.select();
		} else if (dontEnsureSelected !== true) {
			this._ensureSelected();
		}

		// add elements to dom
		this._nav.appendChild(tabEl);
		this.el.appendChild(panelEl);

		// return reference to tab for selecting
		return tab;
	};

	/**
	 * if the drag <= 5px, consider it a click
	 */
	TabList.prototype._clickOccurred = function () {
		if (Math.abs(this._positionChange) <= 5) {
			return true;
		}

		return false;
	};

	/**
	 * Select a tab in this list.
	 *
	 * @param  toSelect {Object}
	 *         the tab to select, as returned by addTab().
	 */
	TabList.prototype._selectTab = function (toSelect) {
		var previouslySelected = this._selected;

		for (var i=0, len=this._tabs.length; i<len; i++) {
			var tab = this._tabs[i],
			    options = tab.options,
			    tabEl = tab.tabEl,
			    panelEl = tab.panelEl;
			if (tab === toSelect) {
				// load tab content, if needed...
				if (!tab.contentReady) {
					var panelContent = this.getPanelContent(options);
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
				this._selected = tab;
				this._updateTabIndex();
				this._centerSelectedTab();
				tab.tabEl.focus();
				this._showTabPosition();
			} else {
				tabEl.classList.remove('tablist-tab-selected');
				panelEl.classList.remove('tablist-panel-selected');
			}
		}

		// call deselect on previously selected tab to remove any bindings
		// that exist in the content
		if (previouslySelected && previouslySelected.deselect &&
				typeof previouslySelected.deselect === 'function') {
			previouslySelected.deselect();
		}
	};

	TabList.prototype._ensureSelected = function () {
		var selectedPanel = this.el.querySelector('.tablist-panel-selected'),
		    tabs;
		if (selectedPanel === null) {
			tabs = this._tabs;
			if (tabs.length > 0) {
				// select first tab by default
				tabs[0].select();
			}
		}
	};

	TabList.tabbifyOne = function (el) {
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

		tablist = new TabList({
			'tabPosition': el.getAttribute('data-tabposition') || 'left',
			'tabs': tabs
		});

		el.parentNode.replaceChild(tablist.el, el);
	};

	TabList.tabbifyAll = function () {
		var lists,
		    i;
		lists = document.querySelectorAll('.tablist');
		for (i = lists.length - 1; i >= 0; i--) {
			TabList.tabbifyOne(lists[i]);
		}
	};

	TabList.prototype.destroy = function () {
		var tab;

		// event bindings
		this._nav.removeEventListener('mousedown', this._onDragStart);
		this._nav.removeEventListener('mouseup', this._onDragEnd);
		this._nav.removeEventListener('touchstart', this._onDragStart);
		this._nav.removeEventListener('touchend', this._onDragEnd);
		this._nav.removeEventListener('keyup', this._onKeyPress);
		this._backward.removeEventListener('click', this._selectPreviousTab);
		this._forward.removeEventListener('click', this._selectNextTab);

		// remove tabEl bindings
		if (this._tabs) {
			for (var i = 0; i < this._tabs.length; i++) {
				tab = this._tabs[i];

				// if tab has onDestroy method, call onDestroy()
				if (tab.onDestroy && typeof tab.onDestroy === 'function') {
					tab.onDestroy();
				}

				// remove click/tap event bindings
				tab.tabEl.removeEventListener('click', tab.select);
				tab.tabEl.removeEventListener('touchend', tab.select);
			}
		}

		// methods bound to 'this'
		this._clickNavScrolling = null;
		this._touchNavScrolling = null;
		this._onDragStart = null;
		this._onDragEnd = null;
		this._onKeyPress = null;
		this._selectPreviousTab = null;
		this._selectNextTab = null;

		// DOM elements
		this.el = null;
		this._header = null;
		this._container = null;
		this._nav = null;
		this._forward = null;
		this._backward = null;

		// Position variables
		this._navPosition = null;
		this._positionChange = null;
		this._startPosition = null;
		this._endPosition = null;

		// tab objects
		this._selected = null;
		this._tabs = null;
	};

	return TabList;

});