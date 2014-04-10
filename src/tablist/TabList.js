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
		var backward, forward, _this = this;

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
		this._nav = this.el.appendChild(document.createElement('nav'));
		this._nav.setAttribute('role', 'tablist');

		// add tab back/next buttons
		backward = this._backward = document.createElement('div');
		backward.className = 'tablist-backward-button';
		backward.innerHTML = '<div class="image"></div>';

		forward = this._forward = document.createElement('div');
		forward.className = 'tablist-forward-button';
		forward.innerHTML = '<div class="image"></div>';

		this.el.appendChild(backward);
		this.el.appendChild(forward);

		backward.addEventListener('click', function () {
				_this._clickButton({button:'backward'});
			});

		forward.addEventListener('click', function () {
				_this._clickButton({button:'forward'});
			});


		// array of tab objects
		this._tabs = [];

		// add any items provided when constructing
		if (options.tabs) {
			for (var i=0, len=options.tabs.length; i<len; i++) {
				this.addTab(options.tabs[i], true);
			}
			this._ensureSelected();
		}

		// initial state
		this._updateButtonState();
	};

	TabList.prototype._clickButton = function (options) {
		var move = options.button || null,
		    currentIndex = this._tabs.indexOf(this._selected);

		console.log(this);

		if (move === 'forward') {
			this._tabs[(currentIndex + 1)].select();
		} else {
			this._tabs[(currentIndex - 1)].select();
		}

		this._updateButtonState();
	};


	TabList.prototype._updateButtonState = function () {
		var currentIndex = this._tabs.indexOf(this._selected),
		    maxIndex = this._tabs.length - 1,
		    minIndex = 0;

		if (currentIndex === minIndex) {
			// first tab selected, hide back button
			this._backward.classList.add('tablist-button-hide');
			this._forward.classList.remove('tablist-button-hide');
		} else if (currentIndex === maxIndex) {
			// last tab selected, hide forward button
			this._forward.classList.add('tablist-button-hide');
			this._backward.classList.remove('tablist-button-hide');
		} else {
			// other button selected, show back and forward button
			this._forward.classList.remove('tablist-button-hide');
			this._backward.classList.remove('tablist-button-hide');
		}
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
			select: function () {
				_this._selectTab(tab);
				return false;
			},
			contentReady: false
		};
		this._tabs.push(tab);

		// click handler for tab
		tabEl.addEventListener('click', tab.select);

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
	 * Select a tab in this list.
	 *
	 * @param  toSelect {Object}
	 *         the tab to select, as returned by addTab().
	 */
	TabList.prototype._selectTab = function (toSelect) {
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
				panelEl.focus();
				// notify tab it is visible, if needed...
				if (typeof options.onSelect === 'function') {
					options.onSelect();
				}
				// update selected tab
				this._selected = tab;
				this._updateButtonState();
			} else {
				tabEl.classList.remove('tablist-tab-selected');
				panelEl.classList.remove('tablist-panel-selected');
			}
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


	return TabList;
});

