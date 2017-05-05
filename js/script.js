$(document).ready(function() {
    $('[data-toggle="popover"]').popover({
        trigger: 'hover',
        container: 'body',
        placement: function(context, source) {
            var position = $(window).width();
            if ($(window).width() < 991) {
                return "left";
            }

            return "top";
        }
    });
});