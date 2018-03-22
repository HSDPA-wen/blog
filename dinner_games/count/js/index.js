/*
* @年终盛典h5
* @author liuwentao
* @create 2016-12-16
* */
define( [ 'Zepto' ] , function ($) {

    return {
        /*
        * js 调用入口
        * @method init
        * */
        init: function () {

            var num = 15;
            var timer = null;
            var count = 0;

            $('#j_btn').on('click',function () {

                if($(this).hasClass('_onClick')) return;

                count++;
                $('.j_count').html(count);

                if(!timer){
                    timer = setInterval(function () {
                        num--;
                        $('.j_num').html(num);
                        if(num <= 0)  {
                            $('#j_btn').addClass('_onClick');
                            clearInterval(timer);
                        }
                    },1000);
                }

            });

        }
    };

})