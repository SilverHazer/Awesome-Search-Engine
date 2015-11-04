(function(){
  if(window.self==window.top){
    var randomclass="searchbar"+Math.random().toString().split(".")[1];
    var printstyletag=document.createElement("style");
    printstyletag.appendChild(document.createTextNode("@media print{."+randomclass+"{display:block!important;}}"));
    document.documentElement.appendChild(printstyletag);
    chrome.storage.local.get(null,function(settings){
      var popup=(window.location.protocol=="chrome-extension:");
      if(popup){
        settings.sendsearchsuggestions=true;
        settings.maximumnumberofsearchhistorysuggestions=10;
        settings.displayhighlightbutton=false;
        settings.displayfindbuttons=false;
        settings.pinned=true;
        settings.hotkeys.show=[false,false,false,false];
      }
      if(window.location.href.search(/https?:\/\/www.google.[^\/]*\/maps/)==0){
        settings.pinned=false;
      }
      var showing=0;
      var showontextselectionoverride=false;
      var iframe;
      var searchbar;
      var cross;
      var box;
      var buttons=[];
      var images=[];
      var highlightorfindseparator;
      var findbuttonsdiv;
      var findbuttons=[];
      var textnodes;
      var optionspagelink;
      var optionspageimage;
      if(popup){
        var helpimage;
      }
      var menu;
      var options;
      var infoframe;
      var infodiv;
      var infoheader;
      var infooptionspagelink;
      var customsearchdiv;
      var customsearcherrordiv;
      var searchsuggestions=[];
      var searchhistorysuggestions=[];
      var highlightedoption=-1;
      var storedtext="";
      var searchhistory=[];
      var changedtimeout;
      var lasteventframe="top";
      var lastcustomsearch=null;
      var eventlisteners=[];
      var port=chrome.runtime.connect({
        "name":"top"
      });
      var existingtoolbarelements=(function(){
        var existingtoolbardata=[["www.facebook.com",["blueBar"],[]],["www.youtube.com",["masthead-positioner"],["appbar-guide-menu-layout"]]];
        var returnvalue=[];
        for(var i=0;i<existingtoolbardata.length;i++){
          if(window.location.hostname==existingtoolbardata[i][0]){
            for(var j=1;j<3;j++){
              for(var k=0;k<existingtoolbardata[i][j].length;k++){
                if(j==1){
                  var element=document.getElementById(existingtoolbardata[i][j][k]);
                  if(element!==null){
                    returnvalue.push(element);
                  }
                }
                else{
                  var elements=document.getElementsByClassName(existingtoolbardata[i][j][k]);
                  for(var l=0;l<elements.length;l++){
                    returnvalue.push(elements[l]);
                  }
                }
              }
            }
          }
        }
        return returnvalue;
      })();
      var fixdisplay=function(){
        searchbar.oldoffsetheight=searchbar.offsetHeight;
        if(!popup){
          port.postMessage({
            "type":"height",
            "data":searchbar.offsetHeight
          });
        }
        iframe.style.height=searchbar.offsetHeight+"px";
        if(popup){
          document.body.style.minWidth=searchbar.offsetWidth+"px";
          document.body.style.minHeight=searchbar.offsetHeight+"px";
        }
        if(settings.pinned){
          if(settings.position[0]=="top"){
            document.documentElement.style.top=searchbar.offsetHeight+"px";
            for(var i=0;i<existingtoolbarelements.length;i++){
              if(window.getComputedStyle(existingtoolbarelements[i]).getPropertyValue("position")=="fixed"){
                existingtoolbarelements[i].style.top=searchbar.offsetHeight+"px";
              }
              else{
                existingtoolbarelements[i].style.top="0px";
              }
            }
          }
          else{
            var oldscrolltop=document.body.scrollTop;
            document.documentElement.style.paddingBottom="0px";
            document.documentElement.style.paddingBottom=Math.max(0,document.documentElement.scrollHeight-Math.max(document.documentElement.clientHeight,document.documentElement.offsetHeight))+searchbar.offsetHeight+"px";
            document.body.scrollTop=oldscrolltop;
            searchbar.olddocumentElement.scrollHeight=document.documentElement.scrollHeight;
            searchbar.olddocumentElement.clientHeight=document.documentElement.clientHeight;
            searchbar.olddocumentElement.offsetHeight=document.documentElement.offsetHeight;
          }
        }
        else{
          iframe.style.width=(searchbar.offsetWidth+(popup?0:1))+"px";
        }
        if(settings.position[0]=="bottom"){
          menu.style.top="auto";
          menu.style.bottom=(searchbar.offsetHeight-box.offsetTop-2)+"px";
        }
        else{
          menu.style.top=(box.offsetTop+box.offsetHeight-1)+"px";
          menu.style.bottom="auto";
        }
        if(settings.position[1]=="right"){
          menu.style.left="auto";
          menu.style.right=(searchbar.offsetWidth-box.offsetLeft-box.offsetWidth-(settings.pinned?0:1))+"px";
        }
        else{
          menu.style.left=box.offsetLeft+"px";
          menu.style.right="auto";
        }
        menu.style.minWidth=(box.offsetWidth-6)+"px";
      };
      var fixdisplayinterval=function(){
        if(showing>0&&searchbar.oldoffsetheight!=searchbar.offsetHeight){
          fixdisplay();
        }
        window.setTimeout(fixdisplayinterval,50);
      };
      window.setTimeout(fixdisplayinterval,50);
      var fixdisplaypaddingbottominterval=function(){
        if(showing>0&&settings.pinned&&settings.position[0]=="bottom"&&(searchbar.olddocumentElement.scrollHeight!=document.documentElement.scrollHeight||searchbar.olddocumentElement.clientHeight!=document.documentElement.clientHeight||searchbar.olddocumentElement.offsetHeight!=document.documentElement.offsetHeight)){
          fixdisplay();
        }
        window.setTimeout(fixdisplaypaddingbottominterval,500);
      };
      window.setTimeout(fixdisplaypaddingbottominterval,500);
      var show=function(){
        showontextselectionoverride=false;
        iframe.style.display="block";
        searchbar.style.display="block";
        if(settings.pinned&&settings.position[0]=="top"){
          document.documentElement.style.position="relative";
        }
        iframe.style.width = "100%";
        window.setTimeout(fixdisplay,1);
      };
      var hide=function(){
        showing=0;
        if(popup){
          port.postMessage({
            "type":"lastsearch",
            "data":[storedtext,showing,buttons[1].highlighting]
          });
          window.close();
        }
        iframe.style.display="none";
        searchbar.style.display="none";
        if(settings.pinned){
          if(settings.position[0]=="top"){
            document.documentElement.style.position="static";
            document.documentElement.style.top="0px";
            for(var i=0;i<existingtoolbarelements.length;i++){
              existingtoolbarelements[i].style.top="0px";
            }
          }
          else{
            document.documentElement.style.paddingBottom="0px";
          }
        }
        resetmenu();
      };
      var resetmenu=function(){
        menu.isreset=true;
        highlightoption(-1);
        menu.style.display="none";
        searchsuggestions=[];
        searchhistorysuggestions=[];
        for(var i=0;i<options.length;i++){
          options[i].innerHTML="";
        }
      };
      var getsuggestions=function(getsearchsuggestions){
        menu.isreset=false;
        storedtext=box.value;
        highlightoption(-1);
        findbuttonsreset();
        iframe.style.width="100%";
        window.setTimeout(fixdisplay,1);
        if(getsearchsuggestions==false){
          searchsuggestions=[];
          for(var i=0;i<settings.maximumnumberofsearchsuggestions;i++){
            options[i].innerHTML="";
          }
        }
        port.postMessage({
          "type":"getsuggestions",
          "data":(getsearchsuggestions?(((window.location.protocol=="https:")?"https:":"http:")+"//www.google"+settings.searchsuggestionslocale+"/complete/search?client=hp&q="+encodeURIComponent(box.value.substring(0,100))):false)
        });
      };
      var highlightoption=function(n){
        highlightedoption=n;
        for(var i=0;i<options.length;i++){
         options[i].style.backgroundColor = "#FE2E2E";
        }
        if(n!=-1){
          options[n].style.backgroundColor="#f4f4f4";
        }
      };
      var addEventListenerToAllFrames=function(searchbariframes,eventname,listener){
        eventlisteners.push([eventname,(function(eventname){
          return function(event){
            window.setTimeout((function(eventname){
              return function(){
                lasteventframe="top";
                event.selection=document.getSelection().toString().replace(/\n/g," ").substr(0,65535);
                event.activetag=(document.activeElement?document.activeElement:event.target).tagName.toLowerCase();
                event.customsearch=eventname=="contextmenu"?getcustomsearch(event.target):null;
                listener(event);
              };
            })(eventname),0);
          };
        })(eventname)]);
        window.addEventListener(eventlisteners[eventlisteners.length-1][0],eventlisteners[eventlisteners.length-1][1]);
        if(searchbariframes){
          iframe.contentDocument.addEventListener(eventname,function(event){
            listener(event);
          });
          infoframe.contentDocument.addEventListener(eventname,function(event){
            listener(event);
          });
        }
        port.onMessage.addListener(function(message){
          if(message.type=="event"){
            lasteventframe=message.frameid;
            if(message.data[0]==eventname){
              listener(message.data[1]);
            }
          }
        });
      };
      var focusonlasteventframe=function(){
        if(lasteventframe=="top"){
          window.focus();
        }
        else{
          port.postMessage({
            "type":"focus",
            "frameid":lasteventframe
          });
        }
      };
      var highlightsearchtermsinallframes=function(searchterms){
        highlightsearchterms(searchterms);
        port.postMessage({
          "type":"highlight",
          "data":searchterms
        });
      };
      var unhighlightsearchtermsinallframes=function(){
        unhighlightsearchterms();
        port.postMessage({
          "type":"unhighlight"
        });
      };
      var findinlasteventframe=function(searchterm,findprevious){
        if(lasteventframe=="top"){
          window.find(searchterm,false,findprevious,true,false,false,false);
        }
        else{
          port.postMessage({
            "type":"find",
            "frameid":lasteventframe,
            "data":[searchterm,findprevious]
          });
        }
      };
      var cssreset=function(object){
        object.style.border="0px";
        object.style.margin="0px";
        object.style.padding="0px";
        object.style.outline="0px";
        object.style.verticalAlign="baseline";
      };
      var removeleadingandtrailingwhitespace=function(text){
        return text.replace(/^\s+|\s+$/g,"");
      };
      var keycodetotext=function(keycode){
        var lookup=[];
        lookup[8]="Backspace";
        lookup[9]="Tab";
        lookup[13]="Enter";
        lookup[16]="Shift";
        lookup[17]="Ctrl";
        lookup[18]="Alt";
        lookup[19]="PauseBreak";
        lookup[20]="CapsLock";
        lookup[27]="Esc";
        lookup[32]="Space";
        lookup[33]="PageUp";
        lookup[34]="PageDown";
        lookup[35]="End";
        lookup[36]="Home";
        lookup[37]="Left";
        lookup[38]="Up";
        lookup[39]="Right";
        lookup[40]="Down";
        lookup[44]="PrintScreen";
        lookup[45]="Insert";
        lookup[46]="Delete";
        lookup[96]="Num0";
        lookup[97]="Num1";
        lookup[98]="Num2";
        lookup[99]="Num3";
        lookup[100]="Num4";
        lookup[101]="Num5";
        lookup[102]="Num6";
        lookup[103]="Num7";
        lookup[104]="Num8";
        lookup[105]="Num9";
        lookup[106]="Num*";
        lookup[107]="Num+";
        lookup[109]="Num-";
        lookup[110]="Num.";
        lookup[111]="Num/";
        lookup[112]="F1";
        lookup[113]="F2";
        lookup[114]="F3";
        lookup[115]="F4";
        lookup[116]="F5";
        lookup[117]="F6";
        lookup[118]="F7";
        lookup[119]="F8";
        lookup[120]="F9";
        lookup[121]="F10";
        lookup[122]="F11";
        lookup[123]="F12";
        lookup[144]="NumLock";
        lookup[145]="ScrollLock";
        lookup[186]=";";
        lookup[187]="=";
        lookup[188]=",";
        lookup[189]="-";
        lookup[190]=".";
        lookup[191]="/";
        lookup[219]="[";
        lookup[220]="\\";
        lookup[221]="]";
        if(keycode===false){
          return "";
        }
        else if((keycode>=48&&keycode<=57)||(keycode>=65&&keycode<=90)){
          return String.fromCharCode(keycode);
        }
        else if(typeof(lookup[keycode])=="undefined"){
          return "[keyCode:"+keycode.toString()+"]";
        }
        else{
          return lookup[keycode];
        }
      };
      var hotkeytotext=function(hotkey){
        return hotkey[0]===false?"":(hotkey[1]?"Alt+":"")+(hotkey[2]?"Ctrl+":"")+(hotkey[3]?"Shift+":"")+keycodetotext(hotkey[0]);
      };
      var getimagedata=function(fileinput,callback){
        if(fileinput.files.length>0){  
          var reader=new FileReader();
          reader.onload=function(event){
            var imagedata=event.target.result;
            if(imagedata.length>0){
              if(imagedata.indexOf("data:image")!=0){
                alert("That is not an image file.");
              }
              else if(imagedata.length>65535){
                alert("That file is too big. The maximum permitted file size is "+(65535-23)*0.75+" bytes.");
              }
              else{
                callback(imagedata);
              }
            }
          };
          reader.readAsDataURL(fileinput.files[0]);
        }
      };
      var gettopost=function(address,postparameters,nojs){
        function p(a,s){
          var f=document.createElement("form");
          f.action=a;
          f.method="post";
          s=s.split("&");
          for(var j=0;j<s.length;j++){
            s[j]=(s[j]+"=").split("=");
            if(s[j][0].length>0){
              var i=document.createElement("input");
              i.type="hidden";
              i.name=decodeURIComponent(s[j][0]);
              i.value=decodeURIComponent(s[j][1]);
              f.appendChild(i);
            }
          }
          f.submit();
        }
        var javascript=p.toString().replace(/(\r|\n|  )/g,"")+";p(\""+address.replace(/[\\"']/g,"\\$&").replace(/\u0000/g,"\\0")+"\",\""+postparameters.replace(/[\\"']/g,"\\$&").replace(/\u0000/g,"\\0")+"\");";
        if(nojs){
          return "data:text/html;charset=utf8,<!DOCTYE html><html><title>Redirecting...</title><head></head><body><script>document.title=\"\";"+javascript+"</script></body></html>";
        }
        else{
          return "javascript:void((function(){"+javascript+"})())";
        }
      };
      iframe=document.createElement("iframe");
      iframe.className=randomclass;
      iframe.src="about:blank";
      iframe.scrolling="no";
      cssreset(iframe);
      iframe.style.display="none";
      iframe.style.position="fixed";
      iframe.style.zIndex="2147483646";
      document.body.appendChild(iframe);
      iframe.contentDocument.open("text/html","replace");
      iframe.contentDocument.write("<!DOCTYPE html><html><head></head><body></body></html>");
      iframe.contentDocument.close();
      iframe.contentDocument.body.style.WebkitBackfaceVisibility="hidden";
      searchbar=document.createElement("div");
      cssreset(searchbar);
      searchbar.style.display="none";
      searchbar.style.position="fixed";
      searchbar.style.height="auto";
      searchbar.style.zIndex="2147483646";
      searchbar.style.padding="3px";
      searchbar.style.backgroundColor = "transparent";
      searchbar.style.color="#b0b0b0";
      searchbar.style.cursor="default";
      searchbar.oldoffsetheight=0;
      searchbar.olddocumentElement={
        "scrollHeight":0,
        "clientHeight":0,
        "offsetHeight":0
      };
      cross=document.createElement("button");
      images[0]=document.createElement("img");
      images[0].src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1gcHCyMfGLAkTgAAAppJREFUOMuVk0+LFFcUxX9V9aq63lhdXWVbTlrtDExpixsRe6Fgh2yCy3yCTAhGMTERQaMYNy7cuFARXLjwD6JrF4K4SPINzHJIoskMaMCJSXom092jVne9d7PoYaIEBO/m3LM498K55zpAAMSr+C41BHoKSM9XK59HjrPfdWh6MP02lYF5K/w+EPnudL+4oQAncpz9Hx+c+TDZWAdjwRrEGhDzX2/GXKydXvprcfrB3e8BbirAeg5b0qlNlH8/o+w+w1pBRLDWYldxzIVKLSHdnFHPki30/rBuu932XMjxPcyrJST0iQ+fwd3cxDDEyBCvOUX967PYiZCVlWUIFRVdydvttud2Oh0fQBBEIP70JOGufdRPXMRvbsV/fxvvnbrMut0fsPHgt5hyBGJBhE6n46tWqzV23xqsWHr3b1PfthN3IiI7cQkAdyLCvBiweO/W2ElrAWi1WoHK87zyBLD9lxRPuoxm53n19ACbLlzHq8Zj5/s95o59xsv5xxgRTL0BIuR5XnGzLAsBzNKA0UrBaFBgivJ/57NDw2hQUA4Kym4fKQ1ZloVukiQaQIYjrBX8fDvNK7fwqjGm38P0e3jVmK1X76BbO7ACUgyRUUmSJNqNokiveWAtGw58tSb+7cgMv345Q9nvoaoxjUNHERGwBkSIokgrrfUbA56eO02T8yxcu8KLxz8jIjw6/AmNQ0eZO3sKT3mrIQOttVZKKe1XqwtiTUOn6+n/+Zy5b46snVVEGPzyE4+Of4Ef+NTSGIxBQr2glNIqCIKwkqTdf7qLjVqaMlGLxxusQcxrUX4t0su9AUM/7AZBECrATu7ZO/vwx4dusbRYHy4vT77tmYJa7XklXd+d3LN3FrCOiEwBHwHr3vGdV4Af/gXVzUVdmatoKQAAAABJRU5ErkJggg==";
      cross.appendChild(images[0]);
      cross.addEventListener("click",function(){
        if(showing==2){
          showontextselectionoverride=true;
        }
        hide();
        focusonlasteventframe();
      });
      box=document.createElement("input");
      box.type="text";
      box.autocomplete="off";
      box.style.display="inline-block";
      box.style.margin="1px 3px";
      box.style.padding="2px";
      box.style.outline="none";
      box.style.verticalAlign="baseline";
      box.style.direction="initial";
      box.isfocused=0;
      box.addEventListener("keydown",function(event){
        box.isfocused=2;
        if(settings.escfromanywhere==false&&event.keyCode==settings.hotkeys.hide[0]&&event.keyCode>0&&event.altKey==settings.hotkeys.hide[1]&&event.ctrlKey==settings.hotkeys.hide[2]&&event.shiftKey==settings.hotkeys.hide[3]){
          box.blur();
          if(showing==2){
            showontextselectionoverride=true;
          }
          hide();
          focusonlasteventframe();
        }
        else if((event.keyCode==38||event.keyCode==40)&&event.altKey==false&&event.ctrlKey==false&&event.shiftKey==false){
          event.preventDefault();
        }
      });
      box.addEventListener("keyup",function(event){
        box.isfocused=2;
        if(event.keyCode==8||(event.keyCode>=32&&event.keyCode<=37)||event.keyCode==39||event.keyCode==45||event.keyCode==46||(event.keyCode>=48&&event.keyCode<=57)||(event.keyCode>=65&&event.keyCode<=90)||(event.keyCode>=96&&event.keyCode<=111&&event.keyCode!=108)||(event.keyCode>=186&&event.keyCode<=192)||(event.keyCode>=219&&event.keyCode<=223)||event.keyCode==13||((event.keyCode==38||event.keyCode==40)&&menu.isreset==true)){
          getsuggestions(settings.sendsearchsuggestions);
        }
        else if(event.keyCode==38||event.keyCode==40){
          if(event.altKey||event.ctrlKey||event.shiftKey){
            if(event.keyCode==38){
              if(highlightedoption==-1){
                if(searchhistorysuggestions.length>0){
                  highlightedoption=settings.maximumnumberofsearchsuggestions;
                }
                else if(searchsuggestions.length>0){
                  highlightedoption=0;
                }
              }
              else if(highlightedoption<settings.maximumnumberofsearchsuggestions){
                highlightedoption=-1;
              }
              else{
                if(searchsuggestions.length>0){
                  highlightedoption=0;
                }
                else{
                  highlightedoption=-1;
                }
              }
            }
            else{
              if(highlightedoption==-1){
                if(searchsuggestions.length>0){
                  highlightedoption=0;
                }
                else if(searchhistorysuggestions.length>0){
                  highlightedoption=settings.maximumnumberofsearchsuggestions;
                }
              }
              else if(highlightedoption<settings.maximumnumberofsearchsuggestions){
                if(searchhistorysuggestions.length>0){
                  highlightedoption=settings.maximumnumberofsearchsuggestions;
                }
                else{
                  highlightedoption=-1;
                }
              }
              else{
                highlightedoption=-1;
              }
            }
          }
          else{
            if(event.keyCode==38){
              highlightedoption--;
              if(highlightedoption==-2){
                highlightedoption=settings.maximumnumberofsearchsuggestions+searchhistorysuggestions.length-1;
              }
              if(highlightedoption==settings.maximumnumberofsearchsuggestions-1){
                highlightedoption=searchsuggestions.length-1;
              }
            }
            else{
              highlightedoption++;
              if(highlightedoption==searchsuggestions.length){
                highlightedoption=settings.maximumnumberofsearchsuggestions;
              }
              if(highlightedoption==settings.maximumnumberofsearchsuggestions+searchhistorysuggestions.length){
                highlightedoption=-1;
              }
            }
          }
          highlightoption(highlightedoption);
          if(highlightedoption==-1){
            box.value=storedtext;
          }
          else{
            box.value=searchsuggestions.concat(new Array(settings.maximumnumberofsearchsuggestions-searchsuggestions.length),searchhistorysuggestions)[highlightedoption];
          }
        }
      });
      box.addEventListener("focus",function(){
        box.isfocused=1;
        box.select();
      });
      box.addEventListener("mouseup",function(event){
        if(box.isfocused==1){
          event.preventDefault();
        }
        else{
          getsuggestions(settings.sendsearchsuggestions);
        }
        box.isfocused=2;
      });
      box.addEventListener("blur",function(){
        iframe.contentDocument.getSelection().removeAllRanges();
        box.isfocused=0;
        resetmenu();
      });
      buttons[0]=cross;
      var createbutton=function(buttonid,enabled,hotkey,title,imgsrc,site,searchstring){
        buttons[buttonid]=document.createElement("button");
        buttons[buttonid].title=title;
        images[buttonid]=document.createElement("img");
        images[buttonid].alt=title;
        buttons[buttonid].appendChild(images[buttonid]);
        if(enabled){
          if(settings.imageproxy&&window.location.protocol=="https:"&&imgsrc.indexOf("http://")==0){
            images[buttonid].proxy=true;
            images[buttonid].addEventListener("error",(function(image,imgsrc){
              return function(){
                if(image.src!=imgsrc&&image.proxy){
                  image.proxy=false;
                  image.src=imgsrc;
                }
              };
            })(images[buttonid],imgsrc));
            images[buttonid].src="https://images.weserv.nl/?url="+encodeURIComponent(imgsrc.substr(7));
          }
          else{
            images[buttonid].src=imgsrc;
          }
          buttons[buttonid].clickfunction=(function(site,searchstring){
            return function(text,ctrlKey,shiftKey){
              if(ctrlKey&&shiftKey&&settings.showingremember==false){
                hide();
              }
              storedtext=box.value;
              if(box.value==""){
                searchstring=site;
              }
              var searchstringquestionmarklocation=searchstring.indexOf("?");
              if(searchstringquestionmarklocation!=-1&&searchstring.search(/https?:\/\//)==0){
                var searchstringbeforequestionmark=searchstring.substr(0,searchstringquestionmarklocation);
                var searchstringfromquestionmark=searchstring.substr(searchstringquestionmarklocation);
              }
              else{
                var searchstringbeforequestionmark=searchstring;
                var searchstringfromquestionmark="";
              }
              var address=searchstringbeforequestionmark.replace(/%h/g,window.location.hostname).replace(/%u/g,window.location.href).replace(/%s/g,text)+searchstringfromquestionmark.replace(/%h/g,encodeURIComponent(window.location.hostname)).replace(/%u/g,encodeURIComponent(window.location.href)).replace(/%s/g,encodeURIComponent(text));
              var addressdoublequestionmarklocation=address.indexOf("??");
              if(addressdoublequestionmarklocation!=-1){
                var addressafterdoublequestionmark=address.substr(addressdoublequestionmarklocation+2);
                var postparametersendlocation=addressafterdoublequestionmark.search(/(\?|#)/);
                if(postparametersendlocation!=-1){
                  var postparameters=addressafterdoublequestionmark.substr(0,postparametersendlocation);
                  var addressafterpostparameters=addressafterdoublequestionmark.substr(postparametersendlocation);
                }
                else{
                  var postparameters=addressafterdoublequestionmark;
                  var addressafterpostparameters="";
                }
                address=address.substr(0,addressdoublequestionmarklocation)+addressafterpostparameters;
                address=gettopost(address,postparameters,popup&&(!ctrlKey));
              }
              port.postMessage({
                "type":"search",
                "data":[address,ctrlKey,shiftKey,popup],
                "lastsearch":[text,showing,buttons[1].highlighting],
                "disablesearchhistory":settings.disablesearchhistory
              });
            };
          })(site,searchstring);
          buttons[buttonid].addEventListener("click",(function(buttonid){
            return function(event){
              buttons[buttonid].clickfunction(box.value,event.ctrlKey||(event.button==1)||settings.alwaysnewtab,event.shiftKey||settings.alwaysforegroundtab);
            };
          })(buttonid));
          buttons[buttonid].hotkeyfunction=(function(buttonid,hotkey){
            return function(event,text){
              var currenttab=((event.keyCode==hotkey[0][0])&&event.keyCode>0&&event.altKey==hotkey[0][1]&&event.ctrlKey==hotkey[0][2]&&event.shiftKey==hotkey[0][3]);
              var newbackgroundtab=((event.keyCode==hotkey[1][0])&&event.keyCode>0&&event.altKey==hotkey[1][1]&&event.ctrlKey==hotkey[1][2]&&event.shiftKey==hotkey[1][3]);
              var newforegroundtab=((event.keyCode==hotkey[2][0])&&event.keyCode>0&&event.altKey==hotkey[2][1]&&event.ctrlKey==hotkey[2][2]&&event.shiftKey==hotkey[2][3]);
              if(currenttab||newforegroundtab||newbackgroundtab){
                if(box.isfocused>0){
                  event.preventDefault();
                }
                buttons[buttonid].clickfunction(text,newforegroundtab||newbackgroundtab,newforegroundtab);
              }
            };
          })(buttonid,hotkey);
        }
      };
      box.addEventListener("keydown",function(event){
        for(var i=0;i<settings.custombuttons.length;i++){
          if(settings.custombuttons[i][0]){
            buttons[i+2].hotkeyfunction(event,box.value);
          }
        }
      });
      addEventListenerToAllFrames(false,"keydown",function(event){
        if(settings.removewhitespace){
          event.selection=removeleadingandtrailingwhitespace(event.selection);
        }
        for(var i=0;i<settings.custombuttons.length;i++){
          if(settings.custombuttons[i][0]&&event.selection!=""){
            buttons[i+2].hotkeyfunction(event,event.selection);
          }
        }
      });
      box.addEventListener("keydown",function(event){
        if(event.keyCode==13&&settings.custombuttons.length>0&&settings.custombuttons[0][0]){
          buttons[2].clickfunction(box.value,event.ctrlKey||settings.alwaysnewtab,event.shiftKey||settings.alwaysforegroundtab);
        }
      });
      highlightorfindseparator=document.createElement("span");
      cssreset(highlightorfindseparator);
      highlightorfindseparator.appendChild(document.createTextNode(" | "));
      var getwords=function(string){
        var regularexpression=new RegExp("((["+numberletter+"][,\\.]["+numberletter+"])|["+wordletter+"'])+","g");
        var matches=string.match(regularexpression);
        if(matches==null){
          matches=[];
        }
        for(var i=0;i<matches.length;i++){
          matches[i]=matches[i].replace(/^'+|'+$/g,"");
          if(matches[i].length==0){
            matches.splice(i,1);
            i--;
          }
        }
        return matches;
      }
      var getsearchterms=function(search){
        var returnvalue=[[],[]];
        search=search.split("\"");
        for(var i=0;i<search.length;i++){
          if(i%2==0||i==search.length-1){
            var searchterms=getwords(search[i]);
            if(searchterms!=null){
              for(var j=0;j<searchterms.length;j++){
                if(returnvalue[0].indexOf(searchterms[j])==-1){
                  returnvalue[0].push(searchterms[j]);
                  if((new RegExp("["+cjkletter+"]")).test(searchterms[j])){
                    returnvalue[1].push("cjkword");
                  }
                  else{
                    returnvalue[1].push("word");
                  }
                }
              }
            }
          }
          else{
            if(search[i].length>0&&returnvalue[0].indexOf(search[i])==-1){
              returnvalue[0].push(search[i]);
              returnvalue[1].push("phrase");
            }
          }
        }
        return returnvalue;
      };
      buttons[1]=document.createElement("button");
      buttons[1].highlighting="";
      images[1]=document.createElement("img");
      images[1].offsrc="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAHdElNRQfcCRsXDhJXcy0oAAAA8klEQVQoz23QMS9DURjG8d+5mlI0pDqIjQ8gEhGLkc5GH86nMTTpoEREDEgEW3WRDpXe+xp6W9V6z3KS53/+ed4jLJ5OPMbknsL8XEeusGo/YRG4jVyuQHKcyP7G96WaMNKNOeApcqEwttaN/AFeYqCYxisyD7PAW3wp5CVQsa6t9Qv047OMx/UarpzaSVTgK15LeQGa7hzYSyaGd0vT12z6wGEauzMYqquVP7fm27PzNOmWMYwVb1ZtoGrJjYuZ1bNR9K1repI01XWcqaVfIPViIJerurLlVassNzV0Lavqa9vWczQXU2m4NLJn10nyz/wAxclsa1wEXXAAAAAASUVORK5CYII=";
      images[1].onsrc="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABzklEQVQ4jZWSy0sbURjF02ihti4ULWkRHwhGUAJ2WVBaqCDSlYgKrnSjRLtxrairtn9AacUHpQuXihsFl0EUM20y0zER4yORECwRfBRBDDLn9DMzpq0Za7q4cBnu73fuPd84SDpyWQg8InbaePN7brD2hAg8JL46iNAz/pcAeg2hPhbBA1OgOGkoLuYkwGYj8b2KCBYT3/JNgT+PxloBjcAL/lOAvW5io5bQnkp6ocD3LEE+Df0lz9Y7bxcg5hW4XtIrrPT7metD8zC10UtluslegMSYwHUCV8rbSyW9wISvVrBMJtFH/yc3TxJ6tgDH84TuFrhc4BKreaclkH30DdXJch7urmSXiLM1E9RcklRkte78ffXoAGPz9Ywps/ZjRKRFZuwxU68bv4Yj7Tz2Pac65739R7rUmol9KS/cYIFXjQscamRK7+Lq1OssOCPARZypzVGe++T90R5JbE2PC0E3U+F+KjMiOT+1F+DyJ/Fjkki8TR8+XaomtjrSbSPipTpdm2ncXnA0R8SH5fpDxF4vjfg4Q188TC42UPlQ9VfjtoLYcjuRnCAO3jPpH6Q6+4rh5Xdc/dyd1bi9QA4tjru4MFKRhrZ9H++E/ly/ANXB/kXk+RjIAAAAAElFTkSuQmCC";
      images[1].src=buttons[1].highlighting==""?images[1].offsrc:images[1].onsrc;
      buttons[1].appendChild(images[1]);
      buttons[1].clickfunction=function(search){
        storedtext=box.value;
        var searchterms=getsearchterms(search);
        if(buttons[1].highlighting!=search&&searchterms[0].length>0){
          buttons[1].highlighting=search;
          images[1].src=images[1].onsrc;
          highlightsearchtermsinallframes(searchterms);
        }
        else{
          images[1].src=images[1].offsrc;
          buttons[1].highlighting="";
          unhighlightsearchtermsinallframes();
        }
      };
      buttons[1].addEventListener("click",function(event){
        buttons[1].clickfunction(box.value);
      });
      buttons[1].hotkeyfunction=function(event){
        if(event.keyCode==settings.hotkeys.highlight[0]&&event.keyCode>0&&event.altKey==settings.hotkeys.highlight[1]&&event.ctrlKey==settings.hotkeys.highlight[2]&&event.shiftKey==settings.hotkeys.highlight[3]){
          buttons[1].clickfunction(box.value);
        }
      };
      var findbuttonimagesuffices=["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"];
      findbuttonsdiv=document.createElement("div");
      cssreset(findbuttonsdiv);
      findbuttonsdiv.style.direction="initial";
      var findbuttonsreset=function(){
        while(findbuttons.length>0){
          findbuttonsdiv.removeChild(findbuttons[0]);
          findbuttons.splice(0,1);
        }
        var searchterms=getsearchterms(box.value)[0];
        if(searchterms.length>0){
          for(var i=0;i<Math.min(settings.maximumnumberoffindbuttons,searchterms.length);i++){
            findbuttons[i]=document.createElement("button");
            findbuttons[i].title="find in page"+(i<settings.findbuttonhotkeys.length?(settings.findbuttonhotkeys[i][0][0]===false?"":(" ("+hotkeytotext(settings.findbuttonhotkeys[i][0])+")")):"");
            findbuttons[i].style.display="inline-block";
            findbuttons[i].style.height=26+settings.extrapixels+"px";
            findbuttons[i].style.width="auto";
            findbuttons[i].style.margin="1px 1px 2px 1px";
            findbuttons[i].style.padding="1px 3px 0px 3px";
            findbuttons[i].style.outline="0px";
            findbuttons[i].style.verticalAlign="baseline";
            findbuttons[i].style.font=13+settings.extrapixels+"px sans-serif";
            findbuttons[i].style.cursor="pointer";
            findbuttons[i].image=document.createElement("img");
            findbuttons[i].image.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAB"+findbuttonimagesuffices[i%findbuttonimagesuffices.length];
            findbuttons[i].image.alt=findbuttons[i].title;
            cssreset(findbuttons[i].image);
            findbuttons[i].image.style.height=16+settings.extrapixels+"px";
            findbuttons[i].image.style.width=16+settings.extrapixels+"px";
            findbuttons[i].image.style.verticalAlign=-2-settings.extrapixels/4+"px";
            findbuttons[i].appendChild(findbuttons[i].image);
            findbuttons[i].appendChild(document.createTextNode("\u00A0"+searchterms[i]));
            findbuttons[i].clickfunction=(function(searchterm){
              return function(findprevious){
                storedtext=box.value;
                findinlasteventframe(searchterm,findprevious);
              };
            })(searchterms[i]);
            findbuttons[i].addEventListener("click",(function(i){
              return function(event){
                findbuttons[i].clickfunction(event.altKey||event.ctrlKey||event.shiftKey);
              };
            })(i));
            findbuttonsdiv.appendChild(findbuttons[i]);
          }
          highlightorfindseparator.style.display=(settings.displayhighlightbutton||settings.displayfindbuttons)?"inline":"none";
        }
        else{
          highlightorfindseparator.style.display=settings.displayhighlightbutton?"inline":"none";
        }
        if(showing>0){
          iframe.style.width="100%";
          window.setTimeout(fixdisplay,1);
        }
      };
      optionspagelink=document.createElement("a");
      optionspagelink.href=chrome.extension.getURL("options.html");
      optionspagelink.addEventListener("click",function(event){
        port.postMessage({
          "type":"url",
          "url":chrome.extension.getURL("options.html"),
          "popup":popup
        });
        event.preventDefault();
      });
      optionspagelink.target="_blank";
      optionspagelink.title="Options/Help";
      optionspagelink.style.direction="initial";
      optionspagelink.separator=document.createElement("span");
      cssreset(optionspagelink.separator);
      optionspagelink.separator.appendChild(document.createTextNode(" | "));
      optionspageimage=document.createElement("img");
      optionspageimage.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAEdUlEQVQ4jYWUbWxTVRjH/+fcc2/Xrmtvu64b61i7F2hhgyEEBkgREwhGRD4gkCAExIgxvCgkfhE+YIxi/ECUDyIOhaCJH1QIJG4YCeNNwOLAjZcxBmNrR9+7tWu7vtzeWz8oS4EFnuRJnic55/eck/8/D8FzYtGyreuqbNXbFUniPJ7BnRfaDpx71nn2PKDBIC5RieWzi3iGUDC0FMAzgbSwWbbmw1Vvbd171uncVgYAixbtYTq9pi6VkiDlFGi1mgbs2UMBYMnybS9tfO9T19IVO5yFDPKoeHn5ltUb169sMZSW6u509w52XOu8PH3a1LlDo/nK4NAoxzMeJh3LjgyH+gK+YM8ku92pcBojk0ceujo6V585sf/SY1/mZKlblhVZzilwTJlUNaNpyqpT528jGkuiiBdACDCSzAsqbYVjxuw6x1A0CTVPkYlnRhNU7hnjPCr6ejuCQvFEcebMxvn5PIisKJAlGfF4GjzjIDAGgXHgKEU2K0PFGLQqeeRGV9e77cf2d44rSjabjfOMQlaAXE5GIBiD3WaGLI0mOI5y4NTqQCgOSggoIVDxHE+JUlTI4AqbdzZ/cMBimVBOAPT2BWEu1aSuXnEddF24su5m960W5GWxwVHbkM0oVGAc7PUW3u/3W4rFmvaB+9eiAEDWbNy1c17zC2+KupIyi6ViAghjwXAc6bSErs7rJ7/6YvuKwqEf7z1ywWGfugB5oMpigMcbgd8biI+mEmHX39f306rKSmfT9MaZJnPFxGA4zQLBEXg8Q9AUMTzod1950mcP7rm7TEYtbNUmuN1DSMYk6LTGksm1jhqxRF/PvD5f7Po/t8MCrzEKKjVNJDIoEngwylBmNFifBNpqLVUVZj3u9viRy8go1nCK1+8NRCJSJJNJuwkALF68WS+UkDlzZ7/YYjZXWwkAnudAadp7/ETbqhO/7LsEAOs27X59w9qVR3VanX6gPwKecejq7uw81do27/Lln1NjKp8+/W0MwB/WqpoO+ySHNZ2SQAmBRmOoXL/2jdZXljj7OUqpzWqtqywv0wwPJVEk8FCrGQYGPRcfwZ6yzUC/77DUnHhNLWgFSgggAxxV6avLa5sIAXKjQCYlgREKtcCDEkWR07nIuLaZNWszv8DZeMRe57BSQqAS2JihGSVglENxsQqiQQOecZAlBTzliWjUTqaK+Fv3XVcYKFgO1jrdroXNc+fwhIKQbKbn/i2fVsNDp1VBLQhQq3gIjCEaied/bz9779a92w95FYc6q9VcbCrd8tQLeU57lTB+YU6RhOOtJ/cd/u7LTwLDSSUaixpmTGswIg+4bnT4D/34w/cHD322u6e3tzVPVE037/Tc+Obrj94GkHvSEdBXVxtstlkOADUAGgE0L311Q8tf53rzHecf5He8//mfAOYDaAJQD7XaAlEUC7V4TJSY2z0cgzsJQA0gBSARDHrPDHp9m0wmI/WFw30AAgDSAFJIpf7LghhvY2f/zxgA1NeInp9+PZZRFJIPhaIXAYTGuTMW/wLs+r0RwXE/QAAAAABJRU5ErkJggg==";
      optionspageimage.alt=optionspagelink.title;
      optionspageimage.style.display="inline-block";
      cssreset(optionspageimage);
      optionspageimage.style.margin="0px 1px 0px 1px";
      optionspagelink.appendChild(optionspageimage);
      searchbar.appendChild(cross);
      searchbar.appendChild(box);
      searchbar.appendChild(highlightorfindseparator);
      searchbar.appendChild(buttons[1]);
      searchbar.appendChild(findbuttonsdiv);
      searchbar.appendChild(optionspagelink.separator);
      searchbar.appendChild(optionspagelink);
      if(popup){
        helpimage=document.createElement("img");
        helpimage.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAEMUlEQVQ4ja2UWWzUVRSHv3v/23RKoVNmOrR0aqEUqC0FGQQEWa0ajBZUINEHCCZGEo0+GYIxWlyi6AuJQQIxEJA0URIRQhGKSsWAQgMl4sKwRbrQWTot7bRjmfkvPsy0URoSHzzJzX0453755Zzzu/A/h7hXYlrd1jwEG2ZVBmpLCsf5ADq7+yMXfu/4Vtj23tDhTYn/Bqyvl8s7ij5aVxd8oXbeFI+Ukkh8AIAJ3jGYls33LTd69hw8t7s5EN5Efb19T6D/sY9zVy0qP16/sXbhL9cifHHiEtc7e1GkRIhMdfnEAtbWVlM12cc7u7778avmaysiTa8Pjgau+VLZUCVOfvjqikXbGs7w06V2NE1FUxWklEgpcBwH23YwLYuFNQE2PvMgb3zyzQ+fvb16GQgHQBnmBWct+mD75lXPb2s4Q8sft8gxdAo8uTxccx9Lg2XMvb+E0qJ8wj1JANoifbSH+3jtuQVlZyK7lVuXjp4cAU6r25r34rPz9iaSKfehUyFyXDoul876J2pYs6yCyjIvFYECqieNZ2ZFIRevxjFtm85oPwH/WMqKPZU3uwM7Yn82pySAJcS6lUurvI2nr2DoKoau4jJ0pCK53pWg6Xw7LaEYQggmjnezsKYEl6Gj6xpNZ2/w1JJKX9rjXg+gAgSnFz2uqQpt4X7cOQa6pqHrKsfO3URKBU1TWDyzBMdxEEKQshwMXcO2bdqj/bg0lbmVpbVXDrJdBSj25XtjvYMoikRVMwBdVxFS4nJpzJk+gSUzirBtmxvhAa7e6kPXVUzLQk1bxG4nKSoc6x9RiMzMW5ESRZEoioKqKGiqSn5eDkurC5FYdPakONLSkcmrmRpVya6UzAxXBeiKJmJ+zxiEFEghkFKMwMflGsQH0oDkcmcCkKiKRMmukpQCb76bcGwgMqyNC6GOppRpMbnYM8o4Ll0hz1Bw65DrUnEAJ5tzgFL/OFJpi7O/tZ0YAQrL2dd46nL3ioemYDsOtm1j2TaWZWNaNppIY4g0qZSJaZpYloVl29i2zSNzymg8HYr2DTh7R4Chw5sSexrP76wuL2T2VH8GZFqk0ia9/UmuR1NcCd8h3DPI0J00qbSFaVrMLC9kamkBnx9p3Tlsv3942REvvX+o+b2XH128/9ivXLwWJcelYxgamqqiKBLHcUibFqlUmhllXtYsn86bnx5v3rF55fJR1oMtdKjBA7Ge3mWvrJ0fmFSUT7R3kNuJoRHFZtpiQoGbpxdXML+qmHd3nfi54cDRJ4e66oZGNT8bXnS9asHaLfv3Hz3f3xVPOLHbSSfUFndCbXGnuy/phOMDTsOx1sSC1W81gBYEAoA+DLj7PzQAHzDecPuK/bNXrpobfCBYWuzzCBzR1hXrPdfSeqGj9esjVjLeBfQAMaDvXsB/bQzgzt56ttYEhoC/sse6+9HfXvyuD9R6Y2oAAAAASUVORK5CYII=";
        helpimage.alt=helpimage.title;
        helpimage.style.display="inline-block";
        cssreset(helpimage);
        helpimage.style.margin="0px 1px 0px 1px";
        helpimage.style.direction="initial";
        searchbar.appendChild(document.createTextNode(" | "));
        searchbar.appendChild(helpimage);
      }
      iframe.contentDocument.body.appendChild(searchbar);
      menu=document.createElement("bdi");
      menu.className=randomclass;
      cssreset(menu);
      menu.style.display="none";
      menu.style.position="fixed";
      menu.style.height="auto";
      menu.style.width="auto";
      menu.style.zIndex="2147483647";
      menu.style.border="1px solid #b0b0b0";
      menu.style.padding="2px";
      menu.style.background="#ffffff none";
      menu.style.maxHeight="none";
      menu.style.maxWidth="none";
      menu.style.minHeight="0px";
      menu.isreset=true;
      document.body.appendChild(menu);
      infoframe=document.createElement("iframe");
      infoframe.className=randomclass;
      infoframe.src="about:blank";
      infoframe.scrolling="no";
      cssreset(infoframe);
      infoframe.style.display="none";
      infoframe.style.position="fixed";
      infoframe.style.top="50%";
      infoframe.style.left="50%";
      infoframe.style.marginTop="-186px";
      infoframe.style.marginLeft="-202px";
      infoframe.style.zIndex="2147483645";
      infoframe.style.borderRadius="5px";
      infoframe.fixdisplay=function(){
        infoframe.style.display="block";
        infodiv.style.display="block";
        infoframe.style.width="100%";
        infoframe.style.boxShadow="none";
        customsearchdiv.trs[2].button.label.nodeValue=customsearchdiv.trs[2].button.showing?"hide advanced options":"show advanced options";
        for(var i=3;i<8;i++){
          customsearchdiv.trs[i].style.display="table-row";
        }
        window.setTimeout(function(){
          infoframe.style.marginTop=parseInt(-infodiv.offsetHeight/2,10)+"px";
          infoframe.style.marginLeft=parseInt(-infodiv.offsetWidth/2,10)+"px";
          for(var i=3;i<8;i++){
            customsearchdiv.trs[i].style.display=customsearchdiv.trs[2].button.showing?"table-row":"none";
          }
          window.setTimeout(function(){
            infoframe.style.height=infodiv.offsetHeight+"px";
            infoframe.style.width=infodiv.offsetWidth+"px";
            infoframe.style.boxShadow="3px 3px 6px #888888";
          },0);
        },0);
      };
      document.body.appendChild(infoframe);
      infoframe.contentDocument.open("text/html","replace");
      infoframe.contentDocument.write("<!DOCTYPE html><html><head></head><body></body></html>");
      infoframe.contentDocument.close();
      infoframe.contentDocument.addEventListener("keydown",function(event){
        if(event.keyCode==27){
          infoframe.style.display="none";
          infodiv.style.display="none";
          focusonlasteventframe();
        }
      });
      infodiv=document.createElement("div");
      infodiv.style.display="none";
      infodiv.style.position="fixed";
      infodiv.style.top="0px";
      infodiv.style.left="0px";
      infodiv.style.height="auto";
      infodiv.style.width="auto";
      infodiv.style.border="1px solid #bababa";
      infodiv.style.padding="3px";
      infodiv.style.zIndex="2147483645";
      infodiv.style.backgroundColor="#f0f0f0";
      infodiv.style.font="14px sans-serif";
      infodiv.style.borderRadius="5px";
      infoheader=document.createElement("h2");
      infoheader.style.margin="5px";
      infoheader.img=document.createElement("img");
      infoheader.img.src="data:image/png;base64,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";
      infoheader.img.style.verticalAlign="middle";
      infoheader.appendChild(infoheader.img);
      infoheader.appendChild(document.createTextNode(" Add custom search to SearchBar"));
      infooptionspagelink=document.createElement("a");
      infooptionspagelink.href=chrome.extension.getURL("options.html")+"#customsearches";
      infooptionspagelink.addEventListener("click",function(event){
        port.postMessage({
          "type":"url",
          "url":chrome.extension.getURL("options.html")+"#customsearches",
          "popup":popup
        });
        event.preventDefault();
      });
      infooptionspagelink.target="_blank";
      infooptionspagelink.title=optionspagelink.title;
      infooptionspagelink.style.float="right";
      infooptionspagelink.img=document.createElement("img");
      infooptionspagelink.img.src=optionspageimage.src;
      infooptionspagelink.img.alt=infooptionspagelink.title;
      infooptionspagelink.img.style.display="inline-block";
      infooptionspagelink.img.style.height="20px";
      infooptionspagelink.img.style.width="20px";
      cssreset(infooptionspagelink.img);
      infooptionspagelink.img.style.margin="3px 4px 3px 4px";
      infooptionspagelink.appendChild(infooptionspagelink.img);
      customsearchdiv=document.createElement("div");
      customsearchdiv.preview=document.createElement("div");
      customsearchdiv.preview.style.margin="3px";
      customsearchdiv.preview.style.fontWeight="bold";
      customsearchdiv.preview.button=document.createElement("button");
      customsearchdiv.preview.button.style.display="inline-block";
      customsearchdiv.preview.button.style.margin="1px 1px 2px 1px";
      customsearchdiv.preview.button.style.padding="1px 3px 0px 3px";
      customsearchdiv.preview.button.style.outline="0px";
      customsearchdiv.preview.button.style.verticalAlign="baseline";
      customsearchdiv.preview.button.img=document.createElement("img");
      cssreset(customsearchdiv.preview.button.img);
      customsearchdiv.preview.button.appendChild(customsearchdiv.preview.button.img);
      customsearchdiv.preview.appendChild(document.createTextNode("Button preview: "));
      customsearchdiv.preview.appendChild(customsearchdiv.preview.button);
      customsearchdiv.table=document.createElement("table");
      customsearchdiv.table.style.borderCollapse="collapse";
      customsearchdiv.table.style.fontWeight="bold";
      customsearchdiv.trs=[];
      customsearchdiv.texts=["Description","Hotkey","","Home page URL","Search URL","Icon URI","New tab hotkey","New tab hotkey"];
      customsearchdiv.smalltexts=["","(press cross to remove)\u00A0","","","with %s in place of query","","– background tab","– foreground tab"];
      customsearchdiv.inputs=[];
      for(var i=0;i<8;i++){
        customsearchdiv.trs[i]=document.createElement("tr");
        if(i==2){
          customsearchdiv.trs[2].td=document.createElement("td");
          customsearchdiv.trs[2].td.colSpan="2";
          customsearchdiv.trs[2].button=document.createElement("button");
          customsearchdiv.trs[2].button.style.fontSize="12px";
          customsearchdiv.trs[2].button.showing=false;
          customsearchdiv.trs[2].button.label=document.createTextNode("");
          customsearchdiv.trs[2].button.appendChild(customsearchdiv.trs[2].button.label);
          customsearchdiv.trs[2].button.addEventListener("click",function(event){
            customsearchdiv.trs[2].button.showing=!customsearchdiv.trs[2].button.showing;
            infoframe.fixdisplay();
          });
          customsearchdiv.trs[2].td.appendChild(customsearchdiv.trs[2].button);
          customsearchdiv.trs[2].appendChild(customsearchdiv.trs[2].td);
        }
        else{
          customsearchdiv.trs[i].tds=[document.createElement("td"),document.createElement("td")];
          customsearchdiv.trs[i].tds[0].small=document.createElement("small");
          customsearchdiv.trs[i].tds[0].small.style.fontSize="12px";
          customsearchdiv.trs[i].tds[0].small.appendChild(document.createTextNode(customsearchdiv.smalltexts[i]));
          customsearchdiv.trs[i].tds[0].appendChild(document.createTextNode(customsearchdiv.texts[i]));
          customsearchdiv.trs[i].tds[0].appendChild(document.createElement("br"));
          customsearchdiv.trs[i].tds[0].appendChild(customsearchdiv.trs[i].tds[0].small);
          customsearchdiv.trs[i].appendChild(customsearchdiv.trs[i].tds[0]);
          customsearchdiv.inputs[i]=document.createElement("input");
          customsearchdiv.trs[i].tds[1].appendChild(customsearchdiv.inputs[i]);
          if(i==0||i==3||i==4){
            customsearchdiv.inputs[i].size=36;
          }
          else if(i==5){
            customsearchdiv.inputs[i].size=27;
            customsearchdiv.fileinputbutton=document.createElement("button");
            customsearchdiv.fileinputbutton.appendChild(document.createTextNode("upload"));
            customsearchdiv.fileinputbutton.addEventListener("click",function(){
              customsearchdiv.fileinput.click();
            });
            customsearchdiv.trs[i].tds[1].appendChild(customsearchdiv.fileinputbutton);
            customsearchdiv.fileinput=document.createElement("input");
            customsearchdiv.fileinput.type="file";
            customsearchdiv.fileinput.accept="image/*";
            customsearchdiv.fileinput.style.display="none";
            customsearchdiv.fileinput.addEventListener("change",function(){
              getimagedata(customsearchdiv.fileinput,function(imagedata){
                customsearchdiv.inputs[5].value=imagedata;
                customsearchdiv.inputs[5].changefunction();
              });
            });
            customsearchdiv.trs[i].tds[1].appendChild(customsearchdiv.fileinput);
          }
          else{
            customsearchdiv.inputs[i].size=32;
            customsearchdiv.inputs[i].hotkeyvalue=[false,false,false,false];
            customsearchdiv.inputs[i].addEventListener("keydown",(function(i){
              return function(event){
                if((event.keyCode<15||event.keyCode>18)&&event.keyCode!=9){
                  this.hotkeyvalue=[event.keyCode,event.altKey,event.ctrlKey,event.shiftKey];
                  this.value=hotkeytotext(this.hotkeyvalue);
                  if(i==1){
                    if(customsearchdiv.hotkeyautofill[0]){
                      customsearchdiv.inputs[6].hotkeyvalue=event.ctrlKey?[false,false,false,false]:[event.keyCode,event.altKey,true,event.shiftKey];
                      customsearchdiv.inputs[6].value=hotkeytotext(customsearchdiv.inputs[6].hotkeyvalue);
                    }
                    if(customsearchdiv.hotkeyautofill[1]){
                      customsearchdiv.inputs[7].hotkeyvalue=(event.ctrlKey||event.shiftKey)?[false,false,false,false]:[event.keyCode,event.altKey,true,true];
                      customsearchdiv.inputs[7].value=hotkeytotext(customsearchdiv.inputs[7].hotkeyvalue);
                    }
                  }
                  else if(i==6){
                    if(customsearchdiv.hotkeyautofill[1]){
                      customsearchdiv.inputs[7].hotkeyvalue=((!event.ctrlKey)||event.shiftKey)?[false,false,false,false]:[event.keyCode,event.altKey,true,true];
                      customsearchdiv.inputs[7].value=hotkeytotext(customsearchdiv.inputs[7].hotkeyvalue);
                    }
                    customsearchdiv.hotkeyautofill[0]=false;
                  }
                  else{
                    customsearchdiv.hotkeyautofill[1]=false;
                  }
                  event.preventDefault();
                }
              };
            })(i));
            customsearchdiv.inputs[i].cross=document.createElement("button");
            customsearchdiv.inputs[i].cross.title="remove";
            customsearchdiv.inputs[i].cross.style.height="20px";
            customsearchdiv.inputs[i].cross.style.width="20px";
            customsearchdiv.inputs[i].cross.style.padding="0px";
            customsearchdiv.inputs[i].cross.img=document.createElement("img");
            customsearchdiv.inputs[i].cross.img.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACvUlEQVQ4jW3TT08TQRgG8GdnpkuhxZaCYKEIippsuxuNKMYD6EUUDQkIHL0g8WS8izHphzAhfgETQruBCx6UpAc8GA94QIkhNhZq+Q+1tOzSndn1gC1C+hxn8kvevE9ein+Z6JDVgTN0rPOP+JQAHFRIFCD3W9jL7hq2lyiIzfLH25CsLkTOG9n+PuddqDoeBUgl/CYoxxduaU6sPWC8bpJVAKATrbLa5Tv3RRt44mahdoQkWdnKpbRreRErTRIFSH1QnuruUB97Q+0I+AOMZ7dGL1Y5M7TPR5/1RG73spY2cF4EDdSjWZKVNSMdubEv4ncBKRCUJ3s61CFPsBXCKsJ2AHZosuV8do125cT8diGttUqyQgP14EULxOdHi8TCaWM94vbSkTuX1OES5pwjm0khsf5Ld23wFzQBOFdzPLaeW9GaJVmhPj9sywKt9SFIWbjN3xA+jecySd1Z5yNRwKYAkACc63kRWy2ktVbCFFrrg+BF0BovmKe2jPcyKcylkzo2jjAA0NKWE4DTlRexlYOM1kKYQj1eCM7LeDeTwofVpE62jjFQoS4LsC0hTmBhFSFsAcc+hqWUJ4gCxNPIJu9d1oY9wfMnMbdA5SqcpVL4hziI9Bp2vFQxLeHqRjbZe+Uk3sukUMjnQGUZQnAw5kIDccLfnYPIQwPxBODQKEDcjWzyQQX8PpXUl3PZpSYqKYy5wC0LLspQT6XwomRG+g3EaWcTezV4QXnuDbWfWNhsKqlX7fARl2FPLYqC1kSguCgDFxwuicAv2eF5h3NigUwvraXNYmH/GK8mdffO0bajgF23I0Y+bm3q2/ksBOcw+SF+moemQ+1p+rkgNhvc9gzZ3RitKpps9ndKrz5VVQJwHhmIfYWpBYhQlgoH5reidXN6D4vlOp7WyepYHRmvdIn/NzXkI+ODdVBLb38BroR/wFohUYYAAAAASUVORK5CYII=";
            customsearchdiv.inputs[i].cross.img.style.verticalAlign="-3px";
            customsearchdiv.inputs[i].cross.appendChild(customsearchdiv.inputs[i].cross.img);
            customsearchdiv.inputs[i].cross.addEventListener("click",(function(i){
              return function(){
                customsearchdiv.inputs[i].hotkeyvalue=[false,false,false,false];
                customsearchdiv.inputs[i].value="";
                if(i==1){
                  if(customsearchdiv.hotkeyautofill[0]){
                    customsearchdiv.inputs[6].hotkeyvalue=[false,false,false,false];
                    customsearchdiv.inputs[6].value="";
                  }
                  if(customsearchdiv.hotkeyautofill[1]){
                    customsearchdiv.inputs[7].hotkeyvalue=[false,false,false,false];
                    customsearchdiv.inputs[7].value="";
                  }
                }
                else if(i==6){
                  if(customsearchdiv.hotkeyautofill[1]){
                    customsearchdiv.inputs[7].hotkeyvalue=[false,false,false,false];
                    customsearchdiv.inputs[7].value="";
                  }
                  customsearchdiv.hotkeyautofill[0]=false;
                }
                else{
                  customsearchdiv.hotkeyautofill[1]=false;
                }
              };
            })(i));
            customsearchdiv.trs[i].tds[1].appendChild(customsearchdiv.inputs[i].cross);
          }
          customsearchdiv.trs[i].appendChild(customsearchdiv.trs[i].tds[1]);
        }
        customsearchdiv.table.appendChild(customsearchdiv.trs[i]);
      }
      customsearchdiv.inputs[0].changefunction=function(){
        customsearchdiv.preview.button.title=this.value;
      };
      customsearchdiv.inputs[0].addEventListener("keyup",customsearchdiv.inputs[0].changefunction);
      customsearchdiv.inputs[0].addEventListener("change",customsearchdiv.inputs[0].changefunction);
      customsearchdiv.inputs[5].changefunction=function(){
        customsearchdiv.fileinput.value="";
        customsearchdiv.preview.button.img.src=this.value;
      };
      customsearchdiv.inputs[5].addEventListener("keyup",customsearchdiv.inputs[5].changefunction);
      customsearchdiv.inputs[5].addEventListener("change",customsearchdiv.inputs[5].changefunction);
      customsearchdiv.buttons=document.createElement("div");
      customsearchdiv.buttons.style.margin="3px";
      customsearchdiv.buttons.accept=document.createElement("button");
      customsearchdiv.buttons.accept.appendChild(document.createTextNode("Add to SearchBar"));
      customsearchdiv.buttons.accept.addEventListener("click",function(){
        infoframe.style.display="none";
        infodiv.style.display="none";
        focusonlasteventframe();
        port.postMessage({
          "type":"custombutton",
          "custombutton":[true,false,[customsearchdiv.inputs[1].hotkeyvalue,customsearchdiv.inputs[6].hotkeyvalue,customsearchdiv.inputs[7].hotkeyvalue],customsearchdiv.inputs[0].value,customsearchdiv.inputs[3].value,customsearchdiv.inputs[4].value],
          "i":customsearchdiv.inputs[5].value
        });
      });
      customsearchdiv.buttons.cancel=document.createElement("button");
      customsearchdiv.buttons.cancel.appendChild(document.createTextNode("Cancel"));
      customsearchdiv.buttons.cancel.addEventListener("click",function(){
        infoframe.style.display="none";
        infodiv.style.display="none";
        focusonlasteventframe();
      });
      customsearchdiv.buttons.appendChild(customsearchdiv.buttons.accept);
      customsearchdiv.buttons.appendChild(customsearchdiv.buttons.cancel);
      customsearchdiv.appendChild(customsearchdiv.preview);
      customsearchdiv.appendChild(customsearchdiv.table);
      customsearchdiv.appendChild(customsearchdiv.buttons);
      customsearcherrordiv=document.createElement("div");
      customsearcherrordiv.messages=[document.createElement("div"),document.createElement("div")];
      customsearcherrordiv.messages[0].style.margin="3px";
      customsearcherrordiv.messages[0].appendChild(document.createTextNode("SearchBar was unable to detect the settings for this custom search."));
      customsearcherrordiv.messages[0].appendChild(document.createElement("br"));
      customsearcherrordiv.messages[0].appendChild(document.createTextNode("Please wait for the page to finish loading and try again."));
      customsearcherrordiv.messages[1].style.margin="3px";
      customsearcherrordiv.messages[1].appendChild(document.createTextNode("SearchBar was unable to detect the settings for this custom search."));
      customsearcherrordiv.messages[1].appendChild(document.createElement("br"));
      customsearcherrordiv.messages[1].appendChild(document.createTextNode("It may still be possible to add this custom search manually via the options page."));
      customsearcherrordiv.button=document.createElement("button");
      customsearcherrordiv.button.style.margin="3px";
      customsearcherrordiv.button.appendChild(document.createTextNode("Close"));
      customsearcherrordiv.button.addEventListener("click",function(){
        infoframe.style.display="none";
        infodiv.style.display="none";
        focusonlasteventframe();
      });
      customsearcherrordiv.appendChild(customsearcherrordiv.messages[0]);
      customsearcherrordiv.appendChild(customsearcherrordiv.messages[1]);
      customsearcherrordiv.appendChild(customsearcherrordiv.button);
      infodiv.appendChild(infoheader);
      infodiv.appendChild(infooptionspagelink);
      infodiv.appendChild(customsearchdiv);
      infodiv.appendChild(customsearcherrordiv);
      infoframe.contentDocument.body.appendChild(infodiv);
      var init=function(){
        if(settings.position[0]=="bottom"){
          iframe.style.top="auto";
          iframe.style.bottom="0px";
          searchbar.style.top="auto";
          searchbar.style.bottom="0px";
          searchbar.style.borderTop="1px solid #bababa";
          searchbar.style.borderBottom="0px";
          if(popup){
            searchbar.style.borderTop="0px";
          }
        }
        else{
          iframe.style.top="0px";
          iframe.style.bottom="auto";
          searchbar.style.top="0px";
          searchbar.style.bottom="auto";
          searchbar.style.borderTop="0px";
          searchbar.style.borderBottom="1px solid #bababa";
          if(popup){
            searchbar.style.borderBottom="0px";
          }
        }
        if(settings.position[1]=="right"){
          iframe.style.left="auto";
          iframe.style.right="0px";
          searchbar.style.left="auto";
          searchbar.style.right="0px";
          searchbar.style.borderLeft=settings.pinned?"0px":"1px solid #bababa";
          searchbar.style.borderRight="0px";
          searchbar.style.textAlign="right";
          if(popup){
            searchbar.style.borderLeft="0px";
          }
        }
        else{
          iframe.style.left="0px";
          iframe.style.right="auto";
          searchbar.style.left="0px";
          searchbar.style.right="auto";
          searchbar.style.borderLeft="0px";
          searchbar.style.borderRight=settings.pinned?"0px":"1px solid #bababa";
          searchbar.style.textAlign="left";
          if(popup){
            searchbar.style.borderRight="0px";
          }
        }
        iframe.style.height=36+settings.extrapixels+"px";
        iframe.style.width="100%";
        searchbar.style.width=settings.pinned?"100%":"auto";
        searchbar.style.font=16+settings.extrapixels+"px sans-serif";
        searchbar.style.direction=settings.direction;
        box.style.width=250+4*settings.extrapixels+"px";
        box.style.font=16+settings.extrapixels+"px sans-serif";
        cross.title="hide SearchBar"+(settings.hotkeys.hide[0]===false?"":(" ("+hotkeytotext(settings.hotkeys.hide)+")"));
        cross.style.display=settings.displaycross?"inline-block":"none";
        images[0].alt=cross.title;
        for(var i=0;i<settings.custombuttons.length;i++){
          createbutton(i+2,settings.custombuttons[i][0],settings.custombuttons[i][2],settings.custombuttons[i][3],settings["i"+(i+1).toString()],settings.custombuttons[i][4],settings.custombuttons[i][5]);
        }
        highlightorfindseparator.style.display=settings.displayhighlightbutton?"inline":"none";
        buttons[1].title="highlight search terms"+(settings.hotkeys.highlight[0]===false?"":(" ("+hotkeytotext(settings.hotkeys.highlight)+")"));
        buttons[1].style.display=settings.displayhighlightbutton?"inline-block":"none";
        images[1].alt=buttons[1].title;
        findbuttonsdiv.style.display=settings.displayfindbuttons?"inline-block":"none";
        for(var i=0;i<buttons.length;i++){
          if(i>=2){
            buttons[i].style.display="inline-block";
          }
          buttons[i].style.height=26+settings.extrapixels+"px";
          buttons[i].style.width=26+settings.extrapixels+"px";
          buttons[i].style.margin="1px 1px 2px 1px";
          buttons[i].style.padding="1px 3px 0px 3px";
          buttons[i].style.outline="0px";
          buttons[i].style.verticalAlign="baseline";
          buttons[i].style.direction="initial";
          buttons[i].style.cursor="pointer";
          cssreset(images[i]);
          images[i].style.height=16+settings.extrapixels+"px";
          images[i].style.width=16+settings.extrapixels+"px";
          images[i].style.verticalAlign=-2-settings.extrapixels/4+"px";
        }
        optionspageimage.style.height=20+settings.extrapixels+"px";
        optionspageimage.style.width=20+settings.extrapixels+"px";
        optionspageimage.style.verticalAlign=-4-settings.extrapixels/4+"px";
        optionspagelink.style.display=settings.displayoptionspagelink?"inline":"none";
        optionspagelink.separator.style.display=settings.displayoptionspagelink?"inline":"none";
        if(popup){
          helpimage.title="This is the \"popup\" version of SearchBar designed for the New Tab page and Chrome settings pages. \n\n"+(settings.forcepopup?"It is being displayed because you have selected the \"Always show SearchBar in a popup when I press the toolbar button\" option.":"The full version is accessible from any ordinary web page. \n\nIf you are on an ordinary web page, try again after the page has finished loading.");
          helpimage.style.height=22+settings.extrapixels+"px";
          helpimage.style.width=22+settings.extrapixels+"px";
          helpimage.style.verticalAlign=-4-settings.extrapixels/4+"px";
        }
        for(var i=0;i<settings.custombuttons.length;i++){
          if(settings.custombuttons[i][0]){
            if(settings.custombuttons[i][1]){
              if(settings.separatorsaslinebreaks){
                buttons[i+2].separator=document.createElement("span");
                buttons[i+2].separator.appendChild(document.createElement("br"));
              }
              else{
                buttons[i+2].separator=document.createTextNode(" | ");
              }
              searchbar.insertBefore(buttons[i+2].separator,highlightorfindseparator);
            }
            searchbar.insertBefore(buttons[i+2],highlightorfindseparator);
          }
        }
        options=new Array(settings.maximumnumberofsearchsuggestions+settings.maximumnumberofsearchhistorysuggestions);
        for(var i=0;i<options.length;i++){
          options[i]=document.createElement("bdi");
          options[i].style.display="block";
          cssreset(options[i]);
          options[i].style.position="static";
          options[i].style.height="auto";
          options[i].style.width="auto";
          options[i].style.zIndex="2147483647";
          options[i].style.font=16+settings.extrapixels+"px sans-serif";
          options[i].style.textAlign="left";
          options[i].style.color=i<settings.maximumnumberofsearchsuggestions?"#000000":"#0000ff";
          options[i].style.background="#ffffff none";
          options[i].style.cursor="default";
          options[i].style.maxHeight="none";
          options[i].style.maxWidth="none";
          options[i].style.minHeight="0px";
          options[i].style.minWidth="0px";
          options[i].style.letterSpacing="normal";
          options[i].style.lineHeight="normal";
          options[i].style.textDecoration="none";
          options[i].style.textIndent="0";
          options[i].style.textTransform="none";
          options[i].style.wordSpacing="normal";
          options[i].style.wordWrap="normal";
          options[i].style.whiteSpace="pre";
          options[i].addEventListener("mouseover",(function(n){
            return function(){
              highlightoption(n);
            };
          })(i));
          options[i].addEventListener("mouseout",function(){
            highlightoption(-1);
          });          
          options[i].addEventListener("click",(function(n){
            return function(){
              box.value=searchsuggestions.concat(new Array(settings.maximumnumberofsearchsuggestions-searchsuggestions.length),searchhistorysuggestions)[n];
              getsuggestions(settings.sendsearchsuggestions);
            };
          })(i));
          options[i].addEventListener("mousedown",function(event){
            event.preventDefault();
          });
          menu.appendChild(options[i]);
        }
        customsearchdiv.preview.button.style.height=26+settings.extrapixels+"px";
        customsearchdiv.preview.button.style.width=26+settings.extrapixels+"px";
        customsearchdiv.preview.button.img.style.height=16+settings.extrapixels+"px";
        customsearchdiv.preview.button.img.style.width=16+settings.extrapixels+"px";
        customsearchdiv.preview.button.img.style.verticalAlign=-2-settings.extrapixels/4+"px";
        if(infoframe.style.display=="block"){
          infoframe.fixdisplay();
        }
      };
      init();
      chrome.storage.onChanged.addListener(function(changes,areaName){
        window.clearTimeout(changedtimeout);
        changedtimeout=window.setTimeout(function(){
          chrome.storage.local.get(null,function(newsettings){
            resetmenu();
            for(var i=0;i<settings.custombuttons.length;i++){
              if(settings.custombuttons[i][0]){
                if(settings.custombuttons[i][1]){
                  searchbar.removeChild(buttons[i+2].separator);
                }
                searchbar.removeChild(buttons[i+2]);
              }
            }
            for(var i=0;i<options.length;i++){
              menu.removeChild(options[i]);
            }
            settings=newsettings;
            if(popup){
              settings.sendsearchsuggestions=false;
              settings.maximumnumberofsearchhistorysuggestions=0;
              settings.displayhighlightbutton=false;
              settings.displayfindbuttons=false;
              settings.pinned=false;
              settings.hotkeys.show=[false,false,false,false];
            }
            if(window.location.href.search(/https?:\/\/www.google.[^\/]*\/maps/)==0){
              settings.pinned=false;
            }
            init();
            if(settings.pinned&&settings.position[0]=="top"&&showing>0){
              document.documentElement.style.position="relative";
            }
            else{
              document.documentElement.style.position="static";
            }
            if(!(settings.pinned&&settings.position[0]=="bottom"&&showing>0)){
              document.documentElement.style.paddingBottom="0px";
            }
            findbuttonsreset();
          });
        },100);
      });
      addEventListenerToAllFrames(true,"keydown",buttons[1].hotkeyfunction);
      addEventListenerToAllFrames(true,"keydown",function(event){
        if(event.keyCode==settings.hotkeys.show[0]&&event.keyCode>0&&event.altKey==settings.hotkeys.show[1]&&event.ctrlKey==settings.hotkeys.show[2]&&event.shiftKey==settings.hotkeys.show[3]){
          show();
          showing=1;
          box.focus();
        }
        else if(settings.escfromanywhere==true&&event.keyCode==settings.hotkeys.hide[0]&&event.keyCode>0&&event.altKey==settings.hotkeys.hide[1]&&event.ctrlKey==settings.hotkeys.hide[2]&&event.shiftKey==settings.hotkeys.hide[3]){
          if(box.isfocused>0){
            box.blur();
          }
          if(showing>0){
            if(showing==2){
              showontextselectionoverride=true;
            }
            hide();
            focusonlasteventframe();
          }
        }
        if(settings.displayfindbuttons&&showing>0){
          for(var j=0;j<2;j++){
            for(var i=0;i<Math.min(findbuttons.length,settings.findbuttonhotkeys.length);i++){
              if(event.keyCode==settings.findbuttonhotkeys[i][j][0]&&event.keyCode>0&&event.altKey==settings.findbuttonhotkeys[i][j][1]&&event.ctrlKey==settings.findbuttonhotkeys[i][j][2]&&event.shiftKey==settings.findbuttonhotkeys[i][j][3]){
                findbuttons[i].clickfunction(j==1);
                findbuttons[i].focus();
                i=findbuttons.length;
                j=2;
              }
            }
          }
        }
      });
      var selectioncheck=function(event){
        if(settings.removewhitespace){
          event.selection=removeleadingandtrailingwhitespace(event.selection);
        }
        if(box.isfocused==0){
          if(event.selection==""){
            if(showing==2){
              hide();
            }
            box.value=storedtext;
            findbuttonsreset();
          }
          else{
            box.value=event.selection;
            findbuttonsreset();
            if(settings.showontextselectionexception&&(event.activetag=="input"||event.activetag=="textarea")){
              if(showing==2){
                hide();
              }
            }
            else{
              if(settings.showontextselection&&showing==0&&showontextselectionoverride==false){
                show();
                showing=2;
              }
            }
          }
        }
      };
      addEventListenerToAllFrames(false,"keyup",selectioncheck);
      addEventListenerToAllFrames(false,"mouseup",selectioncheck);
      port.onMessage.addListener(function(message){
        if(message.type=="init"){
          storedtext=settings.searchremember?message.lastsearch[0]:"";
          if(message.lastsearch[1]&&settings.detect){
            var popuplatestrings=settings.detectprimary?[settings.custombuttons[0][5]]:settings.detectcustom;
            var numberofpopulatestrings=popuplatestrings.length;
            for(var i=0;i<numberofpopulatestrings;i++){
              if(popuplatestrings[i].indexOf("http://")==0){
                popuplatestrings.push("https://"+popuplatestrings[i].substr(7));
              }
              else if(popuplatestrings[i].indexOf("https://")==0){
                popuplatestrings.push("http://"+popuplatestrings[i].substr(8));
              }
            }
            for(var i=0;i<popuplatestrings.length;i++){
              var searchstringpattern=new RegExp(popuplatestrings[i].replace(/[\-\/\\\^\$\*\+\?\.\(\)\|\{\}\[\]]/g,"\\$&").replace(/%s/g,"([^&#]*)").replace(/%[hu]/g,"[^&#]*"));
              if(window.location.href.search(searchstringpattern)===0){
                var searchstringterms=window.location.href.match(searchstringpattern);
                searchstringterms.splice(0,1);
                if(searchstringterms.length>0){
                  searchstringterms[0]=searchstringterms[0].replace(/\+/g,"%20");
                  if(encodeURIComponent(decodeURIComponent(searchstringterms[0]))==searchstringterms[0]){
                    while(searchstringterms.length>1){
                      searchstringterms[1]=searchstringterms[1].replace(/\+/g,"%20");
                      if(searchstringterms[0]==searchstringterms[1]){
                        searchstringterms.splice(0,1);
                      }
                      else{
                        searchstringterms=[];
                      }
                    }
                    if(searchstringterms.length>0){
                      storedtext=decodeURIComponent(searchstringterms[0]);
                      i=popuplatestrings.length;
                      if(settings.detecttosearchhistory){
                        port.postMessage({
                          "type":"searchhistory",
                          "data":storedtext
                        });
                      }
                    }
                  }
                }
              }
            }
          }
          box.value=storedtext;
          findbuttonsreset();
          var inpopupwindow=window.opener!=null&&(window.menubar.visible==false||window.toolbar.visible==false);
          if((settings.showonsessionstartup&&message.lastshowing==="")||(settings.showingremember&&message.lastshowing==1&&(!inpopupwindow))||popup){
            show();
            showing=1;
          }
          if(popup){
            document.body.style.minWidth="800px";
            document.body.style.minHeight=(message.height-1)+"px";
            box.focus();
          }
          if(settings.highlightingremember){
            buttons[1].clickfunction(message.lasthighlighting);
          }
        }
        else if(message.type=="getsearchhistory"){
          if(box.isfocused>0){
            searchhistory=message.data;
            searchhistorysuggestions=[];
            for(var i=0;i<searchhistory.length&&searchhistorysuggestions.length<settings.maximumnumberofsearchhistorysuggestions;i++){
              if(searchhistory[i].toLowerCase().indexOf(box.value.toLowerCase())==0&&searchhistory[i].toLowerCase()!=box.value.toLowerCase()&&searchhistorysuggestions.indexOf(searchhistory[i])==-1){
                searchhistorysuggestions.push(searchhistory[i]);
              }
            }
            if(searchsuggestions.length==0&&searchhistorysuggestions.length==0){
              menu.style.display="none";
            }
            else{
              menu.style.display="block";
            }
            for(var i=0;i<settings.maximumnumberofsearchhistorysuggestions;i++){
              if(i<searchhistorysuggestions.length){
                options[i+settings.maximumnumberofsearchsuggestions].innerHTML="";
                var boldtext=document.createElement("bdi");
                boldtext.style.display="inline";
                cssreset(boldtext);
                boldtext.style.position="static";
                boldtext.style.height="auto";
                boldtext.style.width="auto";
                boldtext.style.zIndex="2147483647";
                boldtext.style.font=16+settings.extrapixels+"px sans-serif";
                boldtext.style.textAlign="left";
                boldtext.style.color="#0000ff";
                boldtext.style.background="transparent none";
                boldtext.style.cursor="default";
                boldtext.style.maxHeight="none";
                boldtext.style.maxWidth="none";
                boldtext.style.minHeight="0px";
                boldtext.style.minWidth="0px";
                boldtext.style.letterSpacing="normal";
                boldtext.style.lineHeight="normal";
                boldtext.style.textDecoration="none";
                boldtext.style.textIndent="0";
                boldtext.style.textTransform="none";
                boldtext.style.wordSpacing="normal";
                boldtext.style.wordWrap="normal";
                boldtext.style.whiteSpace="pre";
                boldtext.style.fontWeight="bold";
                boldtext.appendChild(document.createTextNode(searchhistorysuggestions[i].substring(box.value.length)));
                options[i+settings.maximumnumberofsearchsuggestions].appendChild(document.createTextNode(searchhistorysuggestions[i].substring(0,box.value.length)));
                options[i+settings.maximumnumberofsearchsuggestions].appendChild(boldtext);
              }
              else{
                options[i+settings.maximumnumberofsearchsuggestions].innerHTML="";
              }
            }
            if(highlightedoption>=settings.maximumnumberofsearchsuggestions){
              highlightoption(-1);
            }
          }
        }
        else if(message.type=="getsearchsuggestions"){
          if(box.isfocused>0){
            searchsuggestions=new Array(message.data[1].length);
            searchsuggestions.length=Math.min(searchsuggestions.length,settings.maximumnumberofsearchsuggestions);
            if(searchsuggestions.length==0&&searchhistorysuggestions.length==0){
              menu.style.display="none";
            }
            else{
              menu.style.display="block";
            }
            for(var i=0;i<settings.maximumnumberofsearchsuggestions;i++){
              if(i<message.data[1].length){
                options[i].innerHTML=message.data[1][i][0].replace(/<(\/?)[^>]*>/g,"<$1bdi>").replace(/<bdi>/g,"<bdi style=\"display:inline;border:0px;margin:0px;padding:0px;outline:0px;vertical-align:baseline;position:static;height:auto;width:auto;z-index:2147483647;font:"+(16+settings.extrapixels)+"px sans-serif;text-align:left;color:#000000;background:transparent none;cursor:default;max-height:none;max-width:none;min-height:0px;min-width:0px;letter-spacing:normal;line-height:normal;text-decoration:none;text-indent:0;text-transform:none;word-spacing:normal;word-wrap:normal;text-align-last:auto;white-space:pre;font-weight:bold;\">").replace(/<[^>]*$/g,"");
                searchsuggestions[i]=options[i].textContent;
              }
              else{
                options[i].innerHTML="";
              }
            }
            if(highlightedoption>=0&&highlightedoption<settings.maximumnumberofsearchsuggestions){
              highlightoption(-1);
            }
          }
        }
        else if(message.type=="browseraction"){
          if(showing==0){
            show();
            showing=1;
            box.focus();
            box.isfocused=2;
          }
          else{
            if(box.isfocused>0){
              box.blur();
            }
            if(showing==2){
              showontextselectionoverride=true;
            }
            hide();
            focusonlasteventframe();
          }
        }
        else if(message.type=="closepopup"&&popup){
          window.close();
        }
        else if(message.type=="contextmenu"){
          infoframe.fixdisplay();
          if(lastcustomsearch==null||lastcustomsearch==false){
            customsearchdiv.style.display="none";
            customsearcherrordiv.style.display="block";
            customsearcherrordiv.messages[0].style.display=(lastcustomsearch==null?"block":"none");
            customsearcherrordiv.messages[1].style.display=(lastcustomsearch==null?"none":"block");
            infoframe.contentWindow.focus();
            customsearcherrordiv.button.focus();
          }
          else{
            customsearchdiv.style.display="block";
            customsearcherrordiv.style.display="none";
            customsearchdiv.preview.button.title=lastcustomsearch[0];
            customsearchdiv.preview.button.img.src=lastcustomsearch[3];
            customsearchdiv.preview.button.img.alt=lastcustomsearch[0];
            if(lastcustomsearch[4]!=false){
              customsearchdiv.favicon=new Image();
              customsearchdiv.favicon.addEventListener("error",(function(badfavicon,googlefavicon){
                return function(){
                  if(customsearchdiv.inputs[5].value==badfavicon){
                    customsearchdiv.inputs[5].value=googlefavicon;
                    customsearchdiv.preview.button.img.src=googlefavicon;
                  }
                }
              })(lastcustomsearch[3],"https://www.google.com/s2/favicons?domain="+lastcustomsearch[4]));
              customsearchdiv.favicon.src=lastcustomsearch[3];
            }
            customsearchdiv.inputs[0].value=lastcustomsearch[0];
            customsearchdiv.inputs[1].value="";
            customsearchdiv.inputs[1].hotkeyvalue=[false,false,false,false];
            customsearchdiv.inputs[3].value=lastcustomsearch[1];
            customsearchdiv.inputs[4].value=lastcustomsearch[2];
            customsearchdiv.inputs[5].value=lastcustomsearch[3];
            customsearchdiv.inputs[6].value="";
            customsearchdiv.inputs[6].hotkeyvalue=[false,false,false,false];
            customsearchdiv.inputs[7].value="";
            customsearchdiv.inputs[7].hotkeyvalue=[false,false,false,false];
            customsearchdiv.hotkeyautofill=[true,true];
            infoframe.contentWindow.focus();
            customsearchdiv.buttons.accept.focus();
          }
        }
      });
      port.onDisconnect.addListener(function(){
        hide();
        focusonlasteventframe();
        unhighlightsearchterms();
        for(var i=0;i<eventlisteners.length;i++){
          window.removeEventListener(eventlisteners[i][0],eventlisteners[i][1]);
        }
        document.body.removeChild(iframe);
        document.body.removeChild(menu);
        document.body.removeChild(infoframe);
      });
      port.postMessage({
        "type":"init"
      });
      addEventListenerToAllFrames(true,"keydown",function(event){
        port.postMessage({
          "type":"lastsearch",
          "data":[storedtext,showing,buttons[1].highlighting]
        });
      });
      addEventListenerToAllFrames(true,"keyup",function(event){
        port.postMessage({
          "type":"lastsearch",
          "data":[storedtext,showing,buttons[1].highlighting]
        });
      });
      addEventListenerToAllFrames(true,"mousedown",function(event){
        port.postMessage({
          "type":"lastsearch",
          "data":[storedtext,showing,buttons[1].highlighting]
        });
        lastcustomsearch=false;
      });
      addEventListenerToAllFrames(false,"contextmenu",function(event){
        lastcustomsearch=event.customsearch;
      });
      window.addEventListener("beforeunload",function(event){
        port.postMessage({
          "type":"lastsearch",
          "data":[storedtext,showing,buttons[1].highlighting]
        });
      });
    });
  }
  else{
    var eventnames=["keydown","keyup","mousedown","mouseup","contextmenu"];
    var port=chrome.runtime.connect({
      "name":"frame"
    });
    for(var i=0;i<eventnames.length;i++){
      window.addEventListener(eventnames[i],(function(eventname){
        return function(event){
          window.setTimeout(function(){
            port.postMessage({
              "type":"event",
              "data":[eventname,{
                "keyCode":event.keyCode,
                "altKey":event.altKey,
                "ctrlKey":event.ctrlKey,
                "shiftKey":event.shiftKey,
                "button":event.button,
                "selection":document.getSelection().toString().replace(/\n/g," ").substr(0,65535),
                "activetag":(document.activeElement?document.activeElement:event.target).tagName.toLowerCase(),
                "customsearch":eventname=="contextmenu"?getcustomsearch(event.target):null
              }]
            });
          },0);
        };
      })(eventnames[i]));
    }
    port.onMessage.addListener(function(message){
      if(message.type=="focus"){
        window.focus();
      }
      else if(message.type=="highlight"){
        highlightsearchterms(message.data);
      }
      else if(message.type=="unhighlight"){
        unhighlightsearchterms(message.data);
      }
      else if(message.type=="find"){
        window.find(message.data[0],false,message.data[1],true,false,false,false);
      };
    });
    port.onDisconnect.addListener(function(){
      unhighlightsearchterms();
    });
  }
  var searchtermhighlightcolours=["#ffff66","#a0ffff","#99ff99","#ff9999","#ff66ff","#880000","#00aa00","#886800","#004699","#990099"];
  var searchtermtextcolours=["#000000","#000000","#000000","#000000","#000000","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"];
  var highlightingtags=[];
  var unicode={
    "expand":function(string){return string.replace(/\w{4}/g,"\\u$&")},
    "noncjkletter":"0041-005A0061-007A00AA00B500BA00C0-00D600D8-00F600F8-02C102C6-02D102E0-02E402EC02EE0370-037403760377037A-037D03860388-038A038C038E-03A103A3-03F503F7-0481048A-05270531-055605590561-058705D0-05EA05F0-05F20620-064A066E066F0671-06D306D506E506E606EE06EF06FA-06FC06FF07100712-072F074D-07A507B107CA-07EA07F407F507FA0800-0815081A082408280840-085808A008A2-08AC0904-0939093D09500958-09610971-09770979-097F0985-098C098F09900993-09A809AA-09B009B209B6-09B909BD09CE09DC09DD09DF-09E109F009F10A05-0A0A0A0F0A100A13-0A280A2A-0A300A320A330A350A360A380A390A59-0A5C0A5E0A72-0A740A85-0A8D0A8F-0A910A93-0AA80AAA-0AB00AB20AB30AB5-0AB90ABD0AD00AE00AE10B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3D0B5C0B5D0B5F-0B610B710B830B85-0B8A0B8E-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BD00C05-0C0C0C0E-0C100C12-0C280C2A-0C330C35-0C390C3D0C580C590C600C610C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBD0CDE0CE00CE10CF10CF20D05-0D0C0D0E-0D100D12-0D3A0D3D0D4E0D600D610D7A-0D7F0D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60E01-0E300E320E330E40-0E460E810E820E840E870E880E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB00EB20EB30EBD0EC0-0EC40EC60EDC-0EDF0F000F40-0F470F49-0F6C0F88-0F8C1000-102A103F1050-1055105A-105D106110651066106E-10701075-1081108E10A0-10C510C710CD10D0-10FA10FC-1248124A-124D1250-12561258125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-12C512C8-12D612D8-13101312-13151318-135A1380-138F13A0-13F41401-166C166F-167F1681-169A16A0-16EA1700-170C170E-17111720-17311740-17511760-176C176E-17701780-17B317D717DC1820-18771880-18A818AA18B0-18F51900-191C1950-196D1970-19741980-19AB19C1-19C71A00-1A161A20-1A541AA71B05-1B331B45-1B4B1B83-1BA01BAE1BAF1BBA-1BE51C00-1C231C4D-1C4F1C5A-1C7D1CE9-1CEC1CEE-1CF11CF51CF61D00-1DBF1E00-1F151F18-1F1D1F20-1F451F48-1F4D1F50-1F571F591F5B1F5D1F5F-1F7D1F80-1FB41FB6-1FBC1FBE1FC2-1FC41FC6-1FCC1FD0-1FD31FD6-1FDB1FE0-1FEC1FF2-1FF41FF6-1FFC2071207F2090-209C21022107210A-211321152119-211D212421262128212A-212D212F-2139213C-213F2145-2149214E218321842C00-2C2E2C30-2C5E2C60-2CE42CEB-2CEE2CF22CF32D00-2D252D272D2D2D30-2D672D6F2D80-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-2DC62DC8-2DCE2DD0-2DD62DD8-2DDE2E2FA500-A60CA610-A61FA62AA62BA640-A66EA67F-A697A6A0-A6E5A717-A71FA722-A788A78B-A78EA790-A793A7A0-A7AAA7F8-A801A803-A805A807-A80AA80C-A822A840-A873A882-A8B3A8F2-A8F7A8FBFB00-FB06FB13-FB17FB1DFB1F-FB28FB2A-FB36FB38-FB3CFB3EFB40FB41FB43FB44FB46-FBB1FBD3-FD3DFD50-FD8FFD92-FDC7FDF0-FDFBFE70-FE74FE76-FEFCFF21-FF3AFF41-FF5AFF66-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7FFDA-FFDC",
    "mark":"0300-036F0483-04890591-05BD05BF05C105C205C405C505C70610-061A064B-065F067006D6-06DC06DF-06E406E706E806EA-06ED07110730-074A07A6-07B007EB-07F30816-0819081B-08230825-08270829-082D0859-085B08E4-08FE0900-0903093A-093C093E-094F0951-0957096209630981-098309BC09BE-09C409C709C809CB-09CD09D709E209E30A01-0A030A3C0A3E-0A420A470A480A4B-0A4D0A510A700A710A750A81-0A830ABC0ABE-0AC50AC7-0AC90ACB-0ACD0AE20AE30B01-0B030B3C0B3E-0B440B470B480B4B-0B4D0B560B570B620B630B820BBE-0BC20BC6-0BC80BCA-0BCD0BD70C01-0C030C3E-0C440C46-0C480C4A-0C4D0C550C560C620C630C820C830CBC0CBE-0CC40CC6-0CC80CCA-0CCD0CD50CD60CE20CE30D020D030D3E-0D440D46-0D480D4A-0D4D0D570D620D630D820D830DCA0DCF-0DD40DD60DD8-0DDF0DF20DF30E310E34-0E3A0E47-0E4E0EB10EB4-0EB90EBB0EBC0EC8-0ECD0F180F190F350F370F390F3E0F3F0F71-0F840F860F870F8D-0F970F99-0FBC0FC6102B-103E1056-1059105E-10601062-10641067-106D1071-10741082-108D108F109A-109D135D-135F1712-17141732-1734175217531772177317B4-17D317DD180B-180D18A91920-192B1930-193B19B0-19C019C819C91A17-1A1B1A55-1A5E1A60-1A7C1A7F1B00-1B041B34-1B441B6B-1B731B80-1B821BA1-1BAD1BE6-1BF31C24-1C371CD0-1CD21CD4-1CE81CED1CF2-1CF41DC0-1DE61DFC-1DFF20D0-20F02CEF-2CF12D7F2DE0-2DFF302A-302F3099309AA66F-A672A674-A67DA69FA6F0A6F1A802A806A80BA823-A827A880A881A8B4-A8C4A8E0-A8F1A926-A92DA947-A953A980-A983A9B3-A9C0AA29-AA36AA43AA4CAA4DAA7BAAB0AAB2-AAB4AAB7AAB8AABEAABFAAC1AAEB-AAEFAAF5AAF6ABE3-ABEAABECABEDFB1EFE00-FE0FFE20-FE26",
    "number":"0030-003900B200B300B900BC-00BE0660-066906F0-06F907C0-07C90966-096F09E6-09EF09F4-09F90A66-0A6F0AE6-0AEF0B66-0B6F0B72-0B770BE6-0BF20C66-0C6F0C78-0C7E0CE6-0CEF0D66-0D750E50-0E590ED0-0ED90F20-0F331040-10491090-10991369-137C16EE-16F017E0-17E917F0-17F91810-18191946-194F19D0-19DA1A80-1A891A90-1A991B50-1B591BB0-1BB91C40-1C491C50-1C5920702074-20792080-20892150-21822185-21892460-249B24EA-24FF2776-27932CFD30073021-30293038-303A3192-31953220-32293248-324F3251-325F3280-328932B1-32BFA620-A629A6E6-A6EFA830-A835A8D0-A8D9A900-A909A9D0-A9D9AA50-AA59ABF0-ABF9FF10-FF19",
    "currencysymbol":"002400A2-00A5058F060B09F209F309FB0AF10BF90E3F17DB20A0-20B9A838FDFCFE69FF04FFE0FFE1FFE5FFE6",
    "cjkletter":"300530063031-3035303B303C3041-3096309D-309F30A1-30FA30FC-30FF3105-312D3131-318E31A0-31BA31F0-31FF3400-4DB54E00-9FCCA000-A48CA4D0-A4FDA90A-A925A930-A946A960-A97CA984-A9B2A9CFAA00-AA28AA40-AA42AA44-AA4BAA60-AA76AA7AAA80-AAAFAAB1AAB5AAB6AAB9-AABDAAC0AAC2AADB-AADDAAE0-AAEAAAF2-AAF4AB01-AB06AB09-AB0EAB11-AB16AB20-AB26AB28-AB2EABC0-ABE2AC00-D7A3D7B0-D7C6D7CB-D7FBF900-FA6DFA70-FAD9"//,
  };
  var numberletter=unicode.expand(unicode.number);
  var wordletter=unicode.expand(unicode.noncjkletter+unicode.mark+unicode.number+unicode.currencysymbol+unicode.cjkletter)+"%_";
  var cjkletter=unicode.expand(unicode.cjkletter);
  var highlightsearchterms=function(searchterms){
    searchterms[0]=searchterms[0].slice(0,1024);
    searchterms[1]=searchterms[1].slice(0,1024);
    unhighlightsearchterms();
    var nodeiterator=document.createNodeIterator(document.body,NodeFilter.SHOW_TEXT,null,false);
    var node;
    textnodes=[];
    while(node=nodeiterator.nextNode()){
      textnodes.push(node);
    }
    var regularexpression=searchterms[0].slice();
    for(var i=0;i<regularexpression.length;i++){
      regularexpression[i]=regularexpression[i].replace(/[\-\/\\\^\$\*\+\?\.\(\)\|\{\}\[\]]/g,"\\$&");
    }
    var regularexpression=new RegExp(regularexpression.join("|"),"gi");
    for(var i=0;i<searchterms[0].length;i++){
      searchterms[0][i]=searchterms[0][i].toLowerCase();
    }
    var nonletterregularexpression=new RegExp("[^"+wordletter+"]");
    var nonlettertest=function(character){
      if(character==""){
        return true;
      }
      else{
        return nonletterregularexpression.test(character);
      }
    };
    for(var i=0;i<textnodes.length;i++){
      var text=textnodes[i].textContent;
      var lastendposition=0;
      var result;
      while((result=regularexpression.exec(text))!==null){
        var position=result.index;
        var match=result[0];
        var key=searchterms[0].indexOf(result[0].toLowerCase());
        if(searchterms[1][key]!="word"||(nonlettertest(text.charAt(position-1))&&nonlettertest(text.charAt(position+match.length)))){
          textnodes[i].parentNode.insertBefore(document.createTextNode(text.substring(lastendposition,position)),textnodes[i]);
          var highlight=document.createElement("b");
          highlightingtags.push(highlight);
          highlight.textContent=match;
          highlight.style.fontWeight="bold";
          highlight.style.color=searchtermtextcolours[key%(searchtermtextcolours.length)];
          highlight.style.backgroundColor=searchtermhighlightcolours[key%(searchtermhighlightcolours.length)];
          textnodes[i].parentNode.insertBefore(highlight,textnodes[i]);
          textnodes[i].textContent=text.substring(position+match.length);
          lastendposition=position+match.length;
        }
      }
    }
  };
  var unhighlightsearchterms=function(){
    for(var i=0;i<highlightingtags.length;i++){
      if(highlightingtags[i].parentNode!=null){
        highlightingtags[i].parentNode.replaceChild(document.createTextNode(highlightingtags[i].textContent),highlightingtags[i]);
      }
    }
    if(highlightingtags.length>0){
      document.body.normalize();
      document.getSelection().removeAllRanges();
    }
    highlightingtags=[];
  };
  var getcustomsearch=function(element){
    var searchurl=false;
    if(["input","textarea"].indexOf(element.tagName.toLowerCase())!=-1&&element.name!==""){
      var form=element;
      while(form.tagName.toLowerCase()!="form"&&form.parentElement!=null){
        form=form.parentElement;
      }
      if(form.tagName.toLowerCase()=="form"&&form.action.search(/https?:\/\//)==0){
        searchurl=form.action.split("#")[0].split("?");
        if(form.method.toLowerCase()=="post"){
          if(searchurl.length>1&&searchurl[1].length>0){
            searchurl=searchurl[0]+"?"+searchurl[1]+"??";
          }
          else{
            searchurl=searchurl[0]+"??";
          }
        }
        else{
          searchurl=searchurl[0]+"?";
        }
        var nodeiterator=document.createNodeIterator(form,NodeFilter.SHOW_ELEMENT,function(node){
          return (["input","textarea","select"].indexOf(node.nodeName.toLowerCase())!=-1&&node.name!=="")?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
        },false);
        var node;
        var formelements=[];
        while(node=nodeiterator.nextNode()){
          formelements.push(node);
        }
        for(var i=0;i<formelements.length;i++){
          if(formelements[i]==element){
            searchurl+=encodeURIComponent(element.name)+"=%s&";
          }
          else if(formelements[i].disabled==false||element.disabled==true){
            if(formelements[i].tagName.toLowerCase()=="select"){
              if(formelements[i].multiple==true){
                for(var j=0;j<formelements[i].options.length;j++){
                  if(formelements[i].options[j].selected==true){
                    searchurl+=encodeURIComponent(formelements[i].name)+"="+encodeURIComponent(formelements[i].options[j].value)+"&";
                  }
                }
              }
              else{
                searchurl+=encodeURIComponent(formelements[i].name)+"="+encodeURIComponent(formelements[i].options[formelements[i].selectedIndex].value)+"&";
              }
            }
            else if(formelements[i].tagName.toLowerCase()=="input"&&["checkbox","radio"].indexOf(formelements[i].type.toLowerCase())!=-1){
              if(formelements[i].checked==true){
                searchurl+=encodeURIComponent(formelements[i].name)+"="+encodeURIComponent(formelements[i].value)+"&";
              }
            }
            else if(formelements[i].tagName.toLowerCase()=="textarea"||(formelements[i].tagName.toLowerCase()=="input"&&["file","submit","image","reset","button"].indexOf(formelements[i].type.toLowerCase())==-1)){
              searchurl+=encodeURIComponent(formelements[i].name)+"="+(formelements[i].type.toLowerCase()=="password"?"":encodeURIComponent(formelements[i].value))+"&";
            }
          }
        }
        searchurl=searchurl.substring(0,searchurl.length-1);
      }
    }
    if(searchurl==false){
      return false;
    }
    else{
      var links=document.getElementsByTagName("link");
      var rels=[];
      for(var i=0;i<links.length;i++){
        rels[i]=links[i].rel.toLowerCase();
      }
      var favicon=window.location.protocol+"//"+window.location.hostname+"/favicon.ico";
      var hostnameifneeded=window.location.hostname;
      if(rels.indexOf("shortcut icon")!=-1){
        favicon=links[rels.indexOf("shortcut icon")].href;
        hostnameifneeded=false;
      }
      else if(rels.indexOf("icon")!=-1){
        favicon=links[rels.indexOf("icon")].href;
        hostnameifneeded=false;
      }
      return [document.title,window.location.href,searchurl,favicon,hostnameifneeded];
    }
  };
})();