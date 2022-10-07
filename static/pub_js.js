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

            $('.textBox .text').slideUp('fast',function(){
                $(this).text('')
            });
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
                eventJs.swiper(idx);
            }
        });
    },
    swiper:function(idx){
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

        const text = $('.swiper-slide-active').find('img').attr('alt');
        $('.textBox .text').text(text).slideDown('fast');

        swiper.on('slideChangeTransitionEnd',function(a,b,c){
            const text = $('.swiper-slide-active').find('img').attr('alt');
            let tl = anime.timeline({
                targets: '.textBox .text',
                easing:'easeInOutSine',
                duration:300
            });
            tl.add({
                translateX:[0,'-20px'],
                opacity:[1,0],
                complete: function(anim) {
                    $('.textBox .text').text(text);
                }
            })
            .add({
                translateX:['20px',0],
                opacity:[0,1],
            })
            //$('.textBox .text').text(text);
        })

        $('.btnBack').addClass('on');

        setTimeout(function(){
            $('.eventWrap .imgAction').remove();
        },200);
    },
    init : function(){
        eventJs.click();
    }
}