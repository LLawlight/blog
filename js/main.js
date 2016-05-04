$(function() {
    $(window).scroll(function() {
        if ($(window).scrollTop() > 1000)
            $('div.go-top').show();
        else
            $('div.go-top').hide();
    });
    $('div.go-top').click(function() {
        $('html, body').animate({scrollTop: 0}, 200);
    });
});
$(function(){
	function sidebarFixed(){
		if($(window).height()-$("footer").height()<$(".sidebar").height()){
			$(".sidebar").css({
				position: "static"
			});
		}else if ($(window).scrollTop()>=$(".content").offset().top) {
			$(".sidebar").css({
				position: "fixed",
				top: '0',
				right: ($(window).width()-$("main").width())/2
			});
		}else{
			$(".sidebar").css({
				position: "static"
			});
		}
	}
	sidebarFixed();
	$(window).scroll(sidebarFixed);
	$(window).resize(sidebarFixed);
});