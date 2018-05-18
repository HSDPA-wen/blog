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

      $('#j_btn').on('click', function () {
        if ($(this).hasClass('show-detail')) return false;
        var win = getParam('win');
        var winTxt = '再接再厉';
        if (+win === 1) {
          winTxt = '免单';
        } else if (+win === 2) {
          winTxt = '40元现金券';
        } else if (+win === 3) {
          winTxt = '25元现金券';
        }
        $('#j_btn').addClass('show-detail').find('span').html(winTxt);
        $('#j_btn').addClass('win' + win);
      });

      function getParam(paramName) {
        paramValue = "", isFound = !1;
        if (this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=") > 1) {
          arrSource = unescape(this.location.search).substring(1, this.location.search.length).split("&"), i = 0;
          while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++
        }
        return paramValue == "" && (paramValue = null), paramValue
      }

    }
  };

})
