/**
 * 
 * makeScroll jQuery plugin
 * 
 * Version 1.0 (10-06-2014)
 * gabfactory.com
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * 
 * @author Gabriele Abatematteo
 * @since 2014
 */
(function($){  
	$.fn.makeScroll = function(options) {  
	
		var defaults = { };
		var options = $.extend(defaults, options);	
		
		// styles for the target scrollable element
		var cssTarget = { width: 'auto', height: 'auto', overflow: 'scroll', overflowX: 'hidden'/*, zIndex: 0*/ }		
		
		// styles for the real parent container
		var cssWrapper = { width: 'auto', height: 'auto', position: 'relative', overflow: 'hidden' }		
		
		// styles for the scroller container
		/* light */ var cssScroller = { background: 'rgba(0,0,0,0.1)', borderLeft: "1px solid rgba(0,0,0,0.1)", width: '10px', height: '100%', position: 'absolute', top: 0, right:0/*,zIndex: 1*/ }		
		/* dark  */ //var cssScroller = { background: '#CCCCCC', borderLeft: "1px solid #CCCCCC", width: '10px', height: '100%', position: 'absolute', top: 0, right:0/*,zIndex: 1*/ }		

		// styles for the scrollbar
		/* light */ var cssBar = { background: 'rgba(0,0,0,0.4)', width: '100%', height: '10px', cursor: 'pointer' }
		/* dark  */ //var cssBar = { background: '#FFFFFF', width: '100%', height: '10px', cursor: 'pointer' }
		
		// the ratio between the target height and the content scroll height (will be set after)
		var ratio = 1;
		
		// the target dom element
		var target = null;
		
		// the real parent container
		var wrapper = null;
		
		// default margin size (equivalent to the scrollbar arrow)
		var margin = 15;
		
		return this.each(function() {  
			// if no target found, exit
			if ($(this).length === 0)
				return;

			// set the target dom element that must be 'scrollable'
			target = $(this);
			
			// set the real parent
			wrapper = $(this).parent();

			// set the properly width and height like the parent for the interested elements
			// reel parent
			cssWrapper.width = wrapper.width();			
			cssWrapper.height = wrapper.height();
			// target scrollable
			cssTarget.width = cssWrapper.width + margin + 2;
			cssTarget.height = cssWrapper.height;
			// scrollable height
			cssScroller.height = cssWrapper.height;
			
			// wrapping the target element and create the scrollbar
			target
				.addClass('scrollable')
				.wrap('<div class="scrollable-wrapper"></div>')
				.css(cssTarget)
				.parent().css(cssWrapper)
				.append('<div class="scroller"><div class="bar"></div></div>');

			// set the styles
			$('.scroller', wrapper).css(cssScroller);
			$('.scroller > .bar', wrapper).css(cssBar);

			// content height
			var ch = cssWrapper.height;// - 30;
			// scroll height
			var sh = target.prop('scrollHeight');
			// bar height
			var bh = parseInt(ch * (ch / sh)) - margin;
			
			// calculate the ratio (used for calculate the scroll steps in pixel)
			ratio = sh / ch;
			
			// check if the bar height is less than the margin
			if (bh < margin) { 
				bh = margin; 
			}

			$("#debug_factor").html(ratio);
			$( "#debug_heights" ).html(
				" content: " + ch +
				" scrollable: " + sh +
				" bar: " + bh
			);
			console.log('ch: ' + ch);
			console.log('sh: ' + sh);
			console.log('bh: ' + bh);
			console.log('factor: ' + ratio);
			
			// set up the drag system
			$('.scroller > .bar', wrapper)
				// bar height
				.css({ height: bh + "px" })
				// on drag event
				.draggable({ 
					containment: "parent",
					// on drag start: set "scrolling" class in order to recognize the managed scroll
					start: function() {
						target.addClass("scrolling");
					},
					drag: function() {
						// calculate the top position for the scroll top height
						var top = parseFloat($('.scroller > .bar', wrapper).css("top"));
						top += margin - ($(this).scrollTop() / ratio);
						top *= ratio;
						
						// check if there is a surplus in the upper position compared to the margin
						if (parseInt($('.scroller > .bar', wrapper).css("top")) <= margin) {
							top = 0;
						}
						
						// perform the scroll
						target.scrollTop(top);
						
						$("#debug_scroll_mode").html(
							"top: " + parseInt(top) + " " + 
							"bar-top: " + $('.scroller > .bar', wrapper).css("top")
						);						
					},
					// on drag stop: remove the "scrolling" class
					stop: function() {
						target.removeClass("scrolling");
					}
				});
				
			// handler for the manual scroll for place the bar at the right height, regarding the scroll position
			target.scroll(function() {
				if (!$(this).is(".scrolling")) {
					// calculate the top position for bar
					var top = margin - ($(this).scrollTop() / ratio);
					// check for negatives values
					top = (top < 0) ? (top * -1) : top;
					// check for margin surplus
					top = (top <= margin) ? 0 : top;
					
					// set the bar position
					$('.scroller > .bar', wrapper).css({ top: top });
					
					$("#debug_scroll_mode").html(
						"manual: " + $(this).scrollTop() + " " + 
						"bar-top: " + $('.scroller > .bar', wrapper).css("top")						
					);
				}
				else {
					// nothing to do here, the scroll is fired manually
					$("#debug_scroll_mode").html(
						"handled: " + $(this).scrollTop() + " " + 
						"bar-top: " + $('.scroller > .bar', wrapper).css("top")
					);
				}
			});
		});
	};  
})(jQuery);