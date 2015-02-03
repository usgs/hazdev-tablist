/* global describe, it, beforeEach, afterEach */

'use strict';

var chai = require('chai'),
    sinon = require('sinon'),
    TabList = require('tablist/TabList');

var expect = chai.expect;

var getClickEvent = function () {
  var clickEvent = document.createEvent('MouseEvents');
  clickEvent.initMouseEvent('click', true, true, window, 1, 0, 0);
  return clickEvent;
};

describe('Unit tests for the "TabList" class', function () {

  describe('constructor()', function () {

      it('Can be defined.', function () {
        var tl = TabList({});
        /* jshint -W030 */
        expect(tl).not.to.be.undefined;
        /* jshint +W030 */
      });
  });

  describe('addTab()', function () {

    it('selects the first tab by default', function () {
      var testEl = document.createElement('div');
      var tabList = TabList({
        el: testEl
      });

      var tab1Ref = tabList.addTab({
        title: 'title1',
        content: 'content1'
      });

      expect(tab1Ref.contentReady).to.equal(true);
      expect(tab1Ref.tabEl.classList.contains('tablist-tab-selected')).
          to.equal(true);
      expect(tab1Ref.panelEl.classList.contains('tablist-panel-selected')).
          to.equal(true);
    });

    it('returned object has select() method that selects tab', function () {

      var testEl = document.createElement('div');
      var tabList = TabList({
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

  describe('_selectTab()', function () {

    it('loads tab content once, calls onSelect callback each time',
        function () {
      var tl,
          tabOptions,
          contentSpy,
          onSelectSpy,
          tabRef;

      // create tablist with a tab, which will be selected
      tl = new TabList({
        tabs: [
          {
            title: 'tab1',
            content: 'content1'
          }
        ]
      });
      // add a tab with callback spies
      tabOptions = {
        title: 'my title',
        content: function () {
          return 'my content';
        },
        onSelect: function () {}
      };
      contentSpy = sinon.spy(tabOptions, 'content');
      onSelectSpy = sinon.spy(tabOptions, 'onSelect');
      tabRef = tl.addTab(tabOptions);

      // not selected
      expect(tabRef.contentReady).to.equal(false);
      expect(contentSpy.callCount).to.equal(0);
      expect(onSelectSpy.callCount).to.equal(0);

      // select first time
      tabRef.select();
      expect(tabRef.contentReady).to.equal(true);
      expect(contentSpy.callCount).to.equal(1);
      expect(onSelectSpy.callCount).to.equal(1);

      // select second time
      tabRef.select();
      expect(contentSpy.callCount).to.equal(1);
      expect(onSelectSpy.callCount).to.equal(2);
    });

  });

  describe('navigate using the tablist navigation', function () {
    var tabList,
        tabs,
        nav,
        selected,
        before,
        after,
        forwardButton,
        backwardButton,
        getSelectedTab;

    beforeEach(function () {

      tabList = TabList({
        tabs: [
          {
            title: 'tab1',
            content: 'content1'
          },
          {
            title: 'tab2',
            content: 'content2'
          },
          {
            title: 'tab3',
            content: 'content3'
          }
        ]
      });

      nav = tabList.el.querySelector('nav');
      forwardButton = tabList.el.querySelector('.tablist-forward-button');
      backwardButton = tabList.el.querySelector('.tablist-backward-button');
      tabs = tabList.el.querySelectorAll('.tablist-tab');

      getSelectedTab = function () {
        for (var i = 0; i < tabs.length; i++) {
          if (tabs[i].classList.contains('tablist-tab-selected')) {
            selected = tabs[i];
          }
        }
        return selected;
      };

    });

    afterEach(function () {
      tabList = null;
      tabs = null;
      selected = null;
      before = null;
      after = null;
    });

    it('selects the next tab when the forward button is clicked',
        function () {

      before = getSelectedTab();
      forwardButton.dispatchEvent(getClickEvent());
      after = getSelectedTab();

      expect(before.innerHTML).to.equal('tab1');
      expect(before.innerHTML).to.not.equal(after.innerHTML);
      expect(after.innerHTML).to.equal('tab2');
    });

    it('selects the previous tab when the backward button is clicked',
        function () {

      before = getSelectedTab();
      backwardButton.dispatchEvent(getClickEvent());
      after = getSelectedTab();

      expect(before.innerHTML).to.equal('tab1');
      expect(before.innerHTML).to.not.equal(after.innerHTML);
      expect(after.innerHTML).to.equal('tab3');
    });

    it('selects the correct tab when the tab is clicked',
        function () {

      before = getSelectedTab();
      tabs[1].dispatchEvent(getClickEvent());
      after = getSelectedTab();

      expect(before.innerHTML).to.equal('tab1');
      expect(before.innerHTML).to.not.equal(after.innerHTML);
      expect(after.innerHTML).to.equal('tab2');
    });


    it('does nothing when a tab is clicked for the second time',
        function () {

      before = getSelectedTab();
      before.dispatchEvent(getClickEvent());
      after = getSelectedTab();

      expect(before.innerHTML).to.equal('tab1');
      expect(before).to.equal(after);
    });
  });

});
