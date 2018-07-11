$('#freewha').hide();

var $element = $('.element');
 
$element.waypoint(function(direction){
   if (direction == 'down'){
   $element.addClass("show-element");
   } else{
    $element.removeClass("show-element");   
   }
}, {offset: '50%'});
