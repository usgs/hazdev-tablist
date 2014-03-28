/* global define, describe, it */

define([
	'chai',
	'tablist/TabList'
], function (
	chai,
	TabList
) {
	'use strict';

	var expect = chai.expect;


	describe('Unit tests for the "TabList" class', function () {

		describe('addTab()', function () {

			it('returned object has select() method that selects tab', function () {

				var testEl = document.createElement('div');
				var tabList = new TabList({
					el: testEl
				});

				var tab1Ref = tabList.addTab({
					title: 'title1',
					content: 'content1'
				});
				var tab2Ref = tabList.addTab({
					title: 'title2',
					content: 'content2'
				});

				var tabEl1 = tab1Ref.tabEl.classList,
				    panelEl1 = tab1Ref.panelEl.classList,
				    tabEl2 = tab2Ref.tabEl.classList,
				    panelEl2 = tab2Ref.panelEl.classList,
				    tabSelected = 'tablist-tab-selected',
				    panelSelected = 'tablist-panel-selected';

				// first tab added is selected by default
				expect(tabEl1.contains(tabSelected)).to.equal(true);
				expect(panelEl1.contains(panelSelected)).to.equal(true);
				expect(tabEl2.contains(tabSelected)).to.equal(false);
				expect(panelEl2.contains(panelSelected)).to.equal(false);
				// now select tab 2 to confirm classes have changed
				tab2Ref.select();
				expect(tabEl1.contains(tabSelected)).to.equal(false);
				expect(panelEl1.contains(panelSelected)).to.equal(false);
				expect(tabEl2.contains(tabSelected)).to.equal(true);
				expect(panelEl2.contains(panelSelected)).to.equal(true);
				// and select tab 1 again to confirm classes have changed back
				tab1Ref.select();
				expect(tabEl1.contains(tabSelected)).to.equal(true);
				expect(panelEl1.contains(panelSelected)).to.equal(true);
				expect(tabEl2.contains(tabSelected)).to.equal(false);
				expect(panelEl2.contains(panelSelected)).to.equal(false);

			});

			it('sets up aria relationships between tab and panel', function () {
				var testEl = document.createElement('div');
				var tabList = new TabList({
					el: testEl
				});

				// check tablist role
				var navEl = testEl.querySelector('nav');
				expect(navEl.getAttribute('role')).to.equal('tablist');

				// add a tab
				var tab1Ref = tabList.addTab({
					title: 'title1',
					content: 'content1'
				});
				var tabEl = tab1Ref.tabEl;
				var panelEl = tab1Ref.panelEl;

				// check tab role and aria-controls attribute
				expect(tabEl.getAttribute('role')).to.equal('tab');
				expect(tabEl.getAttribute('aria-controls')).to.equal(panelEl.id);

				// check panel role and aria-labelledby attribute
				expect(panelEl.getAttribute('role')).to.equal('tabpanel');
				expect(panelEl.getAttribute('aria-labelledby')).to.equal(tabEl.id);
			});

		});

	});

});