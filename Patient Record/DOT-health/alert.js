/*
 * Jquery Messageæ’ä»¶
 * ä½¿ç”¨ä¾‹å­ :
 * $.alert("æç¤ºå†…å®¹",{
 *      title : "æ ‡é¢˜",
 *      position : ['left', [-0.1,0]]
 * })
 * ä¹Ÿå¯ä»¥è¿™æ ·ä½¿ç”¨
 * $.alert("æç¤ºå†…å®¹","æ ‡é¢˜");
 * ä½ç½®è¯·ä½¿ç”¨
 * top-left,top-right,bottom-left,bottom-right,center å¤§å°å†™éƒ½å¯ä»¥å“¦
 */

(function ($) {
    $.alert_ext = {
        // é»˜è®¤é…ç½®
        defaults: {
            autoClose: true,  // è‡ªåŠ¨å…³é—­
            closeTime: 5000,   // è‡ªåŠ¨å…³é—­æ—¶é—´ï¼Œä¸å°‘äºŽ1000
            withTime: false, // æ·»åŠ è®¡æ—¶  ä¼šåœ¨æ–‡å­—åŽé¢æ·»åŠ   ...10
            type: 'danger',  // æç¤ºç±»åž‹
            position: ['center', [-0.42, 0]], // ä½ç½®,ç¬¬ä¸€ä¸ªå†™ä½ç½®ï¼Œè‹±æ–‡å“¦ï¼ŒåŽé¢æ˜¯åç§»ï¼Œå¦‚æžœæ˜¯1è·Ÿ-1ä¹‹é—´ä¸ºç™¾åˆ†æ¯”
            title: false, // æ ‡é¢˜
            close: '',   // éœ€ç»‘å®šå…³é—­äº‹ä»¶æ»´æŒ‰é’®
            speed: 'normal',   // é€Ÿåº¦
            isOnly: true, //æ˜¯å¦åªå‡ºçŽ°ä¸€ä¸ª
            minTop: 10, //æœ€å°Top
            onShow: function () {
            },  // æ‰“å¼€åŽå›žè°ƒ
            onClose: function () {
            }  // å…³é—­åŽå›žè°ƒ
        },

        // æç¤ºæ¡†æ¨¡ç‰ˆ
        tmpl: '<div class="alert alert-dismissable ${State}"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><h4 style="white-space: nowrap;">${Title}</h4><p>${Content}</p></div>',

        // åˆå§‹åŒ–å‡½æ•°
        init: function (msg, options) {
            this.options = $.extend({}, this.defaults, options);

            this.create(msg);
            this.set_css();

            this.bind_event();

            return this.alertDiv;
        },

        template: function (tmpl, data) {
            $.each(data, function (k, v) {
                tmpl = tmpl.replace('${' + k + '}', v);
            });
            return $(tmpl);
        },

        // åˆ›å»ºæç¤ºæ¡†
        create: function (msg) {
            this.alertDiv = this.template(this.tmpl, {
                State: 'alert-' + this.options.type,
                Title: this.options.title,
                Content: msg
            }).hide();
            if (!this.options.title) {
                $('h4', this.alertDiv).remove();
                $('p', this.alertDiv).css('margin-right', '15px');
            }
            if (this.options.isOnly) {
                $('body > .alert').remove();
            }
            this.alertDiv.appendTo($('body'));
        },

        // è®¾ç½®æ ·å¼
        set_css: function () {
            var alertDiv = this.alertDiv;

            // åˆå§‹åŒ–æ ·å¼
            alertDiv.css({
                'position': 'fixed',
                'z-index': 10001 + $(".alert").length
            });

            // IE6å…¼å®¹
            var ie6 = 0;
            if ($.browser && $.browser.msie && $.browser.version == '6.0') {
                alertDiv.css('position', 'absolute');
                ie6 = $(window).scrollTop();
            }

            // ä½ç½®è®¾ç½®æå–
            var position = this.options.position,
                pos_str = position[0].split('-'),
                pos = [0, 0];
            if (position.length > 1) {
                pos = position[1];
            }

            // åç§»ç™¾åˆ†æ¯”æ£€æµ‹
            if (pos[0] > -1 && pos[0] < 1) {
                pos[0] = pos[0] * $(window).height();
            }
            if (pos[1] > -1 && pos[1] < 1) {
                pos[1] = pos[1] * $(window).width();
            }


            // ä½ç½®è®¾ç½®
            for (var i in pos_str) {
                if ($.type(pos_str[i]) !== 'string') {
                    continue;
                }
                var str = pos_str[i].toLowerCase();

                if ($.inArray(str, ['left', 'right']) > -1) {
                    alertDiv.css(str, pos[1]);
                } else if ($.inArray(str, ['top', 'bottom']) > -1) {
                    alertDiv.css(str, pos[0] + ie6);
                } else {
                    alertDiv.css({
                        'top': ($(window).height() - alertDiv.outerHeight()) / 2 + pos[0] + ie6,
                        'left': ($(window).width() - alertDiv.outerWidth()) / 2 + pos[1]
                    });
                }
            }

            if (parseInt(alertDiv.css('top')) < this.options.minTop) {
                alertDiv.css('top', this.options.minTop);
            }
        },

        // ç»‘å®šäº‹ä»¶
        bind_event: function () {
            this.bind_show();
            this.bind_close();

            if ($.browser && $.browser.msie && $.browser.version == '6.0') {
                this.bind_scroll();
            }
        },

        // æ˜¾ç¤ºäº‹ä»¶
        bind_show: function () {
            var ops = this.options;
            this.alertDiv.fadeIn(ops.speed, function () {
                ops.onShow($(this));
            });
        },

        // å…³é—­äº‹ä»¶
        bind_close: function () {
            var alertDiv = this.alertDiv,
                ops = this.options,
                closeBtn = $('.close', alertDiv).add($(this.options.close, alertDiv));

            closeBtn.bind('click', function (e) {
                alertDiv.fadeOut(ops.speed, function () {
                    $(this).remove();
                    ops.onClose($(this));
                });
                e.stopPropagation();
            });

            // è‡ªåŠ¨å…³é—­ç»‘å®š
            if (this.options.autoClose) {
                var time = parseInt(this.options.closeTime / 1000);
                if (this.options.withTime) {
                    $('p', alertDiv).append('<span>...<em>' + time + '</em></span>');
                }
                var timer = setInterval(function () {
                    $('em', alertDiv).text(--time);
                    if (!time) {
                        clearInterval(timer);
                        closeBtn.trigger('click');
                    }
                }, 1000);
            }
        },

        // IE6æ»šåŠ¨è·Ÿè¸ª
        bind_scroll: function () {
            var alertDiv = this.alertDiv,
                top = alertDiv.offset().top - $(window).scrollTop();
            $(window).scroll(function () {
                alertDiv.css("top", top + $(window).scrollTop());
            })
        },

        // æ£€æµ‹æ˜¯å¦ä¸ºæ‰‹æœºæµè§ˆå™¨
        check_mobile: function () {
            var userAgent = navigator.userAgent;
            var keywords = ['Android', 'iPhone', 'iPod', 'iPad', 'Windows Phone', 'MQQBrowser'];
            for (var i in keywords) {
                if (userAgent.indexOf(keywords[i]) > -1) {
                    return keywords[i];
                }
            }
            return false;
        }
    };

    $.alert = function (msg, arg) {
        if ($.alert_ext.check_mobile()) {
            alert(msg);
            return;
        }
        if (!$.trim(msg).length) {
            return false;
        }
        if ($.type(arg) === "string") {
            arg = {
                title: arg
            }
        }
        if (arg && arg.type == 'error') {
            arg.type = 'danger';
        }
        return $.alert_ext.init(msg, arg);
    }
})(jQuery);