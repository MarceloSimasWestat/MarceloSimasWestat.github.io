/*
	Hyperspace by Pixelarity
	pixelarity.com @pixelarity
	License: pixelarity.com/license
*/

// State dropdown

$(document).ready(function(){
    $("#1st-stateDropdown").change(function(){
        $("img[name=1st-image-swap]").attr("src",$(this).val());

    });

});

$(document).ready(function(){
    $("#2nd-stateDropdown").change(function(){
        $("img[name=2nd-image-swap]").attr("src",$(this).val());

    });

});

// Smooth scrolling

$(document).ready(function(){
    // Add smooth scrolling to all links
    $("a").on('click', function(event) {

        // Make sure this.hash has a value before overriding default behavior
        if (this.hash !== "") {
            // Prevent default anchor click behavior
            event.preventDefault();

            // Store hash
            var hash = this.hash;

            // Using jQuery's animate() method to add smooth page scroll
            // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function(){
   
                // Add hash (#) to URL when done scrolling (default click behavior)
                window.location.hash = hash;
            });
        } // End if
    });
});

// Preloader

window.addEventListener("load", function () {

    var loader = document.getElementById("loader");
    var loader_wrapper = document.getElementById("loader-wrapper");

    loader.style.transition = "all 0.3s ease-out";
    loader.style.webkitTransition = "all 0.3s ease-out";
    loader.style.opacity = 0;

    loader_wrapper.style.transition = "all 1s ease-out";
    loader_wrapper.style.webkitTransition = "all 1s ease-out";
    loader_wrapper.style.opacity = 0;

    setTimeout(function () { document.body.removeChild(loader_wrapper) }, 1000);

});

$(document).ready(function() {

    $('body').addClass('loaded');

    // By default, high contrsast is off (no cookies)
    $('#highContrast').attr("checked", false);

    // toggle high constrast stylesheets
    $('#highContrast').click(function () {

        if ($('#highContrast').is(":checked")) {
            $('link').attr('href', 'assets/css/main-highcontrast.css')
			
            //$('head').append('<link rel="stylesheet" title="chartStylesHC" type="text/css" href="assets/css/chart-styles-highcontrast.css">');
            //$('link[title="chartStyles"]').prop('disabled', true);
            //$('link[title="chartStylesHC"]').prop('disabled', false);
        } else {
            $('link').attr('href', 'assets/css/main.css')
			
            //$('link[title="chartStylesHC"]').prop('disabled', true);
            //$('link[title="chartStyles"]').prop('disabled', false);
        }

    });

    
});
  

//

(function($) {

    skel.breakpoints({
        xlarge:	'(max-width: 1680px)',
        large:	'(max-width: 1024px)',
        medium:	'(max-width: 980px)',
        small:	'(max-width: 736px)',
        xsmall:	'(max-width: 480px)'
    });

    $(function() {

        var	$window = $(window),
			$body = $('body'),
			$sidebar = $('#sidebar')
        $preloading = $('#preloading');

        // Hack: Enable IE flexbox workarounds.
        if (skel.vars.IEVersion < 12)
            $body.addClass('is-ie');

        // Disable animations/transitions until the page has loaded.
        /*if (skel.canUse('transition'))
            $body.addClass('is-loading');

        /*$window.on('load', function() {
            window.setTimeout(function() {
                $body.removeClass('is-loading');
            }, 100);
        });*/

        // Forms.

        // Fix: Placeholder polyfill.
        $('form').placeholder();

        // Hack: Activate non-input submits.
        $('form').on('click', '.submit', function(event) {

            // Stop propagation, default.
            event.stopPropagation();
            event.preventDefault();

            // Submit form.
            $(this).parents('form').submit();

        });

        // Prioritize "important" elements on medium.
        skel.on('+medium -medium', function() {
            $.prioritize(
                '.important\\28 medium\\29',
                skel.breakpoint('medium').active
            );
        });

        // Sidebar.
        if ($sidebar.length > 0) {

            var $sidebar_a = $sidebar.find('a');

            $sidebar_a
                .addClass('scrolly')
                .on('click', function() {

                    var $this = $(this);

                    // External link? Bail.
                    if ($this.attr('href').charAt(0) != '#')
                        return;

                    // Deactivate all links.
                    $sidebar_a.removeClass('active');

                    // Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
                    $this
                        .addClass('active')
                        .addClass('active-locked');

                })
                .each(function() {

                    var	$this = $(this),
                        id = $this.attr('href'),
                        $section = $(id);

                    // No section for this link? Bail.
                    if ($section.length < 1)
                        return;

                    // Scrollex.
                    $section.scrollex({
                        mode: 'middle',
                        top: '-20vh',
                        bottom: '-20vh',
                        initialize: function() {

                            // Deactivate section.
                            if (skel.canUse('transition'))
                                $section.addClass('inactive');

                        },
                        enter: function() {

                            // Activate section.
                            $section.removeClass('inactive');

                            // No locked links? Deactivate all links and activate this section's one.
                            if ($sidebar_a.filter('.active-locked').length == 0) {

                                $sidebar_a.removeClass('active');
                                $this.addClass('active');

                            }

                                // Otherwise, if this section's link is the one that's locked, unlock it.
                            else if ($this.hasClass('active-locked'))
                                $this.removeClass('active-locked');

                        }
                    });

                });

        }

        // Scrolly.
        $('.scrolly').scrolly({
            speed: 1000,
            offset: function() {

                // If <=large, >small, and sidebar is present, use its height as the offset.
                if (skel.breakpoint('large').active
                &&	!skel.breakpoint('small').active
                &&	$sidebar.length > 0)
                    return $sidebar.height();

                return 0;

            }
        });

        // Spotlights.
        $('.spotlights > section')
            .scrollex({
                mode: 'middle',
                top: '-10vh',
                bottom: '-10vh',
                initialize: function() {

                    // Deactivate section.
                    if (skel.canUse('transition'))
                        $(this).addClass('inactive');

                },
                enter: function() {

                    // Activate section.
                    $(this).removeClass('inactive');

                }
            })
            .each(function() {

                var	$this = $(this),
                    $image = $this.find('.image'),
                    $img = $image.find('img'),
                    x;

                // Assign image.
                $image.css('background-image', 'url(' + $img.attr('src') + ')');

                // Set background position.
                if (x = $img.data('position'))
                    $image.css('background-position', x);

                // Hide <img>.
                $img.hide();

            });

        // Features.
        if (skel.canUse('transition'))
            $('.features')
                .scrollex({
                    mode: 'middle',
                    top: '-20vh',
                    bottom: '-20vh',
                    initialize: function() {

                        // Deactivate section.
                        $(this).addClass('inactive');

                    },
                    enter: function() {

                        // Activate section.
                        $(this).removeClass('inactive');

                    }
                });

    });

})(jQuery);