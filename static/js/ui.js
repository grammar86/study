
$(function() {
  common.init();
  layerPopup.init();
});

const common = {
  tab:function(){
    $(document).on('click','.tab-box a',function(){
      const idx = $(this).index();
      $(this).addClass('on').siblings().removeClass('on').parent().siblings('.tab-cont-box').find('>.tab-cont').eq(idx).addClass('on').siblings().removeClass('on');
      return false;
    });
    $(document).on('click','.tab-box2 a',function(){
      const idx = $(this).index();
      $(this).addClass('on').siblings().removeClass('on').parent().siblings('.tab-cont-box').find('>.tab-cont').eq(idx).addClass('on').siblings().removeClass('on');
      return false;
    });
  },
  init: function () {
    common.tab();
  }
};

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
    }, 150);

    setTimeout(function () {
      cont.focus();
    }, 30);
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