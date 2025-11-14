
$(function() {
  common.init();
  layerPopup.init();
  tooltip();
});

const common = {
  tab:function(){
    $(document).on('click','.tab-box2 a',function(){
      const idx = $(this).index();
      $(this).addClass('on').siblings().removeClass('on').parent().siblings('.tab-cont-box').find('>.tab-cont').eq(idx).addClass('on').siblings().removeClass('on');
      return false;
    });

    $(document).on('click','.tab-box a',function(){
      const target = $(this).attr('href');
      const top = $(target).offset().top;
      const tabH = $('.tab-box').outerHeight();
      $('html,body').animate({'scrollTop':top - tabH +1},200, function(){
        $(target).focus();
      });
      return false;
    });

    $(window).scroll(function(){
      const scrollT = $(window).scrollTop();
      const tabH = $('.tab-box').outerHeight();
      $('.tab-cont-link').each(function(e){
        const linkT = $(this).offset().top;
        if(scrollT + tabH >= linkT) {
          $('.tab-box a').eq(e).addClass('on').siblings().removeClass('on');
        }
      });
    });
  },
  init: function () {
    common.tab();
  }
};


const tooltip = function () {
  $(document).on('click', '.tooltip', function (e) {
    const space = 20;
    let tipW = 600;
    if ($(this).data('width')) {
      tipW = $(this).data('width');
    }
    if($(window).outerWidth() <= 767){
      tipW = 300
    }

    let secW = $('#container').outerWidth() - space * 2;
    let addM = 0;
    if (($(this).parent().position().left + 10 - space) / secW > 0.5) {
      addM = 20;
    }
    let tipLeft = -Math.round((($(this).parent().position().left + 10 - space) / secW) * tipW) + addM;

    if ($(this).siblings('.tooltip-pop').hasClass('popup')) {
      if (!$('.popup-dim').length) {
        $('body').append('<div class="popup-dim"></div>').addClass('scroll-lock');
      }
    }

    $('.tooltip-pop').not($(this).siblings('.tooltip-pop')).fadeOut('fast');
    $(this)
      .siblings('.tooltip-pop')
      .css({ width: tipW, left: tipLeft, '--tip-left': tipW - tipLeft - tipW + 6 + 'px' });
    $(this).siblings('.tooltip-pop').fadeToggle('fast');
    return false;
  });
  $(document).on('click', '.tooltip-pop .btn-close', function () {
    $(this).closest('.tooltip-pop').fadeOut('fast');
    $('.popup-dim').fadeOut('fast', function () {
      $(this).remove();
    });
    $('body').removeClass('scroll-lock');
    return false;
  });
}

/* 팝업 */
const layerPopup = {
  click: function () {
    $(document).on('click', '.popOpen', function () {
      const $this = $(this);
      let href = $this.attr('href');
      let style = '';
      if ($this.data('pop-style')) {
        style = $this.data('pop-style');
      }
      if (!href) {
        href = $this.data('href');
      }
      layerPopup.open(href, $this, style);
      return false;
    });
  },
  open: function (target, el, style) {
    const cont = $(target).find('.layerPopCont');
    $(target).removeClass('bottom full').addClass(style);

    setTimeout(function () {
      $(target).addClass('on');
    }, 100);

    setTimeout(function () {
      cont.focus();
    }, 150);
    $('body').addClass('scrollLock');

    cont
      .find('.btnPopClose')
      .last()
      .on('keydown', function (e) {
        var code = e.which;
        if (code == 9) {
          $(this).closest('.layerPopCont').focus();
        }
      });
    layerPopup.close(target, el);

    $('#container').attr('aria-hidden', 'true');
    $(target).attr('aria-hidden', 'false');
  },
  close: function (target, reTarget) {
    $(target).off('click');
    $(target).find('.btnPopClose').off('click');

    $(target)
      .find('.btnPopClose')
      .on('click', function () {
        layerPopup.actionClose(target, reTarget);
        return false;
      });
    $(target).on('click', function (e) {
      if ($(e.originalEvent.target).data('dim-close') === undefined) {
        if ($(e.originalEvent.target).hasClass('layerPopWrap')) {
          layerPopup.actionClose(target, reTarget);
        }
      }
    });
  },
  actionClose: function (target, reTarget) {
    let btnTarget = reTarget ? reTarget : '';
    $(target).removeClass('on').removeClass('show');
    $('body').removeClass('scrollLock');

    if (reTarget) {
      btnTarget.focus();
      btnTarget.removeClass('morphing action');
    }

    /* */
    $('#container').removeAttr('aria-hidden');
    $(target).removeAttr('aria-hidden');
  },
  init: function () {
    layerPopup.click();
  }
};

const tostpop = {
  setting: function () {
    if (!$('.tost-wrap').length) {
      let tostWrap = '<div class="tost-wrap"></div>';
      $('body').append(tostWrap);
    }
  },
  open: function (massege, delay,type, focusCheck, linkTarget) {
    let delayTime;
    delay ? (delayTime = delay) : (delayTime = 2000);

    tostpop.setting();

    let text = '';

    if(type == 1){
      text += '<div class="tost-box" aria-live="polite">' + massege;
    } else if(type == 2){
      text += '<div class="tost-box" role="alert">' + massege;
    } else {
      text += '<div class="tost-box">' + massege;
    }
    text += '</div>';

    const target = $(text).appendTo('.tost-wrap');
    console.log(focusCheck)
    if(focusCheck){
      $(target).attr('tabindex','0');
    }
    setTimeout(function () {
      target.slideDown(function(){
        if(focusCheck){
          $(target).focus();
        }
      });

      // 삭제
      setTimeout(function () {
        target.slideUp(function () {
          target.remove();
          if(focusCheck){
            $(linkTarget).focus();
          }
        });
      }, delayTime);
    }, 20);
  }
};