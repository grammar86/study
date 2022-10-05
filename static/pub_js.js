$(function(){
    eventJs.init();
});

const eventJs = {
    click : function(){
        const target = '.eventWrap',
              textBox = target + ' .textBox',
              imgGroup = target + ' .imgGroup',
              link = imgGroup + ' > a',
              close = target + ' .btnBack';

        $(document).on('click',link, function(e){
            $('body').addClass('scrollLock');
            $(imgGroup).addClass('hide');
            const top = $(this).offset().top;
            const left = $(this).position().left;

            const st = $(window).scrollTop();

            const src = $(this).find('img').attr('src');

            const idx = $(this).index();

            eventJs.appendClick(top - st, left,src,idx);
            return false;
        });

        $(document).on('click',close, function(e){
            $('body').removeClass('scrollLock');
            $(imgGroup).removeClass('hide');
            $(close).removeClass('on');
            $('.mySwiper').removeClass('on');
            return false;
        });
    },
    appendClick:function(t,l,src,idx){
        let html = '<div class="imgAction">';
        html += '<img src="" alt=""></div>'
        html += '</div>';
        
        let h = $(window).outerHeight();
        h = (h - h*0.8)/2
        
        $(html).appendTo('.eventWrap').css({'top':t,'left':l}).find('img').attr('src',src);
        let animation = anime({
            targets: '.eventWrap .imgAction',
            top:[t, h],
            height:'80vh',
            delay:300,
            duration: 500,
            easing:'easeInOutSine',
            complete: function(anim) {
                $('.mySwiper').addClass('on');
                var swiper = new Swiper(".mySwiper", {
                    direction: "vertical",
                    loop:true,
                    slidesPerView: 1,
                    initialSlide:idx,
                    mousewheel: true,
                    pagination: {
                        el: ".swiper-pagination",
                        clickable: true,
                    },
                });

                $('.btnBack').addClass('on');

                setTimeout(function(){
                    $('.eventWrap .imgAction').remove();
                },200)
            }
        });
    },
    init : function(){
        eventJs.click();
    }
}