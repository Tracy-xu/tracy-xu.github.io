// build time:Wed Aug 17 2022 14:44:54 GMT+0800 (GMT+08:00)
var alphaDust=function(){var e=false;function t(){$(".main .post").each(function(){var e=$(this);var t=e.find(".post-header.index");var a=e.find("h1.title");var n=e.find("a.read-more");var i=function(){t.toggleClass("hover")};a.hover(i,i);n.hover(i,i)})}function a(){$("nav a").addClass("menu-active");$(".menu-bg").show();$(".menu-item").css({opacity:0});TweenLite.to(".menu-container",1,{padding:"0 40px"});TweenLite.to(".menu-bg",1,{opacity:"0.92"});TweenMax.staggerTo(".menu-item",.5,{opacity:1},.3);e=true;$(".menu-bg").hover(function(){$("nav a").toggleClass("menu-close-hover")})}function n(){$("nav a").removeClass("menu-active");TweenLite.to(".menu-bg",.5,{opacity:"0",onComplete:function(){$(".menu-bg").hide()}});TweenLite.to(".menu-container",.5,{padding:"0 100px"});$(".menu-item").css({opacity:0});e=false}function i(){$("nav a").click(function(){if(e){n()}else{a()}});$(".menu-bg").click(function(t){if(e&&t.target===this){n()}})}function r(){$(".archive-post").css({opacity:0});TweenMax.staggerTo(".archive-post",.4,{opacity:1},.15)}function c(){getSearchFile()}return{initPostHeader:t,initMenu:i,displayArchives:r,search:c}}();$(document).ready(function(){alphaDust.initPostHeader();alphaDust.initMenu();alphaDust.displayArchives();alphaDust.search()});var searchFunc=function(e,t,a){"use strict";var n="<i id='local-search-close'>×</i>";var i=document.getElementById(t);var r=document.getElementById(a);r.innerHTML=n+"<ul><span class='local-search-empty'>首次搜索，正在载入索引文件，请稍后……<span></ul>";$.ajax({url:e,dataType:"xml",success:function(e){var t=$("entry",e).map(function(){return{title:$("title",this).text(),content:$("content",this).text(),url:$("url",this).text()}}).get();r.innerHTML="";i.addEventListener("input",function(){var e='<ul class="search-result-list">';var a=this.value.trim().toLowerCase().split(/[\s\-]+/);r.innerHTML="";if(this.value.trim().length<=0){return}t.forEach(function(t){var n=true;var i=[];if(!t.title||t.title.trim()===""){t.title="Untitled"}var r=t.title.trim();var c=r.toLowerCase();var s=t.content.trim().replace(/<[^>]+>/g,"");var l=s.toLowerCase();var o=t.url;var u=-1;var h=-1;var f=-1;if(l!==""){a.forEach(function(e,t){u=c.indexOf(e);h=l.indexOf(e);if(u<0&&h<0){n=false}else{if(h<0){h=0}if(t==0){f=h}}})}else{n=false}if(n){e+="<li><a href='"+o+"' class='search-result-title' target='_blank'>"+r+"</a>";var v=s;if(f>=0){var m=f-20;var p=f+80;if(m<0){m=0}if(m==0){p=100}if(p>v.length){p=v.length}var d=v.substr(m,p);a.forEach(function(e){var t=new RegExp(e,"gi");d=d.replace(t,'<em class="search-keyword">'+e+"</em>")});e+='<p class="search-result">'+d+"...</p>"}e+="</li>"}});e+="</ul>";if(e.indexOf("<li>")===-1){return r.innerHTML=n+"<ul><span class='local-search-empty'>没有找到内容，请尝试更换检索词。<span></ul>"}r.innerHTML=n+e})}});$(document).on("click","#local-search-close",function(){$("#local-search-input").val("");$("#local-search-result").html("")})};var getSearchFile=function(){var e="/search.xml";searchFunc(e,"local-search-input","local-search-result")};
//rebuild by neat 