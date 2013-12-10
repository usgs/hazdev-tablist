define([], function () {
	'use strict';


	// sequence for assigning unique element ids, for aria roles
	var ID_SEQUENCE = 0;


	/**
	 * Construct a new ItemList.
	 *
	 * Sub-classes may override the methods formatTabContent() and
	 * formatPanelContent() to change list formatting.
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

		// array of tab objects
		this._tabs = [];

		// add any items provided when constructing
		if (options.tabs) {
			for (var i=0, len=options.tabs.length; i<len; i++) {
				this.addTab(options.tabs[i]);
			}
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
	 *         This implementation returns obj.content.
	 */
	TabList.prototype.getPanelContent = function(obj) {
		return obj.content;
	};

	/**
	 * Add an item to this list.
	 *
	 * @param options {Object}
	 *        item being added to list.
	 * @see getTabContent(), getPanelContent()
	 *      these methods format content shown in tabs and panels.
	 * @return object with select() method that can be used to show the tab.
	 */
	TabList.prototype.addTab = function (options) {
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
		var panelContent = this.getPanelContent(options);
		if (typeof panelContent === 'string') {
			panelEl.innerHTML = panelContent;
		} else {
			panelEl.appendChild(panelContent);
		}

		var _this = this;
		// save reference to tab and elements
		var tab = {
			options: options,
			tabEl: tabEl,
			panelEl: panelEl,
			select: function () {
				_this._selectTab(tab);
				return false;
			}
		};
		this._tabs.push(tab);

		// click handler for tab
		tabEl.addEventListener('click', tab.select);

		// select the first, or specified item
		if (options.selected || this._tabs.length === 1) {
			tab.select();
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
			var tab = this._tabs[i];
			if (tab === toSelect) {
				tab.tabEl.classList.add('selected');
				tab.panelEl.classList.add('selected');
				tab.panelEl.focus();
			} else {
				tab.tabEl.classList.remove('selected');
				tab.panelEl.classList.remove('selected');
			}
		}
	};


	return TabList;
});

