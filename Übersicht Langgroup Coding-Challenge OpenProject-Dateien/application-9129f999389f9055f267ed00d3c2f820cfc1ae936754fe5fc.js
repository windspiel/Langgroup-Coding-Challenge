/**
 * jQuery color contrast
 * @Author: 		Jochen Vandendriessche <jochen@builtbyrobot.com>
 * @Author URI: 	http://builtbyrobot.com
 **/


function debug(o){
	var _r = '';
	for (var k in o){
		_r += 'o[' + k + '] => ' + o[k] + '\n';
	}
	window.alert(_r);
}

(function($){

	var methods = {
		/*
			Function: init

			Initialises the color contrast

			Parameters:
				jQuery object - {object}

			Example
				> // initialise new color contrast calculator
				> $('body').colorcontrast();
		  
		*/
		init : function() {
			// check if we have a background image, if not, use the backgroundcolor
			if ($(this).css('background-image') == 'none') {
				$(this).colorcontrast('bgColor');
			}else{
				$(this).colorcontrast('bgImage');
			}
			return this;
		},
		bgColor : function() {
			var t = $(this);
			t.removeClass('dark light');
			t.addClass($(this).colorcontrast('calculateYIQ', t.css('background-color')));
		},
		bgImage : function() {
			var t = $(this);
			t.removeClass('dark light');
			t.addClass($(this).colorcontrast('calculateYIQ', t.colorcontrast('fetchImageColor')));
		},
		fetchImageColor : function(){
			var img = new Image();
			var src = $(this).css('background-image').replace('url(', '').replace(/'/, '').replace(')', '');
			img.src = src;
			var can = document.createElement('canvas');	
			var context = can.getContext('2d');
			context.drawImage(img, 0, 0);
			data = context.getImageData(0, 0, 1, 1).data;
			return 'rgb(' + data[0] + ',' + data[1] + ',' + data[2] + ')';
		},
		calculateYIQ : function(color){
			var r = 0, g = 0, b = 0, a = 1, yiq = 0;
			if (/rgba/.test(color)){
				color = color.replace('rgba(', '').replace(')', '').split(/,/);
				r = color[0];
				g = color[1];
				b = color[2];
				a = color[3];
			}else if (/rgb/.test(color)){
				color = color.replace('rgb(', '').replace(')', '').split(/,/);
				r = color[0];
				g = color[1];
				b = color[2];
			}else if(/#/.test(color)){
				color = color.replace('#', '');
				if (color.length == 3){
					var _t = '';
					_t += color[0] + color[0];
					_t += color[1] + color[1];
					_t += color[2] + color[2];
					color = _t;
				}
				r = parseInt(color.substr(0,2),16);
				g = parseInt(color.substr(2,2),16);
				b = parseInt(color.substr(4,2),16);
			}
			yiq = ((r*299)+(g*587)+(b*114))/1000;
			return (yiq >= 128) ? 'light' : 'dark';
		}
	};
	$.fn.colorcontrast = function(method){
		
		if ( methods[method] ) {
		      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		    } else if ( typeof method === 'object' || ! method ) {
		      return methods.init.apply( this, arguments );
		    } else {
		      $.error( 'Method ' +  method + ' does not exist on jQuery color contrast' );
		}
		
	}
	
})(this.jQuery);
/*!
Copyright (c) 2011, 2012 Julien Wajsberg <felash@gmail.com>
All rights reserved.

Official repository: https://github.com/julienw/jquery-trap-input
License is there: https://github.com/julienw/jquery-trap-input/blob/master/LICENSE
This is version 1.2.0.
*/


(function( $, undefined ){

/*
(this comment is after the first line of code so that uglifyjs removes it)

Redistribution and use in source and binary forms, with or without
modification, are permitted without condition.

Although that's not an obligation, I would appreciate that you provide a
link to the official repository.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
IS" AND ANY EXPRESS OR IMPLIED WARRANTIES ARE DISCLAIMED.
*/

/*jshint boss: true, bitwise: true, curly: true, expr: true, newcap: true, noarg: true, nonew: true, latedef: true, regexdash: true */

    var DATA_ISTRAPPING_KEY = "trap.isTrapping";

    function onkeypress(e) {
        if (e.keyCode === 9) {
            var goReverse = !!(e.shiftKey);
            if (processTab(this, e.target, goReverse)) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    }

    // will return true if we could process the tab event
    // otherwise, return false
    function processTab(container, elt, goReverse) {
        var $focussable = getFocusableElementsInContainer(container),
            curElt = elt,
            index, nextIndex, prevIndex, lastIndex;

        do {
            index = $focussable.index(curElt);
            nextIndex = index + 1;
            prevIndex = index - 1;
            lastIndex = $focussable.length - 1;

            switch(index) {
                case -1:
                    return false; // that's strange, let the browser do its job
                case 0:
                    prevIndex = lastIndex;
                    break;
                case lastIndex:
                    nextIndex = 0;
                    break;
            }

            if (goReverse) {
                nextIndex = prevIndex;
            }

            curElt = $focussable.get(nextIndex);
            if (!curElt || curElt === elt) { return true; }

            try {
                curElt.focus();
            } catch(e) { // IE sometimes throws when an element is not visible
                return true;
            }

        } while ($focussable.length > 1 && elt === elt.ownerDocument.activeElement);

        return true;
    }

    function filterKeepSpeciallyFocusable() {
        return this.tabIndex > 0;
    }

    function filterKeepNormalElements() {
        return !this.tabIndex; // true if no tabIndex or tabIndex == 0
    }

    function sortFocusable(a, b) {
        return (a.t - b.t) || (a.i - b.i);
    }

    function getFocusableElementsInContainer(container) {
        var $container = $(container);
        var result = [],
            cnt = 0;

        fixIndexSelector.enable && fixIndexSelector.enable();

        // leaving away command and details for now
        $container.find("a[href], link[href], [draggable=true], [contenteditable=true], :input:enabled, [tabindex=0]")
            .filter(":visible")
            .filter(filterKeepNormalElements)
            .each(function(i, val) {
                result.push({
                    v: val, // value
                    t: 0, // tabIndex
                    i: cnt++ // index for stable sort
                });
            });

        $container
            .find("[tabindex]")
            .filter(":visible")
            .filter(filterKeepSpeciallyFocusable)
            .each(function(i, val) {
                result.push({
                    v: val, // value
                    t: val.tabIndex, // tabIndex
                    i: cnt++ // index
                });
            });

        fixIndexSelector.disable && fixIndexSelector.disable();

        result = $.map(result.sort(sortFocusable), // needs stable sort
            function(val) {
                return val.v;
            }
        );


        return $(result);

    }

    function trap() {
        this.keydown(onkeypress);
        this.data(DATA_ISTRAPPING_KEY, true);
        return this;
    }

    function untrap() {
        this.unbind('keydown', onkeypress);
        this.removeData(DATA_ISTRAPPING_KEY);
        return this;
    }

    function isTrapping() {
        return !!this.data(DATA_ISTRAPPING_KEY);
    }

    $.fn.extend({
        trap: trap,
        untrap: untrap,
        isTrapping: isTrapping
    });

    // jQuery 1.6.x tabindex attr hooks management
    // this triggers problems for tabindex attribute
    // selectors in IE7-
    // see https://github.com/julienw/jquery-trap-input/issues/3

   var fixIndexSelector = {};

   if ($.find.find && $.find.attr !== $.attr) {
        // jQuery uses Sizzle (this is jQuery >= 1.3)
        // sizzle uses its own attribute handling (in jq 1.6.x and below)
       (function() {
            var tabindexKey = "tabindex";
            var sizzleAttrHandle = $.expr.attrHandle;

            // this function comes directly from jQuery 1.7.2 (propHooks.tabIndex.get)
            // we have to put it here if we want to support jQuery < 1.6 which
            // doesn't have an attrHooks object to reference.
            function getTabindexAttr(elem) {
                // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
                // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
                var attributeNode = elem.getAttributeNode(tabindexKey);

                return attributeNode && attributeNode.specified ?
                    parseInt( attributeNode.value, 10 ) :
                    undefined;
            }

            function fixSizzleAttrHook() {
                // in jQ <= 1.6.x, we add to Sizzle the attrHook from jQuery's attr method
                sizzleAttrHandle[tabindexKey] = sizzleAttrHandle.tabIndex = getTabindexAttr;
            }

            function unfixSizzleAttrHook() {
                delete sizzleAttrHandle[tabindexKey];
                delete sizzleAttrHandle.tabIndex;
            }


            fixIndexSelector = {
                enable: fixSizzleAttrHook,
                disable: unfixSizzleAttrHook
            };
        })();
    }
})( jQuery );
/**
 * Copyright 2012, Digital Fusion
 * Licensed under the MIT license.
 * http://teamdf.com/jquery-plugins/license/
 *
 * @author Sam Sehnert
 * @desc A small plugin that checks whether elements are within
 * the user visible viewport of a web browser.
 * only accounts for vertical position, not horizontal.
 *
 * Extended here to include an optional container used as parent,
 * as the original plugin only supports window.
 */

(function ($) {

  $.fn.isVisibleWithin = function (container, partial, hidden) {
      var $t = $(this).eq(0),
          t = $t.get(0),
          $w = (container != null ? container : $(window)),
          viewTop = (container != null ? container.offset().top : $w.scrollTop()),
          viewBottom = viewTop + $w.height(),
          _top = $t.offset().top,
          _bottom = _top + $t.height(),
          compareTop = partial === true ? _bottom : _top,
          compareBottom = partial === true ? _top : _bottom,
          clientSize = hidden === true ? t.offsetWidth * t.offsetHeight : true;
      return !!clientSize && ((compareBottom <= viewBottom) && (compareTop >= viewTop));
  };

})(jQuery);
//-- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2018 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2017 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See docs/COPYRIGHT.rdoc for more details.
//++

(function ($, undefined) {
  "use strict";

  function TopMenu (menu_container) {
    this.menu_container = $(menu_container);
    this.setup(menu_container);
  }

  TopMenu.prototype = $.extend(TopMenu.prototype, {
    setup: function () {
      var self = this;
      this.hover = false;
      this.menuIsOpen = false;
      this.withHeadingFoldOutAtBorder();
      this.setupDropdownHoverAndClick();
      this.registerEventHandlers();
      this.closeOnBodyClick();
      this.accessibility();
    },

    accessibility: function () {
      $(".drop-down > ul").attr("aria-expanded","false");
    },

    toggleClick: function (dropdown) {
      if (this.menuIsOpen) {
        if (this.isOpen(dropdown)) {
          this.closing();
        } else {
          this.open(dropdown);
        }
      } else {
        this.opening();
        this.open(dropdown);
      }
    },

    // somebody opens the menu via click, hover possible afterwards
    opening: function () {
      this.startHover();
      this.menuIsOpen = true;
      this.menu_container.trigger("openedMenu", this.menu_container);
    },

    // the entire menu gets closed, no hover possible afterwards
    closing: function () {
      this.stopHover();
      this.closeAllItems();
      this.menuIsOpen = false;
      this.menu_container.trigger("closedMenu", this.menu_container);
    },

    stopHover: function () {
      this.hover = false;
      this.menu_container.removeClass("hover");
    },

    startHover: function () {
      this.hover = true;
      this.menu_container.addClass("hover");
    },

    closeAllItems: function () {
      var self = this;
      this.openDropdowns().each(function (ix, item) {
        self.close($(item));
      });
    },

    closeOnBodyClick: function () {
      var self = this;
      $('html').click(function() {
        if (self.menuIsOpen) {
          self.closing();
        }
      });
    },

    openDropdowns: function () {
      return this.dropdowns().filter(".open");
    },

    dropdowns: function () {
      return this.menu_container.find("li.drop-down");
    },

    withHeadingFoldOutAtBorder: function () {
      var menu_start_position;
      if (this.menu_container.next().get(0) != undefined && (this.menu_container.next().get(0).tagName == 'H2')){
        menu_start_position = this.menu_container.next().innerHeight() + this.menu_container.next().position().top;
        this.menu_container.find("ul.menu-drop-down-container").css({ top: menu_start_position });
      }
      else if(this.menu_container.next().hasClass("wiki-content") && this.menu_container.next().children().next().first().get(0) != undefined && this.menu_container.next().children().next().first().get(0).tagName == 'H1'){
        var wiki_heading = this.menu_container.next().children().next().first();
        menu_start_position = wiki_heading.innerHeight() + wiki_heading.position().top;
        this.menu_container.find("ul.menu-drop-down-container").css({ top: menu_start_position });
      }
    },

    setupDropdownHoverAndClick: function () {
      var self = this;
      this.dropdowns().each(function (ix, it) {
        $(it).click(function () {
          self.toggleClick($(this));
          return false;
        });
        $(it).hover(function() {
          // only do something if the menu is in hover mode
          // AND the dropdown we hover on is not currently open anyways
          if (self.hover && self.isClosed($(this))) {
            self.open($(this));
          }
        });
        $(it).on('touchstart', function(e) {
          // This shall avoid the hover event is fired,
          // which would otherwise lead to menu being closed directly after its opened.
          // Ignore clicks from within the dropdown
          if ($(e.target).closest('.menu-drop-down-container').length) {
            return true;
          }
          e.preventDefault();
          $(this).click();
          return false;
        });
      });
    },

    isOpen: function (dropdown) {
      return dropdown.filter(".open").length == 1;
    },

    isClosed: function (dropdown) {
      return !this.isOpen(dropdown);
    },

    open: function (dropdown) {
      this.dontCloseWhenUsing(dropdown);
      this.closeOtherItems(dropdown);
      this.slideAndFocus(dropdown, function() {
        dropdown.trigger("opened", dropdown);
      });
    },

    close: function (dropdown, immediate) {
      this.slideUp(dropdown, immediate);
      dropdown.trigger("closed", dropdown);
    },

    closeOtherItems: function (dropdown) {
      var self = this;
      this.openDropdowns().each(function (ix, it) {
        if ($(it) != $(dropdown)) {
          self.close($(it), true);
        }
      });
    },

    dontCloseWhenUsing: function (dropdown) {
      $(dropdown).find("li").click(function (event) {
        event.stopPropagation();
      });
      $(dropdown).bind("mousedown mouseup click", function (event) {
        event.stopPropagation();
      });
    },

    slideAndFocus: function (dropdown, callback) {
      this.slideDown(dropdown, callback);
      this.focusFirstInputOrLink(dropdown);
    },

    slideDown: function (dropdown, callback) {
      var toDrop = dropdown.find("> ul");
      dropdown.addClass("open");
      toDrop.slideDown(animationRate, callback).attr("aria-expanded","true");
    },

    slideUp: function (dropdown, immediate) {
      var toDrop = $(dropdown).find("> ul");
      dropdown.removeClass("open");

      if (immediate) {
        toDrop.hide();
      } else {
        toDrop.slideUp(animationRate);
      }

      toDrop.attr("aria-expanded","false");
    },

    // If there is ANY input, it will have precedence over links,
    // i.e. links will only get focussed, if there is NO input whatsoever
    focusFirstInputOrLink: function (dropdown) {
      var toFocus = dropdown.find("ul :input:visible:first");
      if (toFocus.length == 0) {
        toFocus = dropdown.find("ul a:visible:first");
      }
      // actually a simple focus should be enough.
      // The rest is only there to work around a rendering bug in webkit (as of Oct 2011),
      // occuring mostly inside the login/signup dropdown.
      toFocus.blur();
      setTimeout(function() {
        toFocus.focus();
      }, 10);
    },

    registerEventHandlers: function () {
      var self = this;
      var toggler = $("#main-menu-toggle");

      this.menu_container.on("closeDropDown", function (event) {
        self.close($(event.target));
      }).on("openDropDown", function (event) {
        self.open($(event.target));
      }).on("closeMenu", function () {
        self.closing();
      }).on("openMenu", function () {
        self.open(self.dropdowns().first());
        self.opening();
      });

      toggler.on("click", function() {  // click on hamburger icon is closing other menu
        self.closing();
      });
    }
  });

  // this holds all top menus currently active.
  // if one opens, all others are closed.
  var top_menus = [];
  $.fn.top_menu = function () {
    var new_menu;
    $(this).each(function () {
      new_menu = new TopMenu($(this));
      top_menus.forEach(function (menu) {
        menu.menu_container.on("openedMenu", function () {
          new_menu.closing();
        });
        new_menu.menu_container.on("openedMenu", function () {
          menu.closing();
        });
      });
      top_menus.push(new_menu);
    });
  };

}(jQuery));

function skipMenu() {
  // Skip to the breadcrumb or the first link in the toolbar or the first link in the content (homescreen)
  const selectors = '.first-breadcrumb-element a, .toolbar-container a:first-of-type, #content a:first-of-type';
  const visibleLink = jQuery(selectors)
                        .not(':hidden')
                        .first();

 if (visibleLink.length) {
   visibleLink.focus();
 }
}

jQuery(document).ready(function($) {
  $("#top-menu-items").top_menu();
});
//-- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2018 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2017 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See docs/COPYRIGHT.rdoc for more details.
//++

/*
  The action menu is a menu that usually belongs to an OpenProject entity (like an Issue, WikiPage, Meeting, ..).
  Most likely it looks like this:
    <ul class="action_menu_main">
      <li><a>Menu item text</a></li>
      <li><a>Menu item text</a></li>
      <li class="drop-down">
        <a class="icon icon-more" href="#">More functions</a>
        <ul style="display:none;" class="menu-drop-down-container">
          <li><a>Menu item text</a></li>
        </ul>
      </li>
    </ul>
  The following code is responsible to open and close the "more functions" submenu.
*/


jQuery(function ($) {
  var animationSpeed = 100; // ms

  function menu_top_position(menu) {
    // if an h2 tag follows the submenu should unfold out at the border
    var menu_start_position;
    if (menu.next().get(0) != undefined && (menu.next().get(0).tagName == 'H2')) {
      menu_start_position = menu.next().innerHeight() + menu.next().position().top;
    }
    else if (menu.next().hasClass("wiki-content") && menu.next().children().next().first().get(0) != undefined && menu.next().children().next().first().get(0).tagName == 'H1') {
      var wiki_heading = menu.next().children().next().first();
      menu_start_position = wiki_heading.innerHeight() + wiki_heading.position().top;
    }
    return menu_start_position;
  }

  function close_menu(event) {
    var menu = $(event.data.menu);
    // do not close the menu, if the user accidentally clicked next to a menu item (but still within the menu)
    if (event.target !== menu.find(" > li.drop-down.open > ul").get(0)) {
      menu.find(" > li.drop-down.open").removeClass("open").find("> ul").slideUp(animationSpeed);
      // no need to watch for clicks, when the menu is already closed
      $('html').off('click', close_menu);
    }
  }

  function open_menu(menu) {
    var drop_down = menu.find(" > li.drop-down");
    // do not open a menu, which is already open
    if (!drop_down.hasClass('open')) {
      drop_down.find('> ul').slideDown(animationSpeed, function () {
        drop_down.find('li > a:first').focus();
        // when clicking on something, which is not the menu, close the menu
        $('html').on('click', {menu: menu.get(0)}, close_menu);
      });
      drop_down.addClass('open');
    }
  }

  // open the given submenu when clicking on it
  function install_menu_logic(menu) {
    menu.find(" > li.drop-down").click(function (event) {
      open_menu(menu);
      // and prevent default action (href) for that element
      // but not for the menu items.
      var target = $(event.target);
      if (target.is('.drop-down') || target.closest('li, ul').is('.drop-down')) {
        event.preventDefault();
      }
    });
  }

  $('.project-actions, .legacy-actions-main, .legacy-actions-specific, .toolbar-items').each(function (idx, menu) {
    install_menu_logic($(menu));
  });
});
//-- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2018 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2017 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See docs/COPYRIGHT.rdoc for more details.
//++

jQuery.fn.reverse = [].reverse;
(function($){
  $.fn.adjustBreadcrumbToWindowSize = function(){
    var breadcrumbElements = this.find(' > li');
    var breadcrumb = this;
    var lastChanged;

    if (breadcrumb.breadcrumbOutOfBounds()){
      breadcrumbElements.each(function(index) {
        if (breadcrumb.breadcrumbOutOfBounds()){
          if (!$(this).find(' > a').hasClass('nocut')){
              $(this).addClass('cutme ellipsis');
          }
        }
        else {
          return false;
        }
      });
    }
    else {
      breadcrumbElements.reverse().each(function(index) {
        if (!breadcrumb.breadcrumbOutOfBounds()){
          if (!$(this).find(' > a').hasClass('nocut')){
            $(this).removeClass('cutme ellipsis');
            lastChanged = $(this);
          }
        }
      });

      if (breadcrumb.breadcrumbOutOfBounds()){
        if (lastChanged != undefined){
          lastChanged.addClass('cutme ellipsis');
          return false;
        }
      }
    }
  };

  $.fn.breadcrumbOutOfBounds = function(){
    var lastElement = this.find(' > li').last();
    if (lastElement) {
      var rightCorner = lastElement.width() + lastElement.offset().left;
      var windowSize = jQuery(window).width();

      if ((Math.max(1000,windowSize) - rightCorner) < 10) {
        return true;
      }
      else {
        return false;
      }
    } else {
      return false;
    }
  };
})(jQuery);
//-- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2018 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2017 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See docs/COPYRIGHT.rdoc for more details.
//++

(function( $ ){
  $.fn.nextElementInDom = function(selector, options) {
    return $(this).findElementInDom(selector, $.extend(options, { direction: 'front' }));
  };

  $.fn.previousElementInDom = function(selector, options) {
    return $(this).findElementInDom(selector, $.extend(options, { direction: 'back' }));
  };

  $.fn.findElementInDom = function(selector, options) {
    var defaults, parent, direction, found, children;
    defaults = { stopAt : 'body', direction: 'front' };
    options = $.extend(defaults, options);

    parent = $(this).parent();

    direction = (options.direction === 'front') ? ":gt" : ":lt";
    children = parent.children(direction + "(" + $(this).index() + ")");
    children = (options.direction === 'front') ? children : children.reverse();

    found = parent.children(direction + "(" + $(this).index() + ")").find(selector).filter(":first");

    if (found.length > 0) {
      return found;
    } else {
      if (parent.length === 0 || parent.is(options.stopAt)) {
        return $([]);
      } else {
        return parent.findElementInDom(selector, options);
      }
    }
  };

})( jQuery );


(function($) {
  $(function() {

    $('#settings_session_ttl_enabled').on('change', function(){
      $('#settings_session_ttl_container').toggle($(this).is(':checked'));
    }).trigger('change');


    /** Sync SCM vendor select when enabled SCMs are changed */
    $('[name="settings[enabled_scm][]"]').change(function() {
      var wasDisabled = !this.checked,
        vendor = this.value,
        select = $('#settings_repositories_automatic_managed_vendor'),
        option = select.find('option[value="' + vendor + '"]');

      // Skip non-manageable SCMs
      if (option.length === 0) {
        return;
      }

      option.prop('disabled', wasDisabled);
      if (wasDisabled && option.prop('selected')) {
        select.val('');
      }
    });

    /* Javascript for Settings::TextSettingCell */
    $(".lang-select-switch").change(function() {
      var self = $(this);
      var id = self.attr("id");
      var lang = self.val();

      $("." + id).hide();
      $("#" + id + "-" + lang).show();
    });

    $('.admin-settings--form').submit(function() {
       /* Update consent time if consent required */
       if ($('#settings_consent_required').is(':checked') && $('#toggle_consent_time').is(':checked')) {
           $('#settings_consent_time')
               .val(new Date().toISOString())
               .prop('disabled', false);
       }

      return true;
    });

    /** Toggle notification settings fields */
    $("#email_delivery_method_switch").on("change", function() {
      delivery_method = $(this).val();
      $(".email_delivery_method_settings").hide();
      $("#email_delivery_method_" + delivery_method).show();
    }).trigger("change");

    $('#settings_smtp_authentication').on('change', function() {
      var isNone = $(this).val() === 'none';
      $('#settings_smtp_user_name,#settings_smtp_password')
          .closest('.form--field')
          .toggle(!isNone);
    });

    /** Toggle repository checkout fieldsets required when option is disabled */
    $('.settings-repositories--checkout-toggle').change(function() {
      var wasChecked = this.checked,
        fieldset = $(this).closest('fieldset');

        fieldset
          .find('input,select')
          .filter(':not([type=checkbox])')
          .filter(':not([type=hidden])')
          .removeAttr('required') // Rails 4.0 still seems to use attribute
          .prop('required', wasChecked);
    })

    /** Toggle highlighted attributes visibility depending on if the highlighting mode 'inline' was selected*/
    $('.settings--highlighting-mode select').change(function() {
      var highlightingMode = $(this).val();
      $(".settings--highlighted-attributes").toggle(highlightingMode === "inline")
    })

    /** Initialize hightlighted attributes checkboxes. If none is selected, it means we want them all. So let's
     * show them all as selected.
     * On submitting the form, we remove all checkboxes before sending to communicate, we actually want all and not
     * only the selected.*/
    if ($(".settings--highlighted-attributes input[type='checkbox']:checked").length == 0) {
      $(".settings--highlighted-attributes input[type='checkbox']").prop("checked", true);
    }
    $('#tab-content-work_packages form').submit(function() {
      var availableAttributes = $(".settings--highlighted-attributes input[type='checkbox']");
      var selectedAttributes = $(".settings--highlighted-attributes input[type='checkbox']:checked");
      if (selectedAttributes.length == availableAttributes.length) {
        availableAttributes.prop("checked", false);
      }
    })
  });
}(jQuery));
//-- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2018 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2017 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See docs/COPYRIGHT.rdoc for more details.
//++

/*
  This module is responsible to manage tabed views in OpenProject,
  which you can observe, for example, in the settings page.
  Used by view/common/_tabs.html.erb in inline javascript.
*/

/*
  There are hidden buttons in the common/_tabs.html.erb view,
  which shall allow the user to scrolls through the tab captions.
  Those buttons are only visible if there is not enough room to
  display all tab captions at once.
*/

// Check if there is enough room to display all tab captions
// and show/hide the tabButtons accordingly.
function displayTabsButtons() {
  var lis;
  var tabsWidth = 0;
  var el;
  jQuery('div.tabs').each(function() {
    el = jQuery(this);
    lis = el.find('ul').children();
    lis.each(function(){
      if (jQuery(this).is(':visible')) {
        tabsWidth += jQuery(this).width() + 6;
      }
    });
    if ((tabsWidth < el.width() - 60) && (lis.first().is(':visible'))) {
      el.find('div.tabs-buttons').hide();
    } else {
      el.find('div.tabs-buttons').show();
    }
  });
}

// scroll the tab caption list right
function moveTabRight() {
  var el = jQuery(this);
  var lis = el.parents('div.tabs').first().find('ul').children();
  var tabsWidth = 0;
  var i = 0;
  lis.each(function() {
    if (jQuery(this).is(':visible')) {
      tabsWidth += jQuery(this).width() + 6;
    }
  });
  if (tabsWidth < jQuery(el).parents('div.tabs').first().width() - 60) { return; }
  while (i<lis.length && !lis.eq(i).is(':visible')) { i++; }
  lis.eq(i).hide();
}

// scroll the tab caption list left
function moveTabLeft() {
  var el = jQuery(this);
  var lis = el.parents('div.tabs').first().find('ul').children();
  var i = 0;
  while (i < lis.length && !lis.eq(i).is(':visible')) { i++; }
  if (i > 0) {
    lis.eq(i-1).show();
  }
}

jQuery(function($) {
  if (jQuery('div.tabs').length === 0) {
    return;
  }

  // Show tabs
  displayTabsButtons();
  $(window).resize(function() { displayTabsButtons(); });

  $('.tab-left').click(moveTabLeft);
  $('.tab-right').click(moveTabRight);
});




//-- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2018 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2017 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See docs/COPYRIGHT.rdoc for more details.
//++

(function ($) {
  var applicable,
      register_change_wp_by_status,
      handle_change_wp_by_status,
      init;

  applicable = function () {
    return $('body.controller-versions.action-show').length === 1;
  };

  init = function () {
    register_change_wp_by_status();
  };

  register_change_wp_by_status = function () {
    $('#status_by_select').change(function () {
      handle_change_wp_by_status();

      return false;
    });
  };

  handle_change_wp_by_status = function () {
    var form = $('#status_by_form'),
        url = form.attr('action'),
        data = form.serialize();

    $.ajax({ url: url,
             headers: { Accept: 'text/javascript' },
             dataType: 'html',
             data: data,
             complete: function (jqXHR) {
                          form.replaceWith(jqXHR.responseText);
                          register_change_wp_by_status();
                        }
               });
  };

  $('document').ready(function () {
    if (applicable()) {
      init();
    }
  });
})(jQuery);
//-- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2018 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2017 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See docs/COPYRIGHT.rdoc for more details.
//++

(function($) {
  jQuery(function() {

    function quoteResult(result) {
      var reply = $("#reply"),
        subject = $("#reply_subject"),
        focusElement = jQuery("#reply #message-form");

      subject.val(result.subject);

      $('ckeditor-augmented-textarea op-ckeditor')
        .data('editor')
        .then(function(editor) {
          editor.setData(result.content);
        });

      reply.slideDown();

      $('html, body').animate({
        scrollTop: focusElement.offset().top
      }, 1000);
    }

    $('.boards--quote-button').click(function(evt) {
      var link = $(this);

      $.getJSON(link.attr('href'))
        .done(quoteResult);

      evt.preventDefault();
      return false;
    });
  });

}(jQuery))
;


function initMainMenuExpandStatus() {
  var wrapper = jQuery('#wrapper')

  var upToggle = jQuery('ul.menu_root.closed li.open a.arrow-left-to-project');
  if (upToggle.length == 1 && wrapper.hasClass('hidden-navigation')) {
    upToggle.trigger('click');
  }
}

jQuery(document).ready(function($) {
  // rejigger the main-menu sub-menu functionality.
  $("#main-menu .toggler").remove(); // remove the togglers so they're inserted properly later.

  $.fn.mySlide = function (callback) {
    this.slideToggle(animationRate, callback);

    return this;
  };

  var toggler = $('<a class="toggler" href="#"><i class="icon6 icon-toggler icon-arrow-right3" aria-hidden="true"></i><span class="hidden-for-sighted"></span></a>')
    .click(function() {
      var target = $(this);
      if (target.hasClass('toggler')) {

        // TODO: Instead of hiding the sidebar move sidebar's contents to submenus and cache it.
        $('#sidebar').toggleClass('-hidden', true);

        $(".menu_root li").removeClass('open')
        $(".menu_root").removeClass('open').addClass('closed');
        target.closest('li').addClass('open');
        target.closest('li').find('li > a:first, .tree-menu--title:first').first().focus();
      }
      return false;
    });
    toggler.attr('title', I18n.t('js.project_menu_details'));

  // wrap main items
  var mainItems = $('#main-menu li > a').not('ul ul a');

  function getMainItemWrapper(index) {
    var item = mainItems[index];
    var elementId = item.id;

    var wrapperElement = $('<div class="main-item-wrapper"/>')

    // inherit element id
    if(elementId) {
      wrapperElement.attr('id', elementId + '-wrapper')
    }

    return wrapperElement;
  }

  mainItems.wrap(getMainItemWrapper)

  $('#main-menu li:has(ul) .main-item-wrapper > a').not('ul ul a')
    // 1. unbind the current click functions
    .unbind('click')
    // 2. wrap each in a span that we'll use for the new click element
    .wrapInner('<span class="ellipsis"/>')
    // 3. reinsert the <span class="toggler"> so that it sits outside of the above
    .after(toggler);

  function navigateUp(event) {
    event.preventDefault();
    var target = $(this);
    $(target).parents('li').first().removeClass('open');
    $(".menu_root").removeClass('closed').addClass('open');

    target.parents('li').first().find('.toggler').first().focus();

    // TODO: Instead of hiding the sidebar move sidebar's contents to submenus and cache it.
    $('#sidebar').toggleClass('-hidden', false);
  }

  $('#main-menu ul.main-menu--children').each(function(_i, child){
    var title = $(child).parents('li').find('.main-item-wrapper .menu-item--title').text();
    var parentURL = $(child).parents('li').find('.main-item-wrapper > a')[0].href;
    var header = $('<div class="main-menu--children-menu-header"></div>');
    var upLink = $('<a class="main-menu--arrow-left-to-project" href="#"><i class="icon-arrow-left1" aria-hidden="true"></i></a>');
    var parentLink = $('<a href="' + parentURL + '" class="main-menu--parent-node ellipsis">' + title + '</a>');
    upLink.attr('title', I18n.t('js.label_up'));
    upLink.click(navigateUp);
    header.append(upLink);
    header.append(parentLink);
    $(child).before(header);
  })

  if($('.menu_root').hasClass('closed')) {
      // TODO: Instead of hiding the sidebar move sidebar's contents to submenus and cache it.
      $('#sidebar').toggleClass('-hidden', true);
  }
});
//-- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2018 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2017 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See docs/COPYRIGHT.rdoc for more details.
//++

function createFieldsetToggleStateLabel(legend, text) {
  var labelClass = 'fieldset-toggle-state-label';
  var toggleLabel = legend.find('a span.' + labelClass);
  var legendLink = legend.children('a');

  if (toggleLabel.length === 0) {
    toggleLabel = jQuery("<span />").addClass(labelClass)
      .addClass("hidden-for-sighted");

    legendLink.append(toggleLabel);
  }

  toggleLabel.text(' ' + text);
}

function setFieldsetToggleState(fieldset) {
  var legend = fieldset.children('legend');


  if (fieldset.hasClass('collapsed')) {
    createFieldsetToggleStateLabel(legend, I18n.t('js.label_collapsed'));
  } else {
    createFieldsetToggleStateLabel(legend, I18n.t('js.label_expanded'));
  }
}

function getFieldset(el) {
  var element = jQuery(el);

  if (element.is('legend')) {
    return jQuery(el).parent();
  } else if (element.is('fieldset')) {
    return element;
  }

  throw "Cannot derive fieldset from element!";
}

function toggleFieldset(el) {
  var fieldset = getFieldset(el);
  var contentArea = fieldset.find('> div').not('.form--fieldset-control');

  fieldset.toggleClass('collapsed');
  contentArea.slideToggle('fast', null);

  setFieldsetToggleState(fieldset);
}

jQuery(document).ready(function() {
  const fieldsets = jQuery('fieldset.form--fieldset.-collapsible');

  // Toggle on click
  fieldsets.on('click', '.form--fieldset-legend', function(evt) {
    toggleFieldset(this);
    evt.preventDefault();
    evt.stopPropagation();
    return false;
  });

  // Set initial state
  fieldsets
    .each(function() {
      var fieldset = getFieldset(this);

      var contentArea = fieldset.find('> div');
      if (fieldset.hasClass('collapsed')) {
        contentArea.hide();
      }

      setFieldsetToggleState(fieldset);
    });
});
//-- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2018 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2017 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See docs/COPYRIGHT.rdoc for more details.
//++

function findFilter() {
  var filter =  jQuery('.simple-filters--container');

  // Find the filter elements on the page
  if(filter.length === 0)
    filter = jQuery('.advanced-filters--container');
  else if(filter.length === 0)
     filter = nil;

  return filter;
}

function hideFilter(filter) {
  filter.addClass('collapsed');
}

function showFilter(filter) {
  filter.removeClass('collapsed');
}
;
//-- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2018 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2017 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See docs/COPYRIGHT.rdoc for more details.
//++
(function(window, $) {
  /*
   * @see /app/views/custom_fields/_form.html.erb
   */
  $(function() {
    var customFieldForm = $('#custom_field_form');

    if (customFieldForm.length === 0) {
      return;
    }

    // collect the nodes involved
    var format                = $('#custom_field_field_format'),
        lengthField           = $('#custom_field_length'),
        regexpField           = $('#custom_field_regexp'),
        multiSelect           = $('#custom_field_multi_select'),
        possibleValues        = $('#custom_field_possible_values_attributes'),
        defaultValueFields    = $('#custom_field_default_value_attributes'),
        spanDefaultText       = $('#default_value_text'),
        spanDefaultBool       = $('#default_value_bool');

    var deactivate = function(element) {
      element.hide().find('input, textarea').not('.destroy_flag,.-cf-ignore-disabled').attr('disabled', true);
    },
    activate = function(element) {
      element.show().find('input, textarea').not('.destroy_flag,.-cf-ignore-disabled').removeAttr('disabled');
    },
    toggleVisibility = function(method, args) {
      var fields = Array.prototype.slice.call(args);
      $.each(fields, function(idx, field) {
        field.closest('.form--field, .form--grouping')[method]();
      });
    },
    hide = function() { toggleVisibility('hide', arguments); },
    show = function() { toggleVisibility('show', arguments); },
    toggleFormat = function() {
      var searchable   = $('#searchable_container'),
          unsearchable = function() { searchable.attr('checked', false).hide(); };

      // defaults (reset these fields before doing anything else)
      $.each([spanDefaultBool, spanDefaultText, multiSelect], function(idx, element) {
        deactivate(element);
      });
      show(defaultValueFields);
      activate(spanDefaultText);

      switch (format.val()) {
        case 'list':
          deactivate(defaultValueFields);
          hide(lengthField, regexpField, defaultValueFields);
          show(searchable, multiSelect);
          activate(multiSelect);
          activate(possibleValues);
          break;
        case 'bool':
          activate(spanDefaultBool);
          deactivate(spanDefaultText);
          deactivate(possibleValues);
          hide(lengthField, regexpField, searchable);
          unsearchable();
          break;
        case 'date':
          deactivate(defaultValueFields);
          deactivate(possibleValues);
          hide(lengthField, regexpField, defaultValueFields);
          unsearchable();
          break;
        case 'float':
        case 'int':
          deactivate(possibleValues);
          show(lengthField, regexpField);
          unsearchable();
          break;
        case 'user':
          show(multiSelect);
          activate(multiSelect);
        case 'version':
          deactivate(defaultValueFields);
          deactivate(possibleValues);
          hide(lengthField, regexpField, defaultValueFields);
          unsearchable();
          break;
        default:
          show(lengthField, regexpField, searchable);
          deactivate(possibleValues);
          break;
      }
    };

    // assign the switch format function to the select field
    format.on('change', toggleFormat).trigger('change');
  });

  $(function() {
    var localeSelectors = $('.locale_selector');

    localeSelectors.change(function () {
      var lang = $(this).val(),
          span = $(this).closest('.translation');
      span.attr('lang', lang);
    }).trigger('change');
  });

  var moveUpRow = function() {
    var row = $(this).closest("tr");
    var above = row.prev("tr");

    above.before(row);

    return false;
  };

  var moveDownRow = function() {
    var row = $(this).closest("tr");
    var after = row.next("tr");

    after.after(row);

    return false;
  };

  var moveRowToTheTop = function() {
    var row = $(this).closest("tr");
    var first = jQuery(row.siblings()[0]);

    first.before(row);

    return false;
  };

  var moveRowToTheBottom = function() {
    var row = $(this).closest("tr");
    var last = jQuery(row.siblings().last()[0]);

    last.after(row);

    return false;
  };

  var removeOption = function() {
    var self = $(this);
    if (self.attr("href") === "#" || self.attr("href").endsWith("/0")) {
      var row = self.closest("tr");

      if (row.siblings().length > 1) {
        row.remove();
      }

      return false; // just remove new element
    } else {
      return true; // send off deletion
    }
  };

  var duplicateRow = function() {
    var count = $("#custom-options-table tr.custom-option-row").length;
    var row = $("#custom-options-table tr.custom-option-row:last");
    var dup = row.clone();

    var value = dup.find(".custom-option-value input");

    value.attr("name", "custom_field[custom_options_attributes][" + count + "][value]");
    value.attr("id", "custom_field_custom_options_attributes_" + count + "_value");
    value.val("");

    var defaultValue = dup.find(".custom-option-default-value");

    defaultValue.attr("name", "custom_field[custom_options_attributes][" + count + "][default_value]");
    defaultValue.prop("checked", false);

    dup.find(".custom-option-id").remove()

    dup.find(".move-up-custom-option").click(moveUpRow);
    dup.find(".sort-up-custom-option").click(moveRowToTheTop);
    dup.find(".sort-down-custom-option").click(moveRowToTheBottom);
    dup.find(".move-down-custom-option").click(moveDownRow);
    dup.find(".custom-option-default-value").change(uncheckOtherDefaults);

    dup
      .find(".delete-custom-option")
      .attr("href", "#")
      .click(removeOption);

    row.after(dup);

    return false;
  };

  var uncheckOtherDefaults = function() {
    var cb = $(this);

    if (cb.prop("checked")) {
      var multi = $('#custom_field_multi_value');

      if (!multi.prop("checked")) {
        $(".custom-option-default-value").each(function(i, other) {
          $(other).prop("checked", false);
        });

        cb.prop("checked", true);
      }
    }
  };

  var checkOnlyOne = function() {
    var cb = $(this);

    if (!cb.prop("checked")) {
      $(".custom-option-default-value:checked").slice(1).each(function(i, other) {
        $(other).prop("checked", false);
      });
    }
  };

  $(document).ready(function() {
    $("#add-custom-option").click(duplicateRow);
    $(".delete-custom-option").click(removeOption);

    $(".move-up-custom-option").click(moveUpRow);
    $(".move-down-custom-option").click(moveDownRow);

    $(".sort-up-custom-option").click(moveRowToTheTop);
    $(".sort-down-custom-option").click(moveRowToTheBottom);

    $(".custom-option-default-value").change(uncheckOtherDefaults);
    $('#custom_field_multi_value').change(checkOnlyOne);

    // Make custom fields draggable
    var container = document.getElementById('custom-field-dragula-container');
    dragula([container], {
      isContainer: function (el) {
        return false;
      },
      moves: function (el, source, handle, sibling) {
        return $(handle).hasClass('dragula-handle');
      },
      accepts: function (el, target, source, sibling) {
        return true;
      },
      invalid: function (el, handle) {
        return false;
      },
      direction: 'vertical',
      copy: false,
      copySortSource: false,
      revertOnSpill: true,
      removeOnSpill: false,
      mirrorContainer: container,
      ignoreInputTextSelection: true
    });
  });
}(window, jQuery));
//-- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2018 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2017 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See docs/COPYRIGHT.rdoc for more details.
//++
(function($) {
  $(function() {
    /*
     * See /app/views/timelog/_date_range.html.erb
     */
    if ($('#date-range').length < 1) {
      return;
    }
    var intervalInputs = $('#to, #from'),
        // select
        period = $('#period'),
        // radio buttons
        periodOptionList = $('#period_type_list'),
        periodOptionInterval = $('#period_type_interval');

    var disableInputFields = function(radioButton) {
      return function () {
        if (radioButton == periodOptionList) {
          jQuery('#period').attr("tabindex", -1);
          jQuery('#from').removeAttr("tabindex");
          jQuery('#to').removeAttr("tabindex");
        }
        else {
          jQuery('#from').attr("tabindex", -1);
          jQuery('#to').attr("tabindex", -1);
          jQuery('#period').removeAttr("tabindex");
        }
      };
    };

    jQuery(document).ready(function() {
      if (periodOptionInterval.is(':checked')) {
        jQuery('#period').attr("tabindex", -1);
      }
      else {
        jQuery('#from').attr("tabindex", -1);
        jQuery('#to').attr("tabindex", -1);
      }
    });

    periodOptionList.on('change', disableInputFields(periodOptionInterval));
    periodOptionInterval.on('change', disableInputFields(periodOptionList));

  });
}(jQuery));
//-- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2018 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2017 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See docs/COPYRIGHT.rdoc for more details.
//++

(function($) {
  $(function() {
    /*
     * @see /app/views/search/index.html.erb
     */
    if ($('#search-filter').length < 1) {
      return;
    }

    $('#search-input').focus();

  });
}(jQuery));
//-- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2018 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2017 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See docs/COPYRIGHT.rdoc for more details.
//++

(function ($) {
  $(function() {
    $('.color--preview').each(function() {
      var preview, input, func, target;

      preview = $(this);
      target  = preview.data('target');
      if(target) {
        input = $(target);
      } else {
        input = preview.next('input');
      }

      if (input.length === 0) {
        return;
      }

      func = function () {
        var previewColor = '';

        if(input.val() && input.val().length > 0) {
          previewColor = input.val();
        } else if (input.attr('placeholder') &&
                   input.attr('placeholder').length > 0) {
          previewColor = input.attr('placeholder')
        }

        preview.css('background-color', previewColor);
      };

      input.keyup(func).change(func).focus(func);
      func();
    });
  });
}(jQuery));
jQuery(function($) {
  var tooltipTriggers = $('.advanced-tooltip-trigger');
  tooltipTriggers.each(function (index, el) {
    var tooltip = $("#" + $(el).attr('aria-describedby'));

    $(el).bind('mouseover focus', function () {
      var top = $(this).offset().top - $(window).scrollTop();
      // Adjust top for small elements
        var POINTER_HEIGHT = 16.5;
        var middle = $(this).outerHeight() / 2;
        if (middle < POINTER_HEIGHT) top -= POINTER_HEIGHT - middle;

      // On the left side of the element + 5px Distance
      var left = $(this).offset().left + $(this).width() + 5;

      tooltip.css({'opacity': 1, 'visibility': 'visible', 'top': top, 'left': left});
    }).bind('mouseout focusout', function () {
      tooltip.css({'opacity': 0, 'visibility': 'hidden'});
    });
  });
});
//-- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2018 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2017 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See docs/COPYRIGHT.rdoc for more details.
//++

(function($) {
    $(function() {
        // This will only work iff there is a single danger zone on the page
        var dangerZoneVerification = $('.danger-zone--verification');
        var expectedValue = $('.danger-zone--expected-value').text();

        dangerZoneVerification.find('input').on('input', function(){
            var actualValue = dangerZoneVerification.find('input').val();
            if (expectedValue.toLowerCase() === actualValue.toLowerCase()) {
                dangerZoneVerification.find('button').prop('disabled', false);
            } else {
                dangerZoneVerification.find('button').prop('disabled', true);
            }
        });
    });
}(jQuery));
//-- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2018 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2017 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See docs/COPYRIGHT.rdoc for more details.
//++

jQuery(document).ready(function($) {
  $('body').on('click keydown touchend', '.close-handler,.notification-box--close', function (e) {
    if (e.type == 'click' || e.keyCode == 13) {
      $(this).parent('.flash, .errorExplanation, .notification-box').remove();
    }
  });

  autoHideFlashMessage();

});

function autoHideFlashMessage() {
  setTimeout(function() {
    jQuery('.flash.autohide-notification').remove();
  }, 5000);
}
;
(function ($) {
    $(function() {
        window.scrumBacklogsTourSteps = [
            {
                'next #content-wrapper': I18n.t('js.onboarding.steps.backlogs_overview'),
                'showSkip': false,
                'containerClass': '-dark -hidden-arrow'
            },
            {
                'event_type': 'next',
                'selector': '#sprint_backlogs_container .backlog .menu-trigger',
                'description': I18n.t('js.onboarding.steps.backlogs_task_board_arrow'),
                'showSkip': false,
                onNext: function () {
                    $('#sprint_backlogs_container .backlog .menu-trigger')[0].click();
                }
            },
            {
                'event_type': 'next',
                'selector': '#sprint_backlogs_container .backlog .menu .items',
                'description': I18n.t('js.onboarding.steps.backlogs_task_board_select'),
                'showSkip': false,
                'containerClass': '-dark',
                onNext: function () {
                    $('#sprint_backlogs_container .backlog .show_task_board')[0].click();
                }
            }
        ];

        window.scrumTaskBoardTourSteps = [
            {
                'next #content-wrapper': I18n.t('js.onboarding.steps.backlogs_task_board'),
                'showSkip': false,
                'containerClass': '-dark -hidden-arrow'
            },
            {
                'next #main-menu-work-packages-wrapper': I18n.t('js.onboarding.steps.wp_toggler'),
                'showSkip': false,
                onNext: function () {
                    $('#main-menu-work-packages')[0].click();
                }
            },
        ];
    });
}(jQuery))
;
(function ($) {
    $(function() {
        window.homescreenOnboardingTourSteps = [
            {
                'next #top-menu': I18n.t('js.onboarding.steps.welcome'),
                'skipButton': {className: 'enjoyhint_btn-transparent'},
                'containerClass': '-hidden-arrow'
            },
            {
                'description': I18n.t('js.onboarding.steps.project_selection'),
                'selector': '.widget-box.welcome',
                'event': 'custom',
                'showSkip': false,
                'containerClass': '-dark -hidden-arrow',
                'containerClass': '-dark -hidden-arrow',
                'clickable': true,
                onBeforeStart: function () {
                    // Handle the correct project selection and redirection
                    // This will be removed once the project selection is implemented
                    jQuery(".widget-box.welcome a:contains(" + scrumDemoProjectName + ")").click(function () {
                        tutorialInstance.trigger('next');
                        window.location = this.href + '/backlogs/?start_scrum_onboarding_tour=true';
                    });
                    jQuery(".widget-box.welcome a:contains(" + demoProjectName + ")").click(function () {
                        tutorialInstance.trigger('next');
                        window.location = this.href + '/work_packages/?start_onboarding_tour=true';
                    });
                    // Disable clicks on other links
                    $('.widget-box.welcome a').addClass('-disabled').bind('click', preventClickHandler);
                }
            }
        ];
    });
}(jQuery))
;
(function ($) {
    $(function() {
        // ------------------------------- Global -------------------------------
        window.tutorialInstance;
        window.preventClickHandler = function (e) {
            e.preventDefault();
            e.stopPropagation();
        };
        window.waitForElement = function(element, container, execFunction) {
            // Wait for the element to be ready
            var observer = new MutationObserver(function (mutations, observerInstance) {
                if ($(element).length) {
                    observerInstance.disconnect(); // stop observing
                    execFunction();
                    return;
                }
            });
            observer.observe($(container)[0], {
                childList: true,
                subtree: true
            });
        };
        window.demoProjectName = 'Demo project';
        window.scrumDemoProjectName = 'Scrum project';

        var storageKey = 'openProject-onboardingTour';
        var currentTourPart = sessionStorage.getItem(storageKey);
        var url = new URL(window.location.href);

        // ------------------------------- Initial start -------------------------------
        // Do not show the tutorial on mobile or when the demo data has been deleted
        if(!(bowser.mobile || bowser.ios || bowser.android) && $('meta[name=demo_projects_available]').attr('content') == "true") {

            // Start after the intro modal (language selection)
            // This has to be changed once the project selection is implemented
            if (url.searchParams.get("first_time_user") && demoProjectsLinks().length == 2) {
                currentTourPart = '';
                sessionStorage.setItem(storageKey, 'readyToStart');

                // Start automatically when the language selection is closed
                $('.op-modal--modal-close-button').click(function () {
                    homescreenTour();
                });
            }

            // ------------------------------- Tutorial Homescreen page -------------------------------
            if (currentTourPart === "readyToStart") {
                homescreenTour();
            }

            // ------------------------------- Tutorial WP page -------------------------------
            if (currentTourPart === "startWpTour" || url.searchParams.get("start_onboarding_tour")) {
                workPackageTour();
            }

            // ------------------------------- Tutorial Backlogs page -------------------------------
            if (url.searchParams.get("start_scrum_onboarding_tour")) {
                if ($('.backlogs-menu-item').length > 0) {
                    backlogsTour();
                }
            }

            // ------------------------------- Tutorial Task Board page -------------------------------
            if (currentTourPart === "startTaskBoardTour") {
                taskboardTour();
            }
        }

        function demoProjectsLinks() {
            demoProjects = [];
            demoProjectsLink = jQuery(".widget-box.welcome a:contains(" + demoProjectName + ")");
            scrumDemoProjectsLink = jQuery(".widget-box.welcome a:contains(" + scrumDemoProjectName + ")");
            if (demoProjectsLink.length) demoProjects.push(demoProjectsLink);
            if (scrumDemoProjectsLink.length) demoProjects.push(scrumDemoProjectsLink);

            return demoProjects;
        }
        
        function initializeTour(storageValue, disabledElements, projectSelection) {
            tutorialInstance = new EnjoyHint({
                onStart: function () {
                    $('#content-wrapper, #menu-sidebar').addClass('-hidden-overflow');
                },
                onEnd: function () {
                    sessionStorage.setItem(storageKey, storageValue);
                    $('#content-wrapper, #menu-sidebar').removeClass('-hidden-overflow');
                },
                onSkip: function () {
                    sessionStorage.setItem(storageKey, 'skipped');
                    if (disabledElements) jQuery(disabledElements).removeClass('-disabled').unbind('click', preventClickHandler);
                    if (projectSelection) $.each(demoProjectsLinks(), function(i, e) { $(e).off('click')});
                    $('#content-wrapper, #menu-sidebar').removeClass('-hidden-overflow');
                }
            });
        }

        function startTour(steps) {
            tutorialInstance.set(steps);
            tutorialInstance.run();
        }
        
        function homescreenTour() {
            initializeTour('startProjectTour', '.widget-box--blocks--buttons a', true);
            startTour(homescreenOnboardingTourSteps);
        }

        function backlogsTour() {
            initializeTour('startTaskBoardTour');
            startTour(scrumBacklogsTourSteps);
        }

        function taskboardTour() {
            initializeTour('startWpTour');
            startTour(scrumTaskBoardTourSteps);
        }

        function workPackageTour() {
            initializeTour('wpFinished');

            waitForElement('.work-package--results-tbody', '.work-packages-split-view--tabletimeline-side', function() {
                startTour(wpOnboardingTourSteps);
            });
        }
    });
}(jQuery));
(function ($) {
    $(function() {
        window.wpOnboardingTourSteps = [
            {
                'next .wp-table--row': I18n.t('js.onboarding.steps.wp_list'),
                'showSkip': false,
                onNext: function () {
                    $(".wp-table--cell-span.id a ")[0].click();
                }
            },
            {
                'next .work-packages-full-view--split-left': I18n.t('js.onboarding.steps.wp_full_view'),
                'showSkip': false,
                'containerClass': '-dark -hidden-arrow'
            },
            {
                'next .work-packages-list-view-button': I18n.t('js.onboarding.steps.wp_back_button'),
                'showSkip': false,
                onNext: function () {
                    $('.work-packages-list-view-button')[0].click();
                }
            },
            {
                'next .add-work-package': I18n.t('js.onboarding.steps.wp_create_button'),
                'showSkip': false,
                'shape': 'circle'
            },
            {
                'next .timeline-toolbar--button': I18n.t('js.onboarding.steps.wp_timeline_button'),
                'showSkip': false,
                'shape': 'circle',
                onNext: function () {
                    $('.timeline-toolbar--button')[0].click();
                }
            },
            {
                'next .work-packages-tabletimeline--timeline-side': I18n.t('js.onboarding.steps.wp_timeline'),
                'showSkip': false,
                'containerClass': '-dark -hidden-arrow'
            },
            {
                'next .main-menu--arrow-left-to-project': I18n.t('js.onboarding.steps.sidebar_arrow'),
                'showSkip': false,
                onNext: function () {
                    $('.main-menu--arrow-left-to-project')[0].click();
                }
            },
            {
                'next .members-menu-item': I18n.t('js.onboarding.steps.members'),
                'showSkip': false
            },
            {
                'next .wiki-menu--main-item': I18n.t('js.onboarding.steps.wiki'),
                'showSkip': false
            },
            {
                'next .menu-item--help': I18n.t('js.onboarding.steps.help_menu'),
                'shape': 'circle',
                'nextButton': {text: I18n.t('js.onboarding.steps.got_it')},
                'showSkip': false
            }
        ];
    });
}(jQuery))
;
//-- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2015 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2013 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See doc/COPYRIGHT.rdoc for more details.
//++



























function checkAll(selector, checked) {
  jQuery('#' + selector + ' input:checkbox').not(':disabled').each(function() {
    this.checked = checked;
  });
}

function toggleCheckboxesBySelector(selector) {
  boxes = jQuery(selector);
  var all_checked = true;
  for (i = 0; i < boxes.length; i++) { if (boxes[i].checked === false) { all_checked = false; } }
  for (i = 0; i < boxes.length; i++) { boxes[i].checked = !all_checked; }
}

function setCheckboxesBySelector(checked, selector) {
  var boxes = $(selector);
  boxes.each(function(ele) {
    ele.checked = checked;
  });
}

var fileFieldCount = 1;

function addFileField() {
  fileFieldCount++;
  if (fileFieldCount >= 10) return false;
  var clone = jQuery('#attachment_template').clone(true);
  clone.removeAttr('id');
  clone.html(clone.html().replace(/\[1\]/g, '['+ fileFieldCount + ']'));
  jQuery('#attachments_fields').append(clone);
}

function randomKey(size) {
  var chars = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z');
  var key = '';
  for (i = 0; i < size; i++) {
    key += chars[Math.floor(Math.random() * chars.length)];
  }
  return key;
}

// Automatic project identifier generation
var projectIdentifierLocked;
var projectIdentifierDefault;
var projectIdentifierMaxLength;

function generateProjectIdentifier() {
  var identifier = jQuery('#project_name').val(); // project name
  var diacriticsMap = [
      {'base':'a', 'letters':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},
      {'base':'aa','letters':/[\uA733\uA732]/g},
      {'base':'ae','letters':/[\u00E4\u00E6\u01FD\u01E3\u00C4\u00C6\u01FC\u01E2]/g},
      {'base':'ao','letters':/[\uA735\uA734]/g},
      {'base':'au','letters':/[\uA737\uA736]/g},
      {'base':'av','letters':/[\uA739\uA73B\uA738\uA73A]/g},
      {'base':'ay','letters':/[\uA73D\uA73C]/g},
      {'base':'b', 'letters':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
      {'base':'c', 'letters':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
      {'base':'d', 'letters':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},
      {'base':'dz','letters':/[\u01F3\u01C6\u01F1\u01C4\u01F2\u01C5]/g},
      {'base':'e', 'letters':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},
      {'base':'f', 'letters':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
      {'base':'g', 'letters':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},
      {'base':'h', 'letters':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},
      {'base':'hv','letters':/[\u0195]/g},
      {'base':'i', 'letters':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},
      {'base':'j', 'letters':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249\u004A\u24BF\uFF2A\u0134\u0248]/g},
      {'base':'k', 'letters':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},
      {'base':'l', 'letters':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},
      {'base':'lj','letters':/[\u01C9\u01C7\u01C8]/g},
      {'base':'m', 'letters':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
      {'base':'n', 'letters':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},
      {'base':'nj','letters':/[\u01CC\u01CA\u01CB]/g},
      {'base':'o', 'letters':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},
      {'base':'oe','letters': /[\u00F6\u0153\u00D6\u0152]/g},
      {'base':'oi','letters':/[\u01A3\u01A2]/g},
      {'base':'ou','letters':/[\u0223\u0222]/g},
      {'base':'oo','letters':/[\uA74F\uA74E]/g},
      {'base':'p','letters':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
      {'base':'q','letters':/[\u0071\u24E0\uFF51\u024B\uA757\uA759\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
      {'base':'r','letters':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},
      {'base':'s','letters':/[\u0073\u24E2\uFF53\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},
      {'base':'ss','letters':/[\u00DF]/g},
      {'base':'t','letters':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},
      {'base':'tz','letters':/[\uA729\uA728]/g},
      {'base':'u','letters':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},
      {'base':'ue','letters':/[\u00FC\u00DC]/g},
      {'base':'v','letters':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
      {'base':'vy','letters':/[\uA761\uA760]/g},
      {'base':'w','letters':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
      {'base':'x','letters':/[\u0078\u24E7\uFF58\u1E8B\u1E8D\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
      {'base':'y','letters':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g},
      {'base':'z','letters':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g}
  ];

  for(var i=0; i<diacriticsMap.length; i++) {
    identifier = identifier.replace(diacriticsMap[i].letters, diacriticsMap[i].base);
  }
  identifier = identifier.replace(/[^a-z0-9]+/gi, '-'); // remaining non-alphanumeric => hyphen
  identifier = identifier.replace(/^[-\d]*|-*$/g, ''); // remove hyphens and numbers at beginning and hyphens at end
  identifier = identifier.toLowerCase(); // to lower
  identifier = identifier.substr(0,projectIdentifierMaxLength); // max characters
  return identifier;
}

function observeProjectName() {
  jQuery('#project_name').keyup(function() {
    if(!projectIdentifierLocked) {
      jQuery('#project_identifier').val(generateProjectIdentifier());
    }
  });
}

function observeProjectIdentifier() {
  jQuery('#project_identifier').keyup(function() {
    if(jQuery('#project_identifier').getValue() !== '' &&
       jQuery('#project_identifier').getValue() != generateProjectIdentifier()) {
      projectIdentifierLocked = true;
    } else {
      projectIdentifierLocked = false;
    }
  });
}

function hideOnLoad() {
  jQuery('.hol').hide();
}
jQuery(hideOnLoad);

function addClickEventToAllErrorMessages() {
  jQuery('a.afocus').each(function() {
    var target = jQuery(this);
    target.click(function(evt) {
      var field = jQuery('#' + target.readAttribute('href').substr(1));
      if (field === null) {
        // Cut off '_id' (necessary for select boxes)
        field = jQuery('#' + target.readAttribute('href').substr(1).concat('_id'));
      }
      if (field) {
        field.down('input, textarea, select').focus();
      }
      target.unbind(evt);
      return false;
    });
  });
}

// a few constants for animations speeds, etc.
var animationRate = 100;

/* jQuery code from #263 */
// returns viewport height
jQuery.viewportHeight = function() {
     return self.innerHeight ||
        jQuery.boxModel && document.documentElement.clientHeight ||
        document.body.clientHeight;
};


/*
* 1 - registers a callback which copies the csrf token into the
* X-CSRF-Token header with each ajax request.  Necessary to
* work with rails applications which have fixed
* CVE-2011-0447
* 2 - shows and hides ajax indicator
*/
jQuery(document).ready(function($) {
  jQuery(document).ajaxSend(function (event, request) {
    if ($(event.target.activeElement).closest('[ajax-indicated]').length &&
        $('ajax-indicator')) {
      $('#ajax-indicator').show();
    }

    var csrf_meta_tag = $('meta[name=csrf-token]');

    if (csrf_meta_tag) {
      var header = 'X-CSRF-Token',
      token = csrf_meta_tag.attr('content');

      request.setRequestHeader(header, token);
    }

    request.setRequestHeader('X-Authentication-Scheme', "Session");
  });

  // ajaxStop gets called when ALL Requests finish, so we won't need a counter as in PT
  jQuery(document).ajaxStop(function () {
    if ($('#ajax-indicator')) {
      $('#ajax-indicator').hide();
    }
    addClickEventToAllErrorMessages();
  });

  // show/hide the files table
  jQuery(".attachments h4").click(function() {
    jQuery(this).toggleClass("closed").next().slideToggle(animationRate);
  });

  jQuery(window).resize(function() {
      // wait 200 milliseconds for no further resize event
      // then readjust breadcrumb

      if(this.resizeTO) clearTimeout(this.resizeTO);
      this.resizeTO = setTimeout(function() {
          jQuery(this).trigger('resizeEnd');
      }, 200);
  });

  // Do not close the login window when using it
  jQuery('#nav-login-content').click(function(event){
    event.stopPropagation();
  });

  // Set focus on first error message
  var error_focus = $('a.afocus').first();
  var input_focus = $('.autofocus').first();
  if (error_focus !== undefined) {
    error_focus.focus();
  }
  else if (input_focus !== undefined){
    input_focus.focus();
    if (input_focus.tagName === "INPUT") {
      input_focus.select();
    }
  }
  // Focus on field with error
  addClickEventToAllErrorMessages();

  // Skip menu on content
  jQuery('#skip-navigation--content').click(skipMenu);

  // Click handler for formatting help
  jQuery(document.body).on('click', '.formatting-help-link-button', function() {
    window.open(window.appBasePath + '/help/wiki_syntax',
      "",
      "resizable=yes, location=no, width=600, height=640, menubar=no, status=no, scrollbars=yes"
    );
    return false;
  });
});



var Administration = (function ($) {
  var update_default_language_options,
      init_language_selection_handling,
      toggle_default_language_select;

  update_default_language_options = function (input) {
    var default_language_select = $('#setting_default_language select'),
        default_language_select_active;

    if (input.attr('checked')) {
      default_language_select.find('option[value="' + input.val() + '"]').removeAttr('disabled');
    } else {
      default_language_select.find('option[value="' + input.val() + '"]').attr('disabled', 'disabled');
    }

    default_language_select_active = default_language_select.find('option:not([disabled="disabled"])');

    toggle_disabled_state(default_language_select_active.length === 0);

    if (default_language_select_active.length === 1) {
      default_language_select_active.attr('selected', true);
    } else if (default_language_select.val() === input.val() && !input.attr('checked')) {
      default_language_select_active.first().attr('selected', true);
    }
  };

  toggle_disabled_state = function (active) {
    jQuery('#setting_default_language select').attr('disabled', active)
                                         .closest('form')
                                         .find('input:submit')
                                         .attr('disabled', active);
  };

  init_language_selection_handling = function () {
    jQuery('#setting_available_languages input:not([checked="checked"])').each(function (index, input) {
      update_default_language_options($(input));
    });
    jQuery('#setting_available_languages input').click(function () {
      update_default_language_options($(this));
    });
  };

  return {
    init_language_selection_handling: init_language_selection_handling
  };
}(jQuery));

var activateFlash = function(selector) {
  var flashMessages = jQuery(selector);

  // Ignore flash messages of class 'ignored-by-flash-activation' because those
  // messages are completely handled via JavaScript (see types_checkboxes.js for
  // details). We wouldn't have to ignore this message if the flash element
  // would be completely created via JavaScript and not available in the DOM by
  // default.
  flashMessages.each(function (ix, e) {
    flashMessage = jQuery(e);
    if (!flashMessage.hasClass('ignored-by-flash-activation')) {
      flashMessage.show();
    }
  });
};

var activateFlashNotice = function () {
  var notice = '.flash';

  activateFlash(notice);
};

var activateFlashError = function () {
  var error = '.errorExplanation[role="alert"]';

  activateFlash(error);
};

var focusFirstErroneousField = function() {
  var firstErrorSpan = jQuery('span.errorSpan').first();
  var erroneousInput = firstErrorSpan.find('*').filter(":input");

  erroneousInput.focus();
};

var setupServerResponse = function() {
  initMainMenuExpandStatus();
  focusFirstErroneousField();
  activateFlashNotice();
  activateFlashError();

  jQuery(document).ajaxComplete(activateFlashNotice);
  jQuery(document).ajaxComplete(activateFlashError);
};

jQuery(document).ready(setupServerResponse);

