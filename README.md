
-----------/*样式需要自定义，以下参考*/-----------------------

*{margin:0;padding:0;}
input{
    padding: 0 0 0 10px;
    height: 38px;
    line-height: 38px;
    border: solid 1px #f1f1f1;
    vertical-align: middle;
    width:222px;
}
/*-----foucus inoput----------*/
  .focusinput-wrap{
    position:absolute;
    background: #fff none repeat scroll 0 0;
    border: 1px solid #ccc;
    width: 222px;
  }
  .focusinput-wrap .focusinput-inner{
    
  }

  .focusinput-wrap .focusinput-list{
    max-height: 300px;
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
    width: 222px;
    padding: 0;
  }

  .focusinput-wrap .focusinput-list li{
    display: block;
    width: 100%;
    height: 30px;
    line-height: 30px;
    float: none;
    overflow: hidden;
  }
  .focusinput-wrap .focusinput-list li a{
    background: #fff none repeat scroll 0 0;
    color: #666;
    display: block;
    padding-left: 10px;
  }
-----------------------------------------------------------------------


-----------------------------------------------------
//依赖jquery1.6以上
$(function () {
/*
//调用方式一： 输入固定内容 数组 过滤显示相关内容
$('input').inputFocus({ 
            source: [ "c++", "java", "php", "coldfusion", "javascript", "asp", "ruby" ]
        });
*/

//调用方式二： 输入固定内容， 过滤 开头相关内容
var tags = [ "c++", "java", "php", "coldfusion", "javascript", "asp", "ruby" ];
$('#name1').inputFocus({
              source: function( request, response ) {
                  var matcher = new RegExp( "^" + this._escapeRegex( request.term ), "i" );
                  response( $.grep( tags, function( item ){
                      return matcher.test( item );
                  }) );
              } 
          });

 /*
 //调用方式三： 传入 服务路径， 动态请求api 读库显示相关内容
$('#name1').inputFocus({ 
            source:'http://jiancai.jiaju.sina.com.cn/index.php?app=Api2015&mod=Brand&act=get_auto_brand',
            dataType:'jsonp',
            targetDom:'#name',
            normalizeFun: function (ret) {
              // array
              // for Example
              // [ "c++", "java", "php", "coldfusion", "javascript", "asp", "ruby" ]
              // [{lable:'label1', value:'value1'}, {lable:'label2', value:'value2'}]
                var a = [];
                if (ret && ret.status == 1 && ret.data) {
                    var data = ret.data;
                    if (data && data.length > 0){
                        return $.map( data, function( item ) {
                            return {
                              label: item.name,
                              value: item.id
                            };
                        });
                    }
                    a = data;
                }
                return a;
            },
            searchFun: function (val) {
              this.source( { q: val }, this._response() );
            }

        });
*/

});

-----------------------------------------------------------------
<!-- 
  <center>
    <p><label>姓名</label><input id="name1" type="text" name="name" /></p>
  </center>
  <p><label>姓名</label><input id="name" type="text" name="name" /></p>


 弹框内容 静态dom
<div id="pannel-wrap" class="focus-wrap" style="display:none;">
  <div class="inner">
    <ul class="list">
      <li ><a id="1"href="javascript:void(0);">abcdad1a</a></li>
      <li ><a id="2" href="javascript:void(0);">abcdada2</a></li>
      <li ><a id="1"href="javascript:void(0);">abcdad1a</a></li>
      <li ><a id="2" href="javascript:void(0);">abcdada2</a></li>
      <li ><a id="1"href="javascript:void(0);">abcdad1a</a></li>
      <li ><a id="2" href="javascript:void(0);">abcdada2</a></li>
    </ul>
  </div>
</div>
-->
---------------------------------------------------------------------
