function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
    "SymbianOS", "Windows Phone",
    "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    } 
    return flag;
}

if(!IsPC()){
  $("body").css("width","1200px");
}


$(function(){
 //textarea 字符输入统计
 $("textarea").keyup(function(){
  var length=$(this).val().length;
  $(this).parents("div").children(".count").html(length+"/300");
  if(length>300){
   alert("内容超过300字，请适当删减！");
  }
 });
})