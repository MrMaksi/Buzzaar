$(document).ready(function(){


    $('.tab-pane .close').click(function() {
        $(this).closest('.tab-pane').removeClass('active');
        $('.nav-header .nav-tabs li').removeClass('active');
    });


});
