$(document).ready(function() {
	$('html').removeClass('no-js');
	
	//// MISC BEHAVIOUR (clicking, focusing, etc.)
	// .mouseuser class removes outline on focused elements for aesthetic reasons. When mouse moves, .mouseuser class is added. When tab press is detected, .mouseuser class is removed.
	var mouseUser = false;
	$(window).on('mousemove touchmove', function() {
		if (mouseUser == false) {
			$('html').addClass('mouseuser');
			mouseUser = true;
		}
	});
	$('html').keydown(function(event) {
		if (mouseUser == true && event.keyCode == 9) {
			$('html').removeClass('mouseuser');
			mouseUser = false;
		}
	});
	
	// Smooth scrolling animation when clicking anchor links.
	var $root = $('html, body');
	$('a[href^="#"]').on('click tap', function() {
    var href = $.attr(this, 'href');
    $root.animate({
        scrollTop: ($(href).offset().top)
    }, 600, function () {
			// So that the href shows up in the URL bar
			window.location.hash = (href);
    });
	});
	
	// This block removes the focus from the clicked anchor and onto the target element of the anchor
	$('#skipnav').on('click tap', function() {
		var skipTo='#'+this.href.split('#')[1];
		$(skipTo).attr('tabindex',-1).on('blur focusout', function() {
			$(this).removeAttr('tabindex');
		});
    return false;
	});
	
	//	 Prevent page jump when clicking a null anchor link
	$('a[href="#"]').on('click tap', function(event){
		event.preventDefault();
	});
	
	
	// If the default 'Search...' text is there, clear on click/focusin. If other text is there, leave in place and highlight all. If the input field is left empty, revert to default 'Search...' text.
	var defaultValue = 'Search...';
	$('.searchbar').find('input[type=text]').on('click tap focusin', function() {
		if (this.value == defaultValue) { this.value = ''; }
		this.select();
	});
	$('.searchbar').find('input').focusout(function() {
		if (this.value == '') { this.value = defaultValue; }
	});
	
	// Icon info popout on focus/hover for social media icon links
	$('.withpop').parent('div').parent('a').on('focusin mouseenter', function(){
		$(this).find('.popout').fadeIn(100);
	}).on('focusout mouseleave', function(){
		$(this).find('.popout').fadeOut(100);
	});
	
	// .menu-close button simple hover effect
	$('.menu-close').on('mouseenter focusin', function () {
		$(this).find('span').css({ 'display':'inline' });
	}).on('mouseleave focusout', function () {
		$(this).find('span').css({ 'display':'none' });
	});
	
	
	//// HEADER IMAGE
	// This block detects the dimensions of the image inside #main-img and changes class of #main-img accordingly, for different styles.
	var headerHeight = $('header').height();
	var imageHeight = $('#main-image').height();
	
	var mainImage = $('#main-image > #main-image-container > img');
	
	mainImage.ready(function() {
		
		var imgHeight = mainImage.height();
		var imgWidth = mainImage.width();
		var imgRatio = imgWidth/imgHeight;
		
		$('#main-image').removeClass('default');
		
		if (imgWidth >= 1200) {
			$('#main-image').addClass('fullsize');
		} else if(!mainImage.length) {
			$('#main-image').addClass('noimage');
		
			// When there is no image, the title box is also given the .inset class to have it overlap the empty image div.
			$('.box.main.title').addClass('inset');
		} else {
			$('#main-image').addClass('smallsize');
		}
		
		// Setting up the header and #main-image for the parallax scroll. It's necessary to do this here because the #main-image height top margin is set based on the height of the image, which is dynamically changed inside this scope.
		
		$('header').css({'position':'fixed'});
		$('#main-image').css({'position':'fixed'});

		headerHeight = $('header').height();
		imageHeight = $('#main-image').height();
		$('#main-image').css({'top': headerHeight + 'px'});
		$('#main-container').css({'margin-top': headerHeight + imageHeight + 'px'});
		
	});
	
	//// PARALLAX SCROLL
	// Parallax scroll of the header & main image. Applies to all pages except the front, which is selected out via the .header-crush class.
	
	$(window).resize(function() {
		headerHeight = $('header').height();
		imageHeight = $('#main-image').height();
		$('#main-image').css({'top': headerHeight + 'px'});
		$('#main-container').css({'margin-top': headerHeight + imageHeight + 'px'});
	});
	
	// This sets the height of the header and #main-image on page load.
	var windowScroll = $(window).scrollTop();
	
	$('header:not(.header-crush)').css({
		'margin-top': '-' + windowScroll*0.5 + 'px'
	});
	$('#main-image').css({
		'margin-top': '-' + windowScroll*0.7 + 'px'
	});
	
	// And this is the parallax scroll effect itself, which ties header/#main-image's margin-top to windowScroll with different multipliers.
	$(window).scroll(function() {
		windowScroll = $(window).scrollTop();
		$('header:not(.header-crush)').css({
			'margin-top': '-' + windowScroll*0.5 + 'px'
		});
		$('#main-image').css({
			'margin-top': '-' + windowScroll*0.7 + 'px'
		});
	});

	// If the window has scrolled past the header, then focusing to any element inside the header will scroll the page back to the top. This is necessary because the parallax effect has set the header to "fixed" position and then moved it off-screen, so the only way to make it visible again is to scroll up.
	$('header *').focus(function() {
		if (windowScroll > headerHeight*1.5) {
			$('html, body').animate({scrollTop:0}, 200 + windowScroll/4);
		}
	});
	
	//// BLADE BEHAVIOUR
	//// I've put all behaviour for 'blade' content here in the global script because there's more than one page that uses blades. However, not all pages use blades. So I'm not sure whether it's more efficient to have this here, or to copy it into all of the individual pages' JS files?
	$('.blade-top').removeClass('clicked');
	$('.blade-bottom').css({'display':'none'});
	
	// Expanding and collapsing the blades on click.
	jQuery.fn.extend({
    expandBlade: function () {
			if(this.hasClass('clicked')) {
				this.removeClass('clicked');
			} else {
				this.addClass('clicked');
			}
			this.siblings('.blade-bottom').slideToggle(400);
			this.blur();
			return this;
		}
	});
	
	$('.blade-top').on('click tap', function(){
		$(this).expandBlade();
	});
	$('.blade-top').on('keydown', function(key){
		if (key.keyCode == 13) {
			$(this).expandBlade();
		}
	});
	
	//// TESTING CODE ////
	//// Checking breakpoints
	//	$('header').append(
	//		"<div id='testbox' tabindex=-1>BREAK</div>"
	//	);
	//	
	//	$('#testbox').css({
	//		'display':'none',
	//		'position':'fixed',
	//		'top':'0',
	//		'left':'0',
	//		'color':'#fff',
	//		'background-color':'#000',
	//		'font-size':'150%',
	//		'padding':'20px'
	//	});
	//	
	//	var breakpoints = [320, 480, 768, 992, 1200];
	//	
	//	var checkWindowSize = function(){
	//		var w=$(window).width();
	//		for (var i=0; i<breakpoints.length; i++) {
	//			if (w > breakpoints[i]-5 && w < breakpoints[i]+5) {
	//				$('#testbox').css({'display':'block'});
	//			} else {
	//				$('#testbox').delay(300).fadeOut(200);
	//			}
	//		}	
	//	};
	//	
	//	$(window).resize(function() {
	//		checkWindowSize();
	//	});
	
});

