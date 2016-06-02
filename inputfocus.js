/*
 *输入框内容关联提示
 *fulong@jiaju.com
 *2016-05-23
*/
(function ($) {
  $.tools = $.tools || {version: '1.0'};
  $.tools.inputfocus = {
          source:null,
          targetDom:null,
          dialogId:'dialog-pannel-wrap',
          searchFun:null,
          normalizeFun:null,
          beforeShowFun:null,
          hideFun: null,
          type:'GET;',
          dataType:'json'
  };

  function inputFocus(allelem,handle,conf,fn) {
        var that = allelem,
            self = handle,
            options = conf;
        var element=  allelem;
            
        $.extend(self,{
          _init: function () {
            var that = this,
                id = options['dialogId'],
                array = [],
                tpl = self.tpl = '<div id="'+id+'" class="focusinput-wrap" style="display:none;">'+
                                    '<div class="focusinput-inner">'+
                                      '<ul class="focusinput-list" data-role="list">  </ul>'+ //<li ><a id="1"href="javascript:void(0);">abcdad1a</a></li>
                                    '</div>'+
                                  '</div>';
              
            var $wrap = this.$panel = $('#'+id);
            if ($wrap && $wrap.length) {
              
            } else {
                $('body').append( $(tpl) );
                this.$panel = $('#'+id);
            }

            if ( $.isArray(options['source']) ) {
              array = options['source'].slice();
              this.source = function( request, response ) {
                response( this._filter( array, request.term ) );
              }
            } else if (typeof options['source']  == 'string') {
                this.source = function( request, response ) {
                  if ( that.xhr ) { that.xhr.abort(); }
                  that.xhr = $.ajax({
                    url: options.source,
                    tupe:options['type'],
                    data: request,
                    dataType: options['dataType'],
                    success: function( data ) {
                      data = that._normalize(data);
                      response( data );
                    },
                    error: function() {
                      response([]);
                    }
                  });
                };
            } else if ( $.isFunction( options['source'] ) ) {
              this.source = function (request, response) {
                  options['source'].call(this, request, response);
                };
            }

          },

          //执行搜索 匹配 字符串
          _search: function( value ) {
            if($.isFunction(options['searchFun'])){  //页面调用处 传入搜索函数
              options['searchFun'].call( this, value );
            } else {
             if ( $.isArray(options['source']) || $.isFunction( options['source'] )) {  //数组 或者function
                this.source( { term: value }, this._response() );
              } else if (typeof options['source']  == 'string') {//关键词 由服务接口 url 获取
                this.source( { q: value }, this._response() );
              }
            }
          },
          //合并作用域
          _response: function() {
            return $.proxy(function( content ) {
                console.log('_response:' + JSON.stringify( content) );
                this.__response( content );
            }, this );
          },
          //数据写入页面
          __response: function (cont) {
            var a = [];
            $.each( cont, function( index, item ) {
                a.push( '<li ><a v="'+(item.value || item)+'" href="javascript:void(0);">'+(item.label || item)+'</a></li>' );
            });
            if (a.length>0) {
              this.$panel.find('[data-role=list]').html(a);
              this.show();
            } 
          },
          //初始化 ajax 返回数据
          _normalize: function _normalize( data ) {
            if(typeof data == 'string'){ data = that._toJSON(data);}
            if ( $.isFunction( options['normalizeFun'] )) { data = options['normalizeFun'].call(this, data ); }
            return data;
          },

          //toJSON:将字符串转换为JSON格式的对象
          _toJSON: function _toJSON(str) {
            try{return "JSON" in window ? JSON.parse(str) : eval("(" + str + ")");}catch(e) { return str;} 
          },

          _escapeRegex: function( value ) {
            return value.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" );
          },

          _filter: function( array, term ) {
            var matcher = new RegExp( this._escapeRegex( term ), "i" );
            return $.grep( array, function( value ) {
              return matcher.test( value.label || value.value || value );
            });
          },

          _beforeShow: function () {
            if ( $.isFunction( options['beforeShowFun'] )) { 
              options['beforeShowFun'].call(this, arguments); 
            }

          },
          show: function ( ) {
            var dom = options['targetDom'] && $(options['targetDom'])[0] || self[0];
            var xy = this.getAbsPoint( dom );
            this._beforeShow();
            this.$panel.css( {'left':xy.x + "px", 'top':(xy.y + dom.offsetHeight) + "px"} ).show();
          },
          _beforeHide: function () {
            if ( $.isFunction( options['hideFun'] )) {
             options['hideFun'].call(this, arguments);
            }
          },
          _hide: function () {
            this._beforeHide();
            this.$panel.hide();
          },
          getAbsPoint : function (e){
            var x = e.offsetLeft;
            var y = e.offsetTop;
            while(e = e.offsetParent){
              x += e.offsetLeft;
              y += e.offsetTop;
            }
            return {"x": x, "y": y};
          }

        });

         element.bind('keyup.key', function () {
            var v = $(this).val();
            if (v) { self._search( v ) }
            return false;
         });

        $('body').on('click', '#'+options['dialogId']+' li a', function () {
          var val = $(this).attr('v');
          if (val) {
            element.val( val );
            self._hide();
          }
          return false;
        }).on('click', '', function () {
          self._hide();
        });


  };

 $.fn.inputFocus=function(options,fn){
       var el = this.data('inputFocus'),
           that = this;
       if (el){return;}
        if($.isFunction(options)){
            fn = options;
            options = $.extend({}, $.tools.inputfocus);
        }else {
            options = $.extend({}, $.tools.inputfocus, options);
        }
        //console.log('this:'+JSON.stringify(this) );
        
        this.each(function(){
	        var self = $(this);
          //console.log('$this:'+ JSON.stringify( $(this) ) );
          el = new inputFocus(that, self, options, fn);
          self._init();
          self.data("inputFocus", self);
          if (typeof(fn)!='undefined' && $.isFunction(fn)) {
            fn(options, self);
          }

        });

        return el;
 };


})((typeof(jQuery) != 'undefined' && jQuery) || (typeof(Zepto) != 'undefined' && Zepto) || $);