var defaultsettings={
  "pinned":true,
  "showontextselection":true,
  "showonsessionstartup":true,
  "showingremember":false,
  "highlightingremember":true,
  "escfromanywhere":true,
  "displaycross":true,
  "displayhighlightbutton":true,
  "displayfindbuttons":true,
  "maximumnumberoffindbuttons":5,
  "sendsearchsuggestions":true,
  "searchsuggestionslocale":".nl",
  "maximumnumberofsearchsuggestions":10,
  "maximumnumberofsearchhistorysuggestions":10,
  "disablesearchhistory":false,
  "displayoptionspagelink":false,
  "hotkeys":{
    "show":[115,false,false,false],
    "hide":[27,false,false,false],
    "highlight":[72,true,true,false]
  },
  "custombuttons":[
    [true,false,[[71,true,false,false],[71,true,true,false],[71,true,true,true]],"Google (Alt+G)","https://www.google.com/","https://www.google.nl/webhp?hl=en#hl=en&q=%s"],
    [true,false,[[89,true,false,false],[89,true,true,false],[89,true,true,true]],"DuckDuckGo (Alt+D)","https://duckduckgo.com/","https://duckduckgo.com/?q=%s"],
    [true,false,[[87,true,false,false],[87,true,true,false],[87,true,true,true]],"Mycloudplayer (Alt+C)","http://mycloudplayers.com/","http://mycloudplayers.com/?q=%s"],
    [true,false,[[false,false,false,false],[false,false,false,false],[false,false,false,false]],"Kickass Torrent (Alt+K)","https://kat.cr/","https://kat.cr/usearch/%s"],
    [true,false,[[false,false,false,false],[false,false,false,false],[false,false,false,false]],"Pirate bay(Alt+P)","https://pirateproxy.tf/","https://pirateproxy.tf/s/?q=%s"],
    [true,false,[[false,false,false,false],[false,false,false,false],[false,false,false,false]],"Terraria wiki(Alt+T)","http://terraria.gamepedia.com/","http://terraria.gamepedia.com/index.php?search=%s&title=Special%3ASearch&go=Go"],
    [true,false,[[false,false,false,false],[false,false,false,false],[false,false,false,false]],"Github(Alt+H)","https://github.com","https://github.com/search?utf8=&q=%s"], 
    [true,true,[[false,false,false,false],[false,false,false,false],[false,false,false,false]],"search current site","http://www.google.com/","http://www.google.com/search?q=%s%20site%3A%h"],
    [true,false,[[false,false,false,false],[false,false,false,false],[false,false,false,false]],"Google Images","http://images.google.com/","http://www.google.com/search?tbm=isch&q=%s"],     
  ],
  "i1":"https://www.google.com/favicon.ico",
  "i2":"https://www.duckduckgo.com/favicon.ico",
  "i3":"https://www.mycloudplayers.com/favicon.ico",
  "i4":"https://kat.cr/favicon.ico",
  "i5":"https://pirateproxy.tf/favicon.ico",
  "i6":"http://hydra-media.cursecdn.com/terraria.gamepedia.com/6/64/Favicon.ico", 
  "i7":"https://github.com/favoicon.ico",
  "i8":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACQUlEQVQ4jaWTXUhTYRzGz9zp06mRZpYVtdboy7Ux+oKISunTCzFqRBR5kRAsvXQledFAV3rs+7TaJIez1syP4W6W3czAJlmIuxDKm5DoRgkGVh63/9N7zqGLsYKyi985h3P4Pf9z3uc9nD5Uzv0Pv71p7iFsDxI2PyMYOgjrnxDWeAh/FSDLJV2ELQGC0c8kH2FdG2H1I0KhmBmiHKx9BEsvYUc3m8zkykgSd8dm0TXxQ6EhJsHqT6HgPmHZbYKuhbDIpYZxsmR6oU7d9pxQPyyhZWACpjMu8JbL0O68ioN1IbSPJXCiO4mcVoJzMIn4FwkLmwicLG0NqN97NJyCOPQZuXtrwJvt0FpqkbWnAZoDIowX++GNf8OKOwSzJ4XqcFINMHYSNvnVxXIMSSit9Sqi1lKDrH3N0BzyQFvmQXZFH4ToNMrck4r4C05epA3t6kq73kkoOS9Cu6seGiZzh4PgjvczQsg/+wr2p59ga/uQHrDWyypiFLOamkYk7LYHwO8X2NTHqlweAV8RQcG5KJyRqcyAIjdBZuVDgi08h8YIe8UjPhTagtCdDEN3agBFF6Kw1o3CF5/Bxitv0wPkavLvEZYzilnPre9n4eiZhL46Ct3pl0x+jVLnOITBr7B3jGLBten0gDzWa94tQi6rJ0cgZZWvv5FYbTN4EEtAHE6gc/w7qtwx8JdG0mQ14CZhaTNhCTsvvqFuEPmBQZiCyfVRYZUjnjFZJruRBRiOVUEvzs0L2VW2snwxH/74N/4LPwH4nz84wgMhgAAAAABJRU5ErkJggg==",
  "i9":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACcElEQVQ4jZWS30tTYRjH9zd0o5EGatR01ObQsVw6pzsza62cEzVtLUOEqFU6s2aemRW22FaRyGo0EkOiNscC+wGZVKM1dacVFEvaRbCgbgRpF4Kwb3tfmDgOQV18Xw4vz/t5vud5voLioFZAtLKygjH3HciVdaiqrYe2yQCRtBJW2yV6//LVHLK1G0WPZPIHGK0OlvNWhBZiiHz7BcuFQRxu2YGxvjy4+vPR2SbCqV4LD0KP5rYO3Lo9jvEZDubgdxwZuomh02L8Ts4inU5T/YyY0GMqo25yAIHgE5TLFWD266hlIlmNCkmuDxzHUWUh4ck86jQHYOruQaOwHL7243jK2vF1YBRXlVq88esgEAioyONUKoX3jwppgxwAGZrP0E2LlpeXwbIs7htPIDEtg1qthtlsxtraGuZmA+CmNvEdGEulWJp9SwHkMekokUgQ02/G5xcViL5z4PWzXsQe58NkEPJncLR0F5buPaQA8r8EcmPUjudbpWhvEsPJFsF+bhtaD+6k9sm6cwDE0rxEhfjHT1hdXUUikcBERQPMRWLUGjrQ0tUDKzuMM5ZBkHnx1jjxYAp6WRU+NHchVt+KsFCG64XbIc9swuWdxGKUg983jYu2KzRkX+Jx8HJAIMSeXncITHUNlJpGhMLz8AdmYBlg0Wk8Bo/HA4fTBaW6ISeV6yRCJhbV+w7g5Nn+TBKHsVdnoF0JvEwkgtPppKDqemZ9mLxsExDpQFxFFhZpEQmbUCxFcUkJLo+MwOv1QpMJ3jWHEzzA35SFbCkogC2zqVA4it0Zd/8M2AhhGA3c7rtQqNT/B8hCKhU12FPHgHz/AcaQDZ9dh2YlAAAAAElFTkSuQmCC",
  "detect":true,
  "detectprimary":true,
  "detectcustom":[],
  "detecttosearchhistory":false,
  "alwaysnewtab":true,
  "alwaysforegroundtab":true,
  "showontextselectionexception":true,
  "position":["top","left"],
  "separatorsaslinebreaks":false,
  "findbuttonhotkeys":[[[49,true,true,false],[49,true,true,true]],[[50,true,true,false],[50,true,true,true]],[[51,true,true,false],[51,true,true,true]],[[52,true,true,false],[52,true,true,true]],[[53,true,true,false],[53,true,true,true]]],
  "direction":"initial",
  "removewhitespace":true,
  "forcepopup":false,
  "extrapixels":3,
  "forcepopup":true,
  "extrapixels":3,
  "imageproxy":true,
  "searchremember":true
};
chrome.storage.local.get(null,function(settings){
  var newsettings={};
  var changedsettings=false;
  if(typeof(settings.custombuttons)=="undefined"){
    newsettings=defaultsettings;
    changedsettings=true;
  }
  else{
    for(var setting in defaultsettings){
      if(defaultsettings.hasOwnProperty(setting)&&typeof(settings[setting])=="undefined"&&(!(setting.charAt(0)=="i"&&parseInt(setting.substring(1),10)>0))){
        newsettings[setting]=defaultsettings[setting];
        changedsettings=true;
      }
    }
  }
  if(changedsettings){
    chrome.storage.local.set(newsettings);
  }
});
var tabs=[];
var searchesbytabid=[];
var lastsearch="";
var lasthighlighting="";
var lastshowing="";
if(typeof(localStorage.searchhistory)=="undefined"){
  localStorage.setItem("searchhistory","[]");
}
if(typeof(localStorage.height)=="undefined"){
  localStorage.setItem("height","36");
}
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
  if(message=="start"){
    sendResponse({
      "lastshowing":lastshowing,
      "height":localStorage.height
    });
  }
});
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
  if(message=="defaultsettings"){
    sendResponse(defaultsettings);
  }
});
chrome.runtime.onConnect.addListener(function(port){
  if(typeof(port.sender.tab)=="undefined"){
    port.sender.tab={
      "id":"popup"
    };
  }
  if(typeof(tabs[port.sender.tab.id])=="undefined"){
    tabs[port.sender.tab.id]={
      "frameports":[]
    };
  }
  if(port.name=="top"){
    tabs[port.sender.tab.id].topport=port;
    tabs[port.sender.tab.id].topportlistener=function(message){
      if(message.type=="init"){
        port.postMessage({
          "type":"init",
          "lastsearch":typeof(searchesbytabid[port.sender.tab.id])=="undefined"?[lastsearch,true]:[searchesbytabid[port.sender.tab.id],false],
          "lastshowing":lastshowing,
          "lasthighlighting":lasthighlighting,
          "height":localStorage.height
        });
        delete(searchesbytabid[port.sender.tab.id]);
      }
      if(message.type=="search"){
        tabs[port.sender.tab.id].topportlistener({
          "type":"lastsearch",
          "data":message.lastsearch
        });
        if(message.data[0].search(/(https?:\/\/|javascript:|data:)/)==0){
          if(message.disablesearchhistory==false){
            tabs[port.sender.tab.id].topportlistener({
              "type":"searchhistory",
              "data":message.lastsearch[0]
            });
          }
          var updatesearchesbytabid=function(tab){
            searchesbytabid[tab.id]=message.lastsearch[0];
          };
          if(message.data[1]){
            chrome.tabs.create(message.data[3]?{
              "url":message.data[0],
              "active":message.data[2]
            }:
            {
              "url":message.data[0],
              "active":message.data[2],
              "openerTabId":port.sender.tab.id
            },
            updatesearchesbytabid);
          }
          else{
            if(message.data[3]){
              chrome.tabs.update({
                "url":message.data[0]
              },
              updatesearchesbytabid);
              port.postMessage({
                "type":"closepopup"
              });
            }
            else{
              chrome.tabs.update(port.sender.tab.id,{
                "url":message.data[0]
              },
              updatesearchesbytabid);
            }
          }
        }
      }
      if(message.type=="lastsearch"){
        lastshowing=message.data[1];
        lastsearch=message.data[0];
        lasthighlighting=message.data[2];
      }
      if(message.type=="searchhistory"&&chrome.extension.inIncognitoContext==false&&message.data!=""){
        var searchhistory=JSON.parse(localStorage.searchhistory);
        if(searchhistory.length==0||searchhistory[0]!=message.data){
          searchhistory.unshift(message.data);
          localStorage.setItem("searchhistory",JSON.stringify(searchhistory));
        }
      }
      if(message.type=="getsuggestions"){
        port.postMessage({
          "type":"getsearchhistory",
          "data":JSON.parse(localStorage.searchhistory)
        });
        if(message.data!==false){
          var xhr=new XMLHttpRequest();
          xhr.onreadystatechange=function(){
            if(xhr.readyState==4&&(xhr.status==200||xhr.status==304)){
              port.postMessage({
                "type":"getsearchsuggestions",
                "data":JSON.parse(xhr.responseText.substring(xhr.responseText.indexOf("(")+1,xhr.responseText.lastIndexOf(")")))
              });
            }
          };
          xhr.open("GET",message.data,true);
          xhr.send();
        }
      }
      else if(message.type=="focus"||message.type=="find"){
        if(typeof(tabs[port.sender.tab.id].frameports[message.frameid])!="undefined"){
          tabs[port.sender.tab.id].frameports[message.frameid].postMessage({
            "type":message.type,
            "data":message.data
          });
        }
      }
      else if(message.type=="highlight"||message.type=="unhighlight"){
        for(i in tabs[port.sender.tab.id].frameports){
          tabs[port.sender.tab.id].frameports[i].postMessage({
            "type":message.type,
            "data":message.data
          });
        }
      }
      else if(message.type=="custombutton"){
        chrome.storage.local.get("custombuttons",function(settings){
          settings.custombuttons[settings.custombuttons.length]=message.custombutton;
          chrome.storage.local.set(JSON.parse("{\"custombuttons\":"+JSON.stringify(settings.custombuttons)+",\"i"+settings.custombuttons.length.toString()+"\":\""+message.i+"\"}"));
        });
      }
      else if(message.type=="height"){
        localStorage.setItem("height",message.data.toString());
      }
      else if(message.type=="url"){
        chrome.tabs.create(message.popup?{
          "url":message.url
        }:
        {
          "url":message.url,
          "openerTabId":port.sender.tab.id
        });
      }
    };
    port.onMessage.addListener(tabs[port.sender.tab.id].topportlistener);
    port.onDisconnect.addListener(function(){
      delete(tabs[port.sender.tab.id]);
    });
  }
  else if(port.name=="frame"){
    port.frameid=tabs[port.sender.tab.id].frameports.length;
    tabs[port.sender.tab.id].frameports.push(port);
    port.onMessage.addListener(function(message){
      if(message.type=="event"){
        if(typeof(tabs[port.sender.tab.id])!="undefined"&&typeof(tabs[port.sender.tab.id]).topport!="undefined"){
          tabs[port.sender.tab.id].topport.postMessage({
            "type":"event",
            "frameid":port.frameid,
            "data":message.data
          });
        }
      }
    });
    port.onDisconnect.addListener(function(){
      if(typeof(tabs[port.sender.tab.id])!="undefined"){
        delete(tabs[port.sender.tab.id].frameports[port.frameid]);
      }
    });
  }
  if(typeof(tabs[port.sender.tab.id].topport)!="undefined"){
    try{
      chrome.browserAction.setPopup({
        "tabId":port.sender.tab.id,
        "popup":""
      });
    }
    catch(error){
    }
  }
});
chrome.browserAction.onClicked.addListener(function(tab){
  if(typeof(tabs[tab.id])!="undefined"&&typeof(tabs[tab.id]).topport!="undefined"){
    tabs[tab.id].topport.postMessage({
      "type":"browseraction"
    });
  }
});
chrome.tabs.onUpdated.addListener(function(tabId){
  if(typeof(tabs[tabId])!="undefined"&&typeof(tabs[tabId].topport)!="undefined"){
    try{
      chrome.browserAction.setPopup({
        "tabId":tabId,
        "popup":""
      });
    }
    catch(error){
    }
  }
});
var removepopups=function(){
  chrome.storage.local.get("forcepopup",function(settings){
    for(i in tabs){
      if(typeof(tabs[i].topport)!="undefined"&&i!="popup"){
        try{
          chrome.browserAction.setPopup({
            "tabId":parseInt(i,10),
            "popup":settings.forcepopup?"popup.html":""
          });
        }
        catch(error){
        }
      }
    }
  });
  window.setTimeout(removepopups,2500);
};
window.setTimeout(removepopups,2500);
chrome.contextMenus.create({
  "title":"Add to SearchBar...",
  "contexts":["editable"],
  "onclick":function(info,tab){
    if(typeof(tabs[tab.id])!="undefined"&&typeof(tabs[tab.id]).topport!="undefined"){
      tabs[tab.id].topport.postMessage({
        "type":"contextmenu"
      });
    }
  },
  "documentUrlPatterns":["http://*/*","https://*/*"]
});
chrome.tabs.query({"status":"complete"},function(alltabs){
  for(var i=0;i<alltabs.length;i++){
    try{
      chrome.tabs.executeScript(alltabs[i].id,{
        "file":"content.js",
        "allFrames":true
      });
    }
    catch(error){
    }
  }
});
