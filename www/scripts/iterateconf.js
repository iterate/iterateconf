!function(a){var b,c;!function(){var a={},d={};b=function(b,c,d){a[b]={deps:c,callback:d}},c=function(b){if(d[b])return d[b];d[b]={};var e=a[b];if(!e)throw new Error("Module '"+b+"' not found.");for(var f,g=e.deps,h=e.callback,i=[],j=0,k=g.length;k>j;j++)i.push("exports"===g[j]?f={}:c(g[j]));var l=h.apply(this,i);return d[b]=f||l}}();var d=TypeError,e=Object,f=function(a){if(null==a)throw d();return e(a)},g=function(){for(var a=[],b=0,c=0;c<arguments.length;c++)for(var d=f(arguments[c]),e=0;e<d.length;e++)a[b++]=d[e];return a};b("appupdate",[],function(){"use strict";var a=function(){window.applicationCache.status==window.applicationCache.UPDATEREADY&&(window.applicationCache.swapCache(),window.location.reload())},b=function(a,b){window.applicationCache&&window.applicationCache.addEventListener(a,b,!1)};window.addEventListener("load",function(){b("updateready",a)},!1)}),b("firebase",["exports"],function(a){"use strict";var b,c=[],d=new Firebase("https://iterateconf.firebaseio.com/rating"),e=new FirebaseSimpleLogin(d,function(a,d){a?console.log("Firebase error",a):d?(console.log("Got user object",d),b=d.id,c.forEach(function(a){return a(b)})):(console.log("Creating user object"),e.login("anonymous",{rememberMe:!0}))}),f=function(a){c.push(a)};window.fire=d,a.firebaseStore=d,a.onLoginStateChanged=f}),b("main",["menu","appupdate","rating"],function(){"use strict"}),b("menu",["program","scoreboard","utils"],function(a,b,c){"use strict";var d=a.roughTimeslots,e=b.showScores,f=c.onClick,g=c.removeClick,h=!1,i="160px",j={btn:document.getElementById("menu-timeslots-btn"),body:document.body,main:document.getElementById("main"),mainContent:document.getElementById("main-content"),scoreboard:document.getElementById("scoreboard"),leftMenu:null},k=function(a,b){var c=document.createElement("a");return c.href=b,c.textContent=a,c},l=function(){var a=document.createElement("nav");a.className="menu-push",a.appendChild(k("Oversikt","#section-welcome"));var b=k("Ratings","#");return f(b,function(a){a.preventDefault(),e(j.scoreboard)}),a.appendChild(b),d.forEach(function(b){a.appendChild(k(b.str,"#slot-"+b.id))}),a},m=function(a){a?f(j.main,n):g(j.main,n)},n=function(a){if(a.stopImmediatePropagation(),a.preventDefault(),h)["-webkit-","-moz-",""].forEach(function(a){j.main.style[a+"transform"]="scale(1)"}),m(!1);else{var b="translate3d("+i+", 0px, 0px)";["-webkit-","-moz-",""].forEach(function(a){j.main.style[a+"transform"]=b}),m(!0)}h=!h},o=function(){var a=l();j.body.appendChild(a),j.leftMenu=a},p=function(){f(j.btn,n)};o(),p()}),b("program",["exports"],function(a){"use strict";var b=[{str:"09:00 - 10:00",id:0},{str:"10:00 - 11:00",id:2},{str:"11:00 - 13:00",id:5},{str:"13:00 - 14:00",id:11},{str:"14:00 - 15:00",id:13},{str:"15:00 - 17:00",id:16}];a.roughTimeslots=b}),b("rating",["firebase"],function(a){"use strict";var b,c=a.firebaseStore,d=a.onLoginStateChanged,e={};d(function(a){b=a,c.child(b).once("value",f)});var f=function(a){var b=a.val();if(b){var c=e.ratings||document.querySelectorAll(".rating"),d={1:3,2:2,3:1,4:0};g(c).forEach(function(a){var c=a.dataset.talkid,e=b[c];if(e){var f=parseInt(e.votes,10),g=d[f];a.children[g].classList.add("selected")}})}},h=function(a,d){return b?void c.child(b).child(a).set({votes:d}):void console.log("Missing user id, skipping sync")},i=function(a){a.preventDefault();var b=a.target,c=b.parentElement,d=c.querySelectorAll("span");g(d).forEach(function(a){return a.classList.remove("selected")}),b.classList.add("selected");var e=b.dataset.val,f=c.dataset.talkid;console.log("rate %s on talkid %s",e,f),h(f,e)},j=function(){var a=e.ratings||document.querySelectorAll(".rating");g(a).forEach(function(a){a.addEventListener("click",i,!1)})},k=function(){j()};window.addEventListener("load",k,!1)}),b("scoreboard",["utils","firebase","exports"],function(a,b,c){"use strict";var d=a.onClick,e=a.removeClick,f=b.firebaseStore,g={},h=function(a){var b=document.getElementById("talk-"+a),c=b?b.querySelector("h2").textContent:"",d=document.createElement("strong");return d.textContent=c,d},i=function m(a){a.preventDefault(),g.container.style.display="none",e(a.target,m)},j=function(a,b){b.innerHTML="";var c=document.createElement("button");c.classList.add("close"),c.textContent="×",b.appendChild(c),d(c,i);var e=document.createElement("div");e.classList.add("scores-talks");for(var f in a){var g=h(f),j=a[f],k=j.length;if(!(3>k)){var l=j.reduce(function(a,b){return b+a},0)/k,m=document.createTextNode(" har "+k+" stemmer, med snitt på "+l.toFixed(2)+" stjerner."),n=document.createElement("p");n.appendChild(g),n.appendChild(m),e.appendChild(n)}}b.appendChild(e),b.style.display="block"},k=function(a){var b={};a.forEach(function(a){a.forEach(function(a){var c=a.name();b[c]||(b[c]=[]);var d=parseInt(a.val().votes,10);b[c].push(d)})}),j(b,g.container)},l=function(a){g.container=a,f.on("value",k)};c.showScores=l}),b("utils",["exports"],function(a){"use strict";var b="ontouchstart"in window||window.DocumentTouch&&document instanceof DocumentTouch,c=b?"touchstart":"click",d=function(a,b){a.addEventListener(c,b,!1)},e=function(a,b){a.removeEventListener(c,b,!1)};a.onClick=d,a.removeClick=e}),b("vendor/loader",[],function(){"use strict";var a,b;!function(){var c={},d={};a=function(a,b,d){c[a]={deps:b,callback:d}},b=function(a){if(d[a])return d[a];d[a]={};var e=c[a];if(!e)throw new Error("Module '"+a+"' not found.");for(var f,g=e.deps,h=e.callback,i=[],j=0,k=g.length;k>j;j++)i.push("exports"===g[j]?f={}:b(g[j]));var l=h.apply(this,i);return d[a]=f||l}}()}),a.IterateConf=c("main")}(window);