/* global define */
define(['./TabList'], function (TabList) {
  'use strict';


  /**
   * Construct a new ImageList.
   *
   * Overrides getTabContent and getPanelContent for image content.
   *
   * @deprecated
   * @see TabList
   */
  var ImageList = function (options) {
    // call parent constructor
    TabList.call(this, options);
  };

  // extend TabList
  ImageList.prototype = Object.create(TabList.prototype);


  /**
   * Format ImageList tab content.
   *
   * @param obj {Object}
   *        object being added.
   * @param obj.thumbnailTitle {String}
   *        Optional, default uses obj.title.
   *        Abbreviated title for tab.
   * @param obj.thumbnailImage {String}
   *        Optional, default uses obj.image.
   *        Smaller thumbnail for tab.
   * @param obj.title {String}
   *        title for panel.
   * @param obj.image {String}
   *        url for image.
   * @param obj.alt {String}
   *        Optional, default is empty string.
   *        image alt text.
   */
  ImageList.prototype.getTabContent = function (obj) {
    return [
        '<header>', (obj.thumbnailTitle || obj.title), '</header>',
        '<img src="', (obj.thumbnailImage || obj.image), '"',
            ' alt="', (obj.alt || ''), '"/>'
      ].join('');
  };

  /**
   * Format ImageList panel content.
   *
   * @param obj {Object}
   *        object being added.
   * @param obj.title {String}
   *        title for panel.
   * @param obj.image {String}
   *        url for image.
   * @param obj.alt {String}
   *        Optional, default is empty string.
   *        Alt text for image.
   * @param obj.header {String}
   *        Optional, default is empty string.
   *        markup before image.
   * @param obj.footer {String}
   *        Optional, default is empty string.
   *        markup after image.
   * @param obj.attributes {Object}
   *        Optional.
   *        An object containing potential additional attributes for the
   *           image tag. ie usemap: mapname, etc
   */
  ImageList.prototype.getPanelContent = function (obj) {
    var attributes = obj.attributes,
        attributeString = '',
        attr;

    if (attributes) {
      for (attr in attributes) {
        attributeString += ' ' + attr + '="' + attributes[attr] + '"';
      }
    }
    return [
        '<header>', obj.title, '</header>',
        (obj.header || ''),
        '<img src="', obj.image, '"',
            ' alt="', (obj.alt || ''), '"',
            attributeString, '/>',
        (obj.footer || '')
      ].join('');
  };


  // return constructor
  return ImageList;
});