/*
* @年终盛典h5
* @author liuwentao
* @create 2016-12-16
* */
define(['Zepto'], function ($) {

  return {
    /*
    * js 调用入口
    * @method init
    * */
    init: function () {

      var deviceWidthDp = $(window).width();
      var baseDp = 1 + 2 * (deviceWidthDp - 375) / 39 / 16
      if (deviceWidthDp > 1000) {
        baseDp = 1.375 + 6 * (deviceWidthDp - 1000) / 1000 / 16
      } else if (deviceWidthDp > 750) {
        baseDp = 1.25 + 4 * (deviceWidthDp - 750) / 500 / 16
      } else if (deviceWidthDp > 414) {
        baseDp = 1.125 + 4 * (deviceWidthDp - 414) / 672 / 16
      }

      $('#j_width').html(deviceWidthDp);
      $('#j_basedp').html(baseDp);

    }
  };

})
