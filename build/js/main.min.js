$(document).ready(function(){

    $('#freewha').hide();

    $(window).load(function () {
        $(".loaded").delay(100).fadeOut();
        $(".preloader").delay(100).fadeOut("slow");

        setTimeout(function(){
            $('.title-list').removeClass('noHover');
            $('.logo').removeClass('noHover');
        },1000);

    });


   var project_holder = $('.project-img-holder');
   var project = $('.project-img');
   var hover = $('.hover');
   var projectDiv = $('.project');

   projectDiv.hide();
   hover.hide();

    project_holder.on('mouseenter', function(){
      $(this).next().show();
      $(this).children().addClass('zoom-img');
   });

    hover.on('mouseleave', function(){
        hover.hide();
        project.removeClass('zoom-img');
    });

    $('#navbar-collapse').find('a[href*=#]:not([href=#])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: (target.offset().top - 40)
                }, 1000);
                if ($('.navbar-toggle').css('display') != 'none') {
                    $(this).parents('.container').find(".navbar-toggle").trigger("click");
                }
                return false;
            }
        }
    });


    var windowWidth = $(window).width();
    if (windowWidth > 757) {



        $(window).scroll(function () {
            if ($(this).scrollTop() > 500) {
                $('.navbar').fadeIn(500);
                $('.navbar').addClass('menu-bg');

            } else {

                $('.navbar').removeClass('menu-bg');
            }
        });

    }


    // ****************************** SMOOTH SCROLL ****************************************************//

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
                    scrollTop: $(hash).offset().top - 91
                }, 800, function(){

                    // Add hash (#) to URL when done scrolling (default click behavior)
                   // window.location.hash = hash;
                });
            } // End if
        });

   // *********************************** TOP SECTION ANIMATION *********************************************//

    $(function(){
        var x = 0;
        setInterval(function(){
            x-=1;
            $('.home').css('background-position', x + 'px 0');
            $('.portfolio').css('background-position', x + 'px 0');
        }, 50);
    })

// HEADER HOVER
    function hoverOn(element){
        $(element).children('.hoverA').addClass('full-width');
        $(element).children('.hoverB').addClass('full-width');
        $(element).children('.hoverC').addClass('full-height');
        $(element).children('.hoverD').addClass('full-height');
    }
    function hoverOff(element){
        $(element).children('.hoverA').removeClass('full-width');
        $(element).children('.hoverB').removeClass('full-width');
        $(element).children('.hoverC').removeClass('full-height');
        $(element).children('.hoverD').removeClass('full-height');
    }
    $('.header-a').hover(
        function() {
            hoverOn(this);
        },
        function() {
            hoverOff(this);
        }
    );

 // WAY POINTS

    var waypoint1 = new Waypoint({
        element: document.querySelector('#skills'),
        handler: function(direction) {
            $('.skill-left').animate({"left": '0'}, 1000);
            $('.skill-right').animate({"right": '0'}, 1000);
        },
        offset: 600
    });

    function timeOut(i){
        setTimeout(function(){
            $(projectDiv[i]).fadeIn(2000);
        }, 200 + (200 * i));
    }

    var waypoint2 = new Waypoint({
        element: document.querySelector('#portfolio'),
        handler: function(direction) {
           for(var i = 0; i < projectDiv.length; i++){
               timeOut(i);
            }
        },
        offset: 600
    });



});