if(window.top!==window){
  window.location.replace("about:blank");
}
window.addEventListener("scroll",function(){
  document.getElementById("brosmalllogo").style.right=(4-document.body.scrollLeft)+"px";
});
function keycodetotext(keycode){
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
function hotkeytotext(hotkey){
  return hotkey[0]===false?"":(hotkey[1]?"Alt+":"")+(hotkey[2]?"Ctrl+":"")+(hotkey[3]?"Shift+":"")+keycodetotext(hotkey[0]);
};
function isequal(x,y){
  if(typeof(x)==typeof(y)){
    if(typeof(x)=="object"){
      var answer=true;
      for(var i in x){
        if(x.hasOwnProperty(i)&&(!(y.hasOwnProperty(i)&&isequal(x[i],y[i])))){
          answer=false;
        }
      }
      for(var i in y){
        if(y.hasOwnProperty(i)&&(!(x.hasOwnProperty(i)&&isequal(x[i],y[i])))){
          answer=false;
        }
      }
      return answer;
    }
    else{
      return x===y;
    }
  }
  else{
    return false;
  }
}
function getimagedata(fileinput,callback){
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
window.addEventListener("load",function(){
  var searchsuggestionslocales=[".nl",".com",".de"];
  var options=new Array(searchsuggestionslocales.length);
  for(var i=0;i<searchsuggestionslocales.length;i++){
    options[i]=document.createElement("option");
    options[i].textContent=searchsuggestionslocales[i];
    document.getElementById("searchsuggestionslocale").appendChild(options[i]);
  }
  document.getElementById("searchhistory").value=JSON.parse(localStorage.searchhistory).join("\n");
  var searchhistoryupdate=function(){
    localStorage.setItem("searchhistory",this.value==""?"[]":JSON.stringify(this.value.split("\n")));
  };
  document.getElementById("searchhistory").addEventListener("keyup",searchhistoryupdate);
  document.getElementById("searchhistory").addEventListener("change",searchhistoryupdate);
  window.addEventListener("storage",function(event){
    if(event.key=="searchhistory"){
      document.getElementById("searchhistory").value=JSON.parse(event.newValue).join("\n");
    }
  },false);
  document.getElementById("searchhistory").disabled=false;
  var inputtags=[];
  for(var i=0;i<document.getElementsByTagName("input").length;i++){
    inputtags[i]=document.getElementsByTagName("input")[i];
  }
  var buttontags=[];
  for(var i=0;i<document.getElementsByTagName("button").length;i++){
    buttontags[i]=document.getElementsByTagName("button")[i];
  }
  var disableall=false;
  var storageseterrorhandler=function(){
    if(typeof(chrome.runtime.lastError)!="undefined"){
      alert("Error:\n"+chrome.runtime.lastError.message);
      window.location.reload(false);
    }
  };
  var sidebarlinks=["introlink","basiclink","advancedlink","customlink","helplink","supportlink"];
  var settingsbars=["intro","settings","settings","customsettings","help","support"];
  var hashes=["#introduction","#basicsettings","#advancedsettings","#customsearches","#help","#supportsearchbar"];
  var spreadthewordloaded=false;
  for(var i=0;i<sidebarlinks.length;i++){
    document.getElementById(sidebarlinks[i]).clickfunction=(function(i){
      return function(){
        for(var j=0;j<sidebarlinks.length;j++){
          document.getElementById(sidebarlinks[j]).className="sidebarlink";
          document.getElementById(settingsbars[j]).className="settingsbar";
        }
        document.getElementById(sidebarlinks[i]).className="sidebarselected";
        document.getElementById(settingsbars[i]).className="settingsselected";
        if(i==0){
          document.getElementById("previewcontainer1").appendChild(document.getElementById("searchbarpreview"));
        }
        if(i==2){
          document.getElementById("previewcontainer2").appendChild(document.getElementById("searchbarpreview"));
        }
        if(i==3){
          document.getElementById("previewcontainer3").appendChild(document.getElementById("searchbarpreview"));
        }
        if(settingsbars[i]=="settings"){
          var advancedoptions=document.getElementsByClassName("advanced");
          for(var j=0;j<advancedoptions.length;j++){
            advancedoptions[j].style.display=(i==1)?"none":(advancedoptions[j].tagName.toLowerCase()=="span"?"inline":"block");
          }
        }
        if(i==5){
          if(!spreadthewordloaded){
            document.getElementById("spreadtheword").innerHTML="<iframe src=\"https://www.facebook.com/plugins/like.php?href=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Fsearchbar%2Ffjefgkhmchopegjeicnblodnidbammed&amp;width&amp;layout=standard&amp;action=like&amp;show_faces=false&amp;share=true&amp;height=35\" scrolling=\"no\" frameborder=\"0\" style=\"border:none; overflow:hidden; height:35px;\" allowTransparency=\"true\"></iframe><br><iframe src=\"https://plusone.google.com/_/+1/fastbutton?bsv&amp;size=medium&amp;hl=en-US&amp;url=https://chrome.google.com/webstore/detail/searchbar/fjefgkhmchopegjeicnblodnidbammed\" allowtransparency=\"true\" frameborder=\"0\" scrolling=\"no\" title=\"+1\" style=\"height:32px;width:76px;vertical-align:middle;\"></iframe><a target=\"_blank\" style=\"vertical-align:5px;\" href=\"https://plus.google.com/share?url=https://chrome.google.com/webstore/detail/searchbar/fjefgkhmchopegjeicnblodnidbammed\">share...</a><br><iframe allowtransparency=\"true\" frameborder=\"0\" scrolling=\"no\" src=\"https://platform.twitter.com/widgets/tweet_button.html?url=https://chrome.google.com/webstore/detail/searchbar/fjefgkhmchopegjeicnblodnidbammed&text=Check out this Chrome extension I've been using:\" style=\"width:130px; height:20px;\"></iframe>";
            spreadthewordloaded=true;
          }
        }
      };
    })(i);
    document.getElementById(sidebarlinks[i]).addEventListener("click",(function(i){
      return function(){
        document.getElementById(sidebarlinks[i]).clickfunction();
        window.history.pushState(null,null,hashes[i]);
      };
    })(i));
  }
  var readhash=function(event){
    var hash=window.location.hash;
    if(hash==""){
      hash=hashes[0];
    }
    var i=hashes.indexOf(hash);
    if(i!=-1){
      document.getElementById(sidebarlinks[i]).clickfunction();
    }
  };
  readhash();
  window.addEventListener("popstate",readhash);
  chrome.storage.local.get(null,function(settings){
    var searchbar=document.getElementById("searchbarpreview");
    var cross;
    var box;
    var buttons=[];
    var images=[];
    var separators=[];
    var findbuttonsdiv;
    var findbuttons=[];
    var optionspagelink;
    var optionspageimage;
    var highlightbuttonseparator;
    var optionspagelinkseparator;
    var changedtimeout=false;
    var resetsearchbarpreview=function(){
      var cssreset=function(object){
        object.style.border="0px";
        object.style.margin="0px";
        object.style.padding="0px";
        object.style.outline="0px";
        object.style.verticalAlign="baseline";
      };
      while(searchbar.hasChildNodes()){
        searchbar.removeChild(searchbar.lastChild);
      }
      searchbar.style.display="inline-block";
      cssreset(searchbar);
      searchbar.style.height="auto";
      searchbar.style.padding="3px";
      searchbar.style.border="1px solid #bababa";
      searchbar.style.backgroundColor="#e0e0e0";
      searchbar.style.color="#b0b0b0";
      searchbar.style.font=12+settings.extrapixels+"px sans-serif";
      searchbar.style.cursor="default";
      searchbar.style.textAlign=settings.position[1];
      searchbar.style.direction=settings.direction;
      cross=document.createElement("button");
      cross.title="hide SearchBar"+(settings.hotkeys.hide[0]===false?"":(" ("+hotkeytotext(settings.hotkeys.hide)+")"));
      images[0]=document.createElement("img");
      images[0].src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1gcHCyMfGLAkTgAAAppJREFUOMuVk0+LFFcUxX9V9aq63lhdXWVbTlrtDExpixsRe6Fgh2yCy3yCTAhGMTERQaMYNy7cuFARXLjwD6JrF4K4SPINzHJIoskMaMCJSXom092jVne9d7PoYaIEBO/m3LM498K55zpAAMSr+C41BHoKSM9XK59HjrPfdWh6MP02lYF5K/w+EPnudL+4oQAncpz9Hx+c+TDZWAdjwRrEGhDzX2/GXKydXvprcfrB3e8BbirAeg5b0qlNlH8/o+w+w1pBRLDWYldxzIVKLSHdnFHPki30/rBuu932XMjxPcyrJST0iQ+fwd3cxDDEyBCvOUX967PYiZCVlWUIFRVdydvttud2Oh0fQBBEIP70JOGufdRPXMRvbsV/fxvvnbrMut0fsPHgt5hyBGJBhE6n46tWqzV23xqsWHr3b1PfthN3IiI7cQkAdyLCvBiweO/W2ElrAWi1WoHK87zyBLD9lxRPuoxm53n19ACbLlzHq8Zj5/s95o59xsv5xxgRTL0BIuR5XnGzLAsBzNKA0UrBaFBgivJ/57NDw2hQUA4Kym4fKQ1ZloVukiQaQIYjrBX8fDvNK7fwqjGm38P0e3jVmK1X76BbO7ACUgyRUUmSJNqNokiveWAtGw58tSb+7cgMv345Q9nvoaoxjUNHERGwBkSIokgrrfUbA56eO02T8yxcu8KLxz8jIjw6/AmNQ0eZO3sKT3mrIQOttVZKKe1XqwtiTUOn6+n/+Zy5b46snVVEGPzyE4+Of4Ef+NTSGIxBQr2glNIqCIKwkqTdf7qLjVqaMlGLxxusQcxrUX4t0su9AUM/7AZBECrATu7ZO/vwx4dusbRYHy4vT77tmYJa7XklXd+d3LN3FrCOiEwBHwHr3vGdV4Af/gXVzUVdmatoKQAAAABJRU5ErkJggg==";
      images[0].alt=cross.title;
      cross.appendChild(images[0]);
      box=document.createElement("input");
      box.type="text";
      box.autocomplete="off";
      box.style.display="inline-block";
      box.style.width=250+settings.extrapixels*4+"px";
      box.style.font=16+settings.extrapixels+"px sans-serif";
      box.style.margin="1px 3px";
      box.style.padding="2px";
      box.style.outline="none";
      box.style.verticalAlign="baseline";
      box.style.direction="initial";
      box.addEventListener("change",function(){
        this.value="";
      });
      buttons[0]=cross;
      var createbutton=function(buttonid,title,imgsrc){
        buttons[buttonid]=document.createElement("button");
        buttons[buttonid].title=title;
        images[buttonid]=document.createElement("img");
        images[buttonid].src=imgsrc;
        images[buttonid].alt=title;
        buttons[buttonid].appendChild(images[buttonid]);
      };
      for(var i=0;i<settings.custombuttons.length;i++){
        createbutton(i+2,settings.custombuttons[i][3],settings["i"+(i+1).toString()]);
      }
      buttons[1]=document.createElement("button");
      buttons[1].title="highlight search terms"+(settings.hotkeys.highlight[0]===false?"":(" ("+hotkeytotext(settings.hotkeys.highlight)+")"));
      buttons[1].highlighting="";
      images[1]=document.createElement("img");
      images[1].offsrc="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAHdElNRQfcCRsXDhJXcy0oAAAA8klEQVQoz23QMS9DURjG8d+5mlI0pDqIjQ8gEhGLkc5GH86nMTTpoEREDEgEW3WRDpXe+xp6W9V6z3KS53/+ed4jLJ5OPMbknsL8XEeusGo/YRG4jVyuQHKcyP7G96WaMNKNOeApcqEwttaN/AFeYqCYxisyD7PAW3wp5CVQsa6t9Qv047OMx/UarpzaSVTgK15LeQGa7hzYSyaGd0vT12z6wGEauzMYqquVP7fm27PzNOmWMYwVb1ZtoGrJjYuZ1bNR9K1repI01XWcqaVfIPViIJerurLlVassNzV0Lavqa9vWczQXU2m4NLJn10nyz/wAxclsa1wEXXAAAAAASUVORK5CYII=";
      images[1].onsrc="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABzklEQVQ4jZWSy0sbURjF02ihti4ULWkRHwhGUAJ2WVBaqCDSlYgKrnSjRLtxrairtn9AacUHpQuXihsFl0EUM20y0zER4yORECwRfBRBDDLn9DMzpq0Za7q4cBnu73fuPd84SDpyWQg8InbaePN7brD2hAg8JL46iNAz/pcAeg2hPhbBA1OgOGkoLuYkwGYj8b2KCBYT3/JNgT+PxloBjcAL/lOAvW5io5bQnkp6ocD3LEE+Df0lz9Y7bxcg5hW4XtIrrPT7metD8zC10UtluslegMSYwHUCV8rbSyW9wISvVrBMJtFH/yc3TxJ6tgDH84TuFrhc4BKreaclkH30DdXJch7urmSXiLM1E9RcklRkte78ffXoAGPz9Ywps/ZjRKRFZuwxU68bv4Yj7Tz2Pac65739R7rUmol9KS/cYIFXjQscamRK7+Lq1OssOCPARZypzVGe++T90R5JbE2PC0E3U+F+KjMiOT+1F+DyJ/Fjkki8TR8+XaomtjrSbSPipTpdm2ncXnA0R8SH5fpDxF4vjfg4Q188TC42UPlQ9VfjtoLYcjuRnCAO3jPpH6Q6+4rh5Xdc/dyd1bi9QA4tjru4MFKRhrZ9H++E/ly/ANXB/kXk+RjIAAAAAElFTkSuQmCC";
      images[1].src=buttons[1].highlighting==""?images[1].offsrc:images[1].onsrc;
      images[1].alt=buttons[1].title;
      buttons[1].addEventListener("click",function(){
        buttons[1].highlighting=buttons[1].highlighting===""?false:"";
        images[1].src=buttons[1].highlighting===""?images[1].offsrc:images[1].onsrc;
      });
      buttons[1].appendChild(images[1]);
      findbuttonsdiv=document.createElement("div");
      cssreset(findbuttonsdiv);
      findbuttonsdiv.style.display="inline-block";
      findbuttonsdiv.style.direction="initial";
      findbuttons[1]=document.createElement("button");
      findbuttons[1].title="find in page"+(settings.findbuttonhotkeys[0][0][0]===false?"":(" ("+hotkeytotext(settings.findbuttonhotkeys[0][0])+")"));
      findbuttons[1].style.display="inline-block";
      findbuttons[1].style.height=26+settings.extrapixels+"px";
      findbuttons[1].style.width="auto";
      findbuttons[1].style.margin="1px 1px 2px 1px";
      findbuttons[1].style.padding="1px 3px 0px 3px";
      findbuttons[1].style.outline="0px";
      findbuttons[1].style.font=13+settings.extrapixels+"px sans-serif";
      findbuttons[1].style.verticalAlign="baseline";
      findbuttons[1].image=document.createElement("img");
      findbuttons[1].image.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAB70lEQVQ4jY2Ty28SURSH+9e60IVLF1q7wJgoBfpI7SOlJNIUUs3EUtJHolGh0tICgwMzHR7zHp5CodX9z3NvBW0ZEhe/mczkft+595yZGQAzLL9uOvh53cL1wMXwysZVz0Svq6HbrqHTVNFyFTTsEkbrR/kDt2/hYYNgB4O+BcdSUBQzkEtZWIaEpiuTQOKZENwQeFvZoao6MpnPODzcRzL5AXt7AgThHdKpY7jWd28BA4d9G4OeRQs/4ehon14/uJNY7C3SXw+8Bey8LKZe5pXvw6NsRze9BX3aNmsYOzPb9jRBOLziLfhBne62qyjkT5BICFMFGxuL3oJOs4I2jSr1JckbNk2wvPzKW8Bm3KIxyVIaW1tvEI9HJ+D19QWsrga8BQ2nxD8S15IgvN/E0tJL7O5uY2cngig1LhaLkHgFwaAPfv/cpIDN1zGL43w8jmMxNAv/66cIBp4jEp6n+xzW1gJc8K+EX2yjCNsQeSydpQBTy8Oo56BVL1CvnOP02wEJn01IuIADHCoQlIfOwFoOdYJrahYV5QyXcoY+pAR8vic0jQWEQi/+CkxNhE4Ay6giBy/PoMqnUMoZlKUTSGKKSx49fsgzFrAHUyvCoOh1JhNJVECtkkdVzUFVLqDIWdrF+Ri804OR5H9y/3f+DUsBNIL146pwAAAAAElFTkSuQmCC";
      findbuttons[1].image.alt=findbuttons[1].title;
      cssreset(findbuttons[1].image);
      findbuttons[1].image.style.height=16+settings.extrapixels+"px";
      findbuttons[1].image.style.width=16+settings.extrapixels+"px";
      findbuttons[1].image.style.verticalAlign=-2-settings.extrapixels/4+"px";
      findbuttons[1].appendChild(findbuttons[1].image);
      findbuttons[1].appendChild(document.createTextNode("\u00A0word"));
      findbuttonsdiv.appendChild(findbuttons[1]);
      for(var i=0;i<buttons.length;i++){
        buttons[i].style.display="inline-block";
        buttons[i].style.height=26+settings.extrapixels+"px";
        buttons[i].style.width=26+settings.extrapixels+"px";
        buttons[i].style.margin="1px 1px 2px 1px";
        buttons[i].style.padding="1px 3px 0px 3px";
        buttons[i].style.outline="0px";
        buttons[i].style.verticalAlign="baseline";
        buttons[i].style.direction="initial";
        cssreset(images[i]);
        images[i].style.height=16+settings.extrapixels+"px";
        images[i].style.width=16+settings.extrapixels+"px";
        images[i].style.verticalAlign=-2-settings.extrapixels/4+"px";
      }
      optionspagelink=document.createElement("a");
      optionspagelink.title="Options/Help";
      optionspagelink.style.direction="initial";
      optionspageimage=document.createElement("img");
      optionspageimage.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAEdUlEQVQ4jYWUbWxTVRjH/+fcc2/Xrmtvu64b61i7F2hhgyEEBkgREwhGRD4gkCAExIgxvCgkfhE+YIxi/ECUDyIOhaCJH1QIJG4YCeNNwOLAjZcxBmNrR9+7tWu7vtzeWz8oS4EFnuRJnic55/eck/8/D8FzYtGyreuqbNXbFUniPJ7BnRfaDpx71nn2PKDBIC5RieWzi3iGUDC0FMAzgbSwWbbmw1Vvbd171uncVgYAixbtYTq9pi6VkiDlFGi1mgbs2UMBYMnybS9tfO9T19IVO5yFDPKoeHn5ltUb169sMZSW6u509w52XOu8PH3a1LlDo/nK4NAoxzMeJh3LjgyH+gK+YM8ku92pcBojk0ceujo6V585sf/SY1/mZKlblhVZzilwTJlUNaNpyqpT528jGkuiiBdACDCSzAsqbYVjxuw6x1A0CTVPkYlnRhNU7hnjPCr6ejuCQvFEcebMxvn5PIisKJAlGfF4GjzjIDAGgXHgKEU2K0PFGLQqeeRGV9e77cf2d44rSjabjfOMQlaAXE5GIBiD3WaGLI0mOI5y4NTqQCgOSggoIVDxHE+JUlTI4AqbdzZ/cMBimVBOAPT2BWEu1aSuXnEddF24su5m960W5GWxwVHbkM0oVGAc7PUW3u/3W4rFmvaB+9eiAEDWbNy1c17zC2+KupIyi6ViAghjwXAc6bSErs7rJ7/6YvuKwqEf7z1ywWGfugB5oMpigMcbgd8biI+mEmHX39f306rKSmfT9MaZJnPFxGA4zQLBEXg8Q9AUMTzod1950mcP7rm7TEYtbNUmuN1DSMYk6LTGksm1jhqxRF/PvD5f7Po/t8MCrzEKKjVNJDIoEngwylBmNFifBNpqLVUVZj3u9viRy8go1nCK1+8NRCJSJJNJuwkALF68WS+UkDlzZ7/YYjZXWwkAnudAadp7/ETbqhO/7LsEAOs27X59w9qVR3VanX6gPwKecejq7uw81do27/Lln1NjKp8+/W0MwB/WqpoO+ySHNZ2SQAmBRmOoXL/2jdZXljj7OUqpzWqtqywv0wwPJVEk8FCrGQYGPRcfwZ6yzUC/77DUnHhNLWgFSgggAxxV6avLa5sIAXKjQCYlgREKtcCDEkWR07nIuLaZNWszv8DZeMRe57BSQqAS2JihGSVglENxsQqiQQOecZAlBTzliWjUTqaK+Fv3XVcYKFgO1jrdroXNc+fwhIKQbKbn/i2fVsNDp1VBLQhQq3gIjCEaied/bz9779a92w95FYc6q9VcbCrd8tQLeU57lTB+YU6RhOOtJ/cd/u7LTwLDSSUaixpmTGswIg+4bnT4D/34w/cHD322u6e3tzVPVE037/Tc+Obrj94GkHvSEdBXVxtstlkOADUAGgE0L311Q8tf53rzHecf5He8//mfAOYDaAJQD7XaAlEUC7V4TJSY2z0cgzsJQA0gBSARDHrPDHp9m0wmI/WFw30AAgDSAFJIpf7LghhvY2f/zxgA1NeInp9+PZZRFJIPhaIXAYTGuTMW/wLs+r0RwXE/QAAAAABJRU5ErkJggg==";
      optionspageimage.title=optionspagelink.title;
      optionspageimage.style.display="inline-block";
      optionspageimage.style.height=20+settings.extrapixels+"px";
      optionspageimage.style.width=20+settings.extrapixels+"px";
      cssreset(optionspageimage);
      optionspageimage.style.margin="0px 1px 0px 1px";
      optionspageimage.style.verticalAlign=-4-settings.extrapixels/4+"px";
      optionspagelink.appendChild(optionspageimage);
      searchbar.appendChild(cross);
      searchbar.appendChild(box);
      for(var i=0;i<settings.custombuttons.length;i++){
        if(settings.separatorsaslinebreaks){
          separators[i+2]=document.createElement("span");
          separators[i+2].appendChild(document.createElement("br"));
        }
        else{
          separators[i+2]=document.createElement("span");
          separators[i+2].textContent=" | ";
        }
        separators[i+2].style.display=(settings.custombuttons[i][0]&&settings.custombuttons[i][1])?"inline":"none";
        searchbar.appendChild(separators[i+2]);
        buttons[i+2].style.display=settings.custombuttons[i][0]?"inline":"none";
        searchbar.appendChild(buttons[i+2]);
      }
      highlightbuttonseparator=document.createTextNode(" | ");
      searchbar.appendChild(highlightbuttonseparator);
      searchbar.appendChild(buttons[1]);
      searchbar.appendChild(findbuttonsdiv);
      optionspagelinkseparator=document.createTextNode(" | ");
      searchbar.appendChild(optionspagelinkseparator);
      searchbar.appendChild(optionspagelink);
      updatesearchbarpreview();
    };
    var updatesearchbarpreview=function(){
      cross.style.display=settings.displaycross?"inline":"none";
      highlightbuttonseparator.textContent=(settings.displayhighlightbutton||settings.displayfindbuttons)?" | ":"";
      buttons[1].style.display=settings.displayhighlightbutton?"inline":"none";
      findbuttonsdiv.style.display=settings.displayfindbuttons?"inline":"none";
      optionspagelinkseparator.textContent=settings.displayoptionspagelink?" | ":"";
      optionspagelink.style.display=settings.displayoptionspagelink?"inline":"none";
    };
    resetsearchbarpreview();
    var hotkeysettings=["show","hide","highlight"];
    for (var i=0;i<hotkeysettings.length;i++){
      document.getElementById("hotkey"+hotkeysettings[i]).value=hotkeytotext(settings.hotkeys[hotkeysettings[i]]);
      document.getElementById("hotkey"+hotkeysettings[i]).addEventListener("keydown",(function(id){
        return function(event){
          if((event.keyCode<16||event.keyCode>18)&&event.keyCode!=9){
            settings.hotkeys[id]=[event.keyCode,event.altKey,event.ctrlKey,event.shiftKey];
            portupdate();
            chrome.storage.local.set({
              "hotkeys":settings.hotkeys
            },storageseterrorhandler);
            this.value=hotkeytotext(settings.hotkeys[id]);
            if(id=="show"){
              document.getElementById("hotkeyshowmirror").textContent=this.value;
            }
            cross.title="hide SearchBar"+(settings.hotkeys.hide[0]===false?"":(" ("+hotkeytotext(settings.hotkeys.hide)+")"));
            buttons[1].title="highlight search terms"+(settings.hotkeys.highlight[0]===false?"":(" ("+hotkeytotext(settings.hotkeys.highlight)+")"));
            event.preventDefault();
          }
        };
      })(hotkeysettings[i]));
    }
    document.getElementById("removehotkeyhighlight").addEventListener("click",function(){
      settings.hotkeys.highlight=[false,false,false,false];
      portupdate();
      chrome.storage.local.set({
        "hotkeys":settings.hotkeys
      },storageseterrorhandler);
      document.getElementById("hotkeyhighlight").value="";
      buttons[1].title="highlight search terms";
    });
    document.getElementById("hotkeyshowmirror").textContent=document.getElementById("hotkeyshow").value;
    var checkboxsettings=["showonsessionstartup","showontextselection","showontextselectionexception","forcepopup","displaycross","displayoptionspagelink","pinned","alwaysnewtab","alwaysforegroundtab","removewhitespace","imageproxy","sendsearchsuggestions","displayhighlightbutton","displayfindbuttons","detect","detecttosearchhistory","disablesearchhistory"];
    for(var i=0;i<checkboxsettings.length;i++){
      document.getElementById(checkboxsettings[i]).checked=settings[checkboxsettings[i]];
      document.getElementById(checkboxsettings[i]).addEventListener("change",(function(id){
        return function(){
          settings[id]=this.checked;
          portupdate();
          chrome.storage.local.set(JSON.parse("{\""+id+"\":"+settings[id].toString()+"}"),storageseterrorhandler);
          updatesearchbarpreview();
        }
      })(checkboxsettings[i]));
    }
    document.getElementById("showontextselection").addEventListener("change",function(){
      document.getElementById("showontextselectionexception").disabled=(!this.checked);
    });
    document.getElementById("sendsearchsuggestions").addEventListener("change",function(){
      document.getElementById("searchsuggestionslocale").disabled=(!this.checked);
      document.getElementById("maximumnumberofsearchsuggestions").disabled=(!this.checked);
    });
    document.getElementById("displayfindbuttons").addEventListener("change",function(){
      document.getElementById("maximumnumberoffindbuttons").disabled=(!this.checked);
      for(var i=0;i<settings.maximumnumberoffindbuttons;i++){
        for(var j=0;j<2;j++){
          findbuttonhotkeysinputs[i][j].disabled=(!this.checked);
          findbuttonhotkeysbuttons[i][j].disabled=(!this.checked);
        }
      }
    });
    document.getElementById("detect").addEventListener("change",function(){
      document.getElementById("detectprimary").disabled=(!this.checked);
      document.getElementById("notdetectprimary").disabled=(!this.checked);
      document.getElementById("detecttosearchhistory").disabled=(!this.checked)||document.getElementById("disablesearchhistory").checked;
      document.getElementById("detectcustom").disabled=(!this.checked)||document.getElementById("detectprimary").checked;
    });
    document.getElementById("disablesearchhistory").addEventListener("change",function(){
      document.getElementById("detecttosearchhistory").disabled=this.checked||(!document.getElementById("detect").checked);
    });
    var checkboxsettingsnot=["showingremember","searchremember","highlightingremember"];
    for(var i=0;i<checkboxsettingsnot.length;i++){
      document.getElementById("not"+checkboxsettingsnot[i]).checked=(!settings[checkboxsettingsnot[i]]);
      document.getElementById("not"+checkboxsettingsnot[i]).addEventListener("change",(function(id){
        return function(){
          settings[id]=(!this.checked);
          portupdate();
          chrome.storage.local.set(JSON.parse("{\""+id+"\":"+settings[id].toString()+"}"),storageseterrorhandler);
        }
      })(checkboxsettingsnot[i]));
    }
    var numberinputsettings=[["extrapixels",0,50],["maximumnumberoffindbuttons",1,100],["maximumnumberofsearchsuggestions",1,10],["maximumnumberofsearchhistorysuggestions",0,100]];
    for(var i=0;i<numberinputsettings.length;i++){
      document.getElementById(numberinputsettings[i][0]).value=settings[numberinputsettings[i][0]];
      document.getElementById(numberinputsettings[i][0]).addEventListener("change",(function(id,min,max){
        return function(){
          settings[id]=Math.min(max,Math.max(min,(parseInt(this.value,10))));
          this.value=settings[id];
          portupdate();
          if(id=="maximumnumberoffindbuttons"){
            while(findbuttonhotkeyautofills.length<settings.maximumnumberoffindbuttons){
              findbuttonhotkeyautofills.push(true);
            }
            findbuttonhotkeyautofills.length=settings.maximumnumberoffindbuttons;
            drawfindbuttonhotkeystable();
            chrome.storage.local.set({
              "maximumnumberoffindbuttons":settings.maximumnumberoffindbuttons,
              "findbuttonhotkeys":settings.findbuttonhotkeys
            },storageseterrorhandler);
          }
          else{
            chrome.storage.local.set(JSON.parse("{\""+id+"\":"+settings[id]+"}"),storageseterrorhandler);
          }
        };
      })(numberinputsettings[i][0],numberinputsettings[i][1],numberinputsettings[i][2]));
    }
    var radiosettings=["escfromanywhere","detectprimary","separatorsaslinebreaks"];
    for(var i=0;i<radiosettings.length;i++){
      document.getElementById((settings[radiosettings[i]]?"":"not")+radiosettings[i]).checked=true;
      document.getElementById(radiosettings[i]).addEventListener("change",(function(id){
        return function(){
          settings[id]=true;
          portupdate();
          chrome.storage.local.set(JSON.parse("{\""+id+"\":true}"),storageseterrorhandler);
        };
      })(radiosettings[i]));
      document.getElementById("not"+radiosettings[i]).addEventListener("change",(function(id){
        return function(){
          settings[id]=false;
          portupdate();
          chrome.storage.local.set(JSON.parse("{\""+id+"\":false}"),storageseterrorhandler);
        };
      })(radiosettings[i]));
    }
    document.getElementById("detectprimary").addEventListener("change",function(){
      document.getElementById("detectcustom").disabled=this.checked||(!document.getElementById("detect").checked);
    });
    document.getElementById("notdetectprimary").addEventListener("change",function(){
      document.getElementById("detectcustom").disabled=(!this.checked)||(!document.getElementById("detect").checked);
    });
    document.getElementById("extrapixels").addEventListener("change",resetsearchbarpreview);
    document.getElementById("separatorsaslinebreaks").addEventListener("change",resetsearchbarpreview);
    document.getElementById("notseparatorsaslinebreaks").addEventListener("change",resetsearchbarpreview);
    document.getElementById("position"+settings.position.join("")).checked=true;
    var verticalpositions=["top","bottom"];
    var horizontalpositions=["left","right"];
    for(var i=0;i<2;i++){
      for(var j=0;j<2;j++){
        document.getElementById("position"+verticalpositions[i]+horizontalpositions[j]).addEventListener("change",(function(verticalposition,horizontalposition){
          return function(){
            settings.position[0]=verticalposition;
            settings.position[1]=horizontalposition;
            portupdate();
            chrome.storage.local.set(JSON.parse("{\"position\":[\""+verticalposition+"\",\""+horizontalposition+"\"]}"),storageseterrorhandler);
            searchbar.style.textAlign=horizontalposition;
          };
        })(verticalpositions[i],horizontalpositions[j]));
      }
    }
    document.getElementById("direction"+settings.direction).checked=true;
    var directions=["initial","ltr","rtl"];
    for(var i=0;i<directions.length;i++){
      document.getElementById("direction"+directions[i]).addEventListener("change",(function(direction){
        return function(){
          settings.direction=direction;
          portupdate();
          chrome.storage.local.set(JSON.parse("{\"direction\":\""+direction+"\"}"),storageseterrorhandler);
          searchbar.style.direction=direction;
        };
      })(directions[i]));
    }
    document.getElementById("searchsuggestionslocale").selectedIndex=searchsuggestionslocales.indexOf(settings.searchsuggestionslocale);
    document.getElementById("searchsuggestionslocale").addEventListener("change",function(){
      settings.searchsuggestionslocale=searchsuggestionslocales[this.selectedIndex];
      portupdate();
      chrome.storage.local.set({
        "searchsuggestionslocale":settings.searchsuggestionslocale
      },storageseterrorhandler);
    });
    document.getElementById("detectcustom").value=settings.detectcustom.join("\n");
    var detectcustomupdate=function(){
      settings.detectcustom=this.value==""?[]:this.value.split("\n");
      portupdate();
      chrome.storage.local.set({
        "detectcustom":settings.detectcustom
      },storageseterrorhandler);
    };
    document.getElementById("detectcustom").addEventListener("keyup",detectcustomupdate);
    document.getElementById("detectcustom").addEventListener("change",detectcustomupdate);
    var findbuttonhotkeysinputs;
    var findbuttonhotkeysbuttons;
    var drawfindbuttonhotkeystable=function(){
      while(settings.findbuttonhotkeys.length<settings.maximumnumberoffindbuttons){
        settings.findbuttonhotkeys.push([[false,false,false,false],[false,false,false,false]]);
      }
      settings.findbuttonhotkeys.length=settings.maximumnumberoffindbuttons;
      while(document.getElementById("findbuttonhotkeys").hasChildNodes()){
        document.getElementById("findbuttonhotkeys").removeChild(document.getElementById("findbuttonhotkeys").lastChild);
      }
      findbuttonhotkeysinputs=[];
      findbuttonhotkeysbuttons=[];
      for(var i=0;i<settings.maximumnumberoffindbuttons;i++){
        var findbuttonhotkeysrow=document.createElement("tr");
        var findbuttonhotkeyscell=document.createElement("td");
        findbuttonhotkeyscell.appendChild(document.createTextNode((i+1).toString()));
        findbuttonhotkeyscell.className="findbuttonhotkeyscell";
        findbuttonhotkeysrow.appendChild(findbuttonhotkeyscell);
        findbuttonhotkeysinputs.push([document.createElement("input"),document.createElement("input")]);
        findbuttonhotkeysbuttons.push([document.createElement("button"),document.createElement("button")]);
        for(var j=0;j<2;j++){
          findbuttonhotkeyscell=document.createElement("td");
          findbuttonhotkeyscell.className="findbuttonhotkeyscell";
          findbuttonhotkeysinputs[i][j].size="25";
          findbuttonhotkeysinputs[i][j].value=hotkeytotext(settings.findbuttonhotkeys[i][j]);
          findbuttonhotkeysinputs[i][j].addEventListener("keydown",(function(i,j){
            return function(event){
              if((event.keyCode<16||event.keyCode>18)&&event.keyCode!=9){
                settings.findbuttonhotkeys[i][j]=[event.keyCode,event.altKey,event.ctrlKey,event.shiftKey];
                this.value=hotkeytotext(settings.findbuttonhotkeys[i][j]);
                if(j==0){
                  if(findbuttonhotkeyautofills[i]){
                    settings.findbuttonhotkeys[i][1]=event.shiftKey?[false,false,false,false]:[event.keyCode,event.altKey,event.ctrlKey,true];
                    findbuttonhotkeysinputs[i][1].value=hotkeytotext(settings.findbuttonhotkeys[i][1]);
                  }
                }
                else{
                  findbuttonhotkeyautofills[i]=false;
                }
                portupdate();
                chrome.storage.local.set({
                  "findbuttonhotkeys":settings.findbuttonhotkeys
                },storageseterrorhandler);
                if(i==0&&j==0){
                  findbuttons[1].title="find in page"+(settings.findbuttonhotkeys[0][0][0]===false?"":(" ("+hotkeytotext(settings.findbuttonhotkeys[0][0])+")"));
                }
                event.preventDefault();
              }
            };
          })(i,j));
          findbuttonhotkeyscell.appendChild(findbuttonhotkeysinputs[i][j]);
          findbuttonhotkeysbuttons[i][j].appendChild(document.createTextNode("remove"));
          findbuttonhotkeysbuttons[i][j].addEventListener("click",(function(i,j){
            return function(event){
              settings.findbuttonhotkeys[i][j]=[false,false,false,false];
              findbuttonhotkeysinputs[i][j].value="";
              if(j==0){
                if(findbuttonhotkeyautofills[i]){
                  settings.findbuttonhotkeys[i][1]=[false,false,false,false];
                  findbuttonhotkeysinputs[i][1].value="";
                }
              }
              else{
                findbuttonhotkeyautofills[i]=false;
              }              
              portupdate();
              chrome.storage.local.set({
                "findbuttonhotkeys":settings.findbuttonhotkeys
              },storageseterrorhandler);
              if(i==0&&j==0){
                findbuttons[1].title="find in page";
              }
            };
          })(i,j));
          findbuttonhotkeyscell.appendChild(findbuttonhotkeysbuttons[i][j]);
          findbuttonhotkeysrow.appendChild(findbuttonhotkeyscell);
        }
        document.getElementById("findbuttonhotkeys").appendChild(findbuttonhotkeysrow);
      }
    };
    drawfindbuttonhotkeystable();
    var findbuttonhotkeyautofills=[];
    for(var i=0;i<settings.maximumnumberoffindbuttons;i++){
      findbuttonhotkeyautofills.push((settings.findbuttonhotkeys[i][0][0]==false||settings.findbuttonhotkeys[i][0][3])?settings.findbuttonhotkeys[i][1][0]==false:isequal(settings.findbuttonhotkeys[i][1],[settings.findbuttonhotkeys[i][0][0],settings.findbuttonhotkeys[i][0][1],settings.findbuttonhotkeys[i][0][2],true]));
    }
    var dragging=[0,false];
    window.addEventListener("mousemove",function(event){
      if(dragging[0]>0&&disableall==false){
        var newposition=dragging[0];
        if(rows[dragging[0]].offsetTop+event.pageY-dragging[1]<=(rows[1].offsetTop+rows[2].offsetTop)/2){
          newposition=1;
        }
        else if(rows[dragging[0]].offsetTop+event.pageY-dragging[1]>(rows[settings.custombuttons.length-1].offsetTop+rows[settings.custombuttons.length].offsetTop)/2){
          newposition=settings.custombuttons.length;
        }
        else{
          for(var i=2;i<settings.custombuttons.length;i++){
            if((rows[dragging[0]].offsetTop+event.pageY-dragging[1]>(rows[i-1].offsetTop+rows[i].offsetTop)/2)&&(rows[dragging[0]].offsetTop+event.pageY-dragging[1]<=(rows[i].offsetTop+rows[i+1].offsetTop)/2)){
              newposition=i;
              break;
            }
          }
        }
        if(newposition!=dragging[0]){
          var direction=(newposition<dragging[0]?(-1):1);
          var newcustombutton=settings.custombuttons[dragging[0]-1];
          var newimage=settings["i"+dragging[0].toString()];
          var newstring="";
          var newhotkeyautofill=hotkeyautofills[dragging[0]];
          for(var i=dragging[0];i*direction<newposition*direction;i+=direction){
            settings.custombuttons[i-1]=settings.custombuttons[i-1+direction];
            settings["i"+i.toString()]=settings["i"+(i+direction).toString()];
            newstring+=",\"i"+i.toString()+"\":\""+settings["i"+i.toString()]+"\"";
            hotkeyautofills[i]=hotkeyautofills[i+direction];
            table.deleteRow(i);
            createtablerow(i);
          }
          settings.custombuttons[newposition-1]=newcustombutton;
          settings["i"+newposition.toString()]=newimage;
          newstring+=",\"i"+newposition.toString()+"\":\""+newimage+"\"";
          hotkeyautofills[newposition]=newhotkeyautofill;
          table.deleteRow(newposition);
          createtablerow(newposition);
          portupdate();
          chrome.storage.local.set(JSON.parse("{\"custombuttons\":"+JSON.stringify(settings.custombuttons)+newstring+"}"),storageseterrorhandler);
          resetsearchbarpreview();
          dragging[1]+=rows[newposition].offsetTop-rows[dragging[0]].offsetTop;
          dragging[0]=newposition;
        }
      }
    });
    window.addEventListener("mouseup",function(){
      dragging=[0,false];
    });  
    var table=document.getElementById("custombuttons");
    var inputsizes=["24","15","24","36","12","14","14","14"];
    var createtablerow=function(i){
      rows[i]=table.insertRow(i);
      cells[i]=[];
      propertiesbuttons[i]=[];
      inputs[i]=[];
      removehotkeys[i]=[];
      for(var j=0;j<8;j++){
        cells[i][j]=rows[i].insertCell(j);
        cells[i][j].className="custombuttoncell";
        if(j==2||j==3||j==4||j==6||j==7){
          cells[i][j].style.display=document.getElementById("toggleadvanced").showing?"table-cell":"none";
        }
        if(i==1){
          cells[i][j].style.backgroundColor="#f0f0f0";
          cells[i][j].style.borderTop="1px solid #d0d0d0";
          cells[i][j].style.borderBottom="1px solid #d0d0d0";
          cells[i][j].style.borderLeft="2px solid #f0f0f0";
          cells[i][j].style.borderRight="2px solid #f0f0f0";
          cells[i][j].title="primary search (Enter)";
        }
        if(j==0){
          propertiesbuttons[i]=[document.createElement("img"),document.createElement("img")];
          propertiesbuttons[i][0].src="delete.png";
          propertiesbuttons[i][0].title="delete";
          propertiesbuttons[i][0].alt=propertiesbuttons[i][0].title;
          propertiesbuttons[i][0].style.height="16px";
          propertiesbuttons[i][0].style.height="16px";
          propertiesbuttons[i][0].style.verticalAlign="-1px";
          propertiesbuttons[i][0].style.cursor="pointer";
          propertiesbuttons[i][0].addEventListener("click",(function(i){
            return function(){
              if(disableall==false&&confirm("Are you sure you want to delete this custom search?")){
                settings.custombuttons.splice(i-1,1);
                var settingsobject={"custombuttons":settings.custombuttons};
                for(var l=i;l<settings.custombuttons.length+1;l++){
                  settings["i"+l.toString()]=settings["i"+(l+1).toString()];
                  settingsobject["i"+l.toString()]=settings["i"+l.toString()];
                }
                delete(settings["i"+(settings.custombuttons.length+1).toString()]);
                portupdate();
                chrome.storage.local.set(settingsobject,function(){
                  storageseterrorhandler();
                  chrome.storage.local.remove("i"+(settings.custombuttons.length+1).toString(),storageseterrorhandler);
                });
                resetsearchbarpreview();
                hotkeyautofills.splice(i,1);
                for(var l=i;l<settings.custombuttons.length+1;l++){
                  table.deleteRow(l);
                  createtablerow(l);
                }
                table.deleteRow(settings.custombuttons.length+1);
              }
            };
          })(i));
          inputs[i][j]=[document.createElement("input"),document.createElement("input")];
          for(k=0;k<2;k++){
            if(k==1){
              inputs[i][j][k].disabled=(!settings.custombuttons[i-1][0]);
            }
            inputs[i][j][k].type="checkbox";
            inputs[i][j][k].checked=settings.custombuttons[i-1][k];
            inputs[i][j][k].title=inputs[i][j][k].checked?("uncheck to "+(k==0?"disable":"remove separator before button")):("check to "+(k==0?"enable":"insert separator before button"));
            inputs[i][j][k].addEventListener("change",(function(i,j,k){
              return function(){
                this.title=this.checked?("uncheck to "+(k==0?"disable":"remove separator before button")):("check to "+(k==0?"enable":"insert separator before button"));
                if(k==0){
                  inputs[i][j][1].disabled=(!this.checked);
                  for(l=1;l<8;l++){
                    inputs[i][l].disabled=(!this.checked);
                    if(l>4){
                      removehotkeys[i][l].disabled=(!this.checked);
                    }
                  }
                  fileinputbuttons[i].disabled=(!this.checked);
                }
                settings.custombuttons[i-1][k]=this.checked;
                portupdate();
                chrome.storage.local.set({
                  "custombuttons":settings.custombuttons
                },storageseterrorhandler);
                separators[i+1].style.display=(settings.custombuttons[i-1][0]&&settings.custombuttons[i-1][1])?"inline":"none";
                buttons[i+1].style.display=settings.custombuttons[i-1][0]?"inline":"none";
                if(settings.separatorsaslinebreaks){
                  resetsearchbarpreview();
                }
              };
            })(i,j,k));
          }
          propertiesbuttons[i][1].src="move.png";
          propertiesbuttons[i][1].title="click and drag to move button";
          propertiesbuttons[i][1].alt=propertiesbuttons[i][1].title;
          propertiesbuttons[i][1].style.height="19px";
          propertiesbuttons[i][1].style.width="19px";
          propertiesbuttons[i][1].style.verticalAlign="-2px";
          propertiesbuttons[i][1].style.cursor="pointer";
          propertiesbuttons[i][1].addEventListener("mousedown",(function(i){
            return function(event){
              document.activeElement.blur();
              dragging=[i,event.pageY];
              event.preventDefault();
            };
          })(i));
          cells[i][j].appendChild(propertiesbuttons[i][0]);
          cells[i][j].appendChild(inputs[i][j][0]);
          cells[i][j].appendChild(propertiesbuttons[i][1]);
          cells[i][j].appendChild(inputs[i][j][1]);
        }
        else{
          inputs[i][j]=document.createElement("input");
          inputs[i][j].type="text";
          inputs[i][j].size=j==1?(document.getElementById("toggleadvanced").showing?inputsizes[1]:inputsizes[0]):inputsizes[j];
          inputs[i][j].disabled=(!settings.custombuttons[i-1][0]);
          cells[i][j].appendChild(inputs[i][j]);
          if(j<4){
            inputs[i][j].value=settings.custombuttons[i-1][j+2];
            inputs[i][j].changefunction=(function(i,j){
              return function(){
                settings.custombuttons[i-1][j+2]=this.value;
                portupdate();
                chrome.storage.local.set({
                  "custombuttons":settings.custombuttons
                },storageseterrorhandler);
                buttons[i+1].title=settings.custombuttons[i-1][3];
                images[i+1].alt=settings.custombuttons[i-1][3];
              };
            })(i,j);
            inputs[i][j].addEventListener("keyup",inputs[i][j].changefunction);
            inputs[i][j].addEventListener("change",inputs[i][j].changefunction);
          }
          else if(j==4){
            inputs[i][j].value=settings["i"+i.toString()];
            fileinputbuttons[i]=document.createElement("button");
            fileinputbuttons[i].disabled=(!settings.custombuttons[i-1][0]);
            fileinputbuttons[i].appendChild(document.createTextNode("upload"));
            cells[i][j].appendChild(fileinputbuttons[i]);
            fileinputs[i]=document.createElement("input");
            fileinputs[i].type="file";
            fileinputs[i].accept="image/*";
            fileinputs[i].style.display="none";
            cells[i][j].appendChild(fileinputs[i]);
            inputs[i][j].changefunction=(function(i){
              return function(){
                fileinputs[i].value="";
                settings["i"+i.toString()]=this.value;
                portupdate();
                chrome.storage.local.set(JSON.parse("{\"i"+i.toString()+"\":\""+settings["i"+i.toString()]+"\"}"),storageseterrorhandler);
                images[i+1].src=settings["i"+i.toString()];
              };
            })(i);
            inputs[i][j].addEventListener("keyup",inputs[i][j].changefunction);
            inputs[i][j].addEventListener("change",inputs[i][j].changefunction);
            fileinputbuttons[i].addEventListener("click",(function(i){
              return function(){
                fileinputs[i].click();
              };
            })(i));
            fileinputs[i].addEventListener("change",(function(i){
              return function(){
                getimagedata(fileinputs[i],function(imagedata){
                  inputs[i][4].value=imagedata;
                  inputs[i][4].changefunction();
                });
              };
            })(i));
          }
          else{
            removehotkeys[i][j]=document.createElement("button");
            removehotkeys[i][j].className="removebutton";
            removehotkeys[i][j].title="remove";
            removehotkeys[i][j].disabled=(!settings.custombuttons[i-1][0]);
            removehotkeys[i][j].innerHTML="<img src=\"delete.png\" alt=\"remove\" class=\"removebuttonimage\">";
            cells[i][j].appendChild(removehotkeys[i][j]);
            inputs[i][j].value=hotkeytotext(settings.custombuttons[i-1][2][j-5]);
            inputs[i][j].addEventListener("keydown",(function(i,j){
              return function(event){
                if((event.keyCode<16||event.keyCode>18)&&event.keyCode!=9){
                  settings.custombuttons[i-1][2][j-5]=[event.keyCode,event.altKey,event.ctrlKey,event.shiftKey];
                  this.value=hotkeytotext(settings.custombuttons[i-1][2][j-5]);
                  if(j==5){
                    if(hotkeyautofills[i][0]){
                      settings.custombuttons[i-1][2][1]=event.ctrlKey?[false,false,false,false]:[event.keyCode,event.altKey,true,event.shiftKey];
                      inputs[i][6].value=hotkeytotext(settings.custombuttons[i-1][2][1]);
                    }
                    if(hotkeyautofills[i][1]){
                      settings.custombuttons[i-1][2][2]=(event.ctrlKey||event.shiftKey)?[false,false,false,false]:[event.keyCode,event.altKey,true,true];
                      inputs[i][7].value=hotkeytotext(settings.custombuttons[i-1][2][2]);
                    }
                  }
                  else if(j==6){
                    if(hotkeyautofills[i][1]){
                      settings.custombuttons[i-1][2][2]=((!event.ctrlKey)||event.shiftKey)?[false,false,false,false]:[event.keyCode,event.altKey,true,true];
                      inputs[i][7].value=hotkeytotext(settings.custombuttons[i-1][2][2]);
                    }
                    hotkeyautofills[i][0]=false;
                  }
                  else{
                    hotkeyautofills[i][1]=false;
                  }
                  portupdate();
                  chrome.storage.local.set({
                    "custombuttons":settings.custombuttons
                  },storageseterrorhandler);
                  event.preventDefault();
                }
              };
            })(i,j));
            removehotkeys[i][j].addEventListener("click",(function(i,j){
              return function(){
                settings.custombuttons[i-1][2][j-5]=[false,false,false,false];
                inputs[i][j].value="";
                if(j==5){
                  if(hotkeyautofills[i][0]){
                    settings.custombuttons[i-1][2][1]=[false,false,false,false];
                    inputs[i][6].value="";
                  }
                  if(hotkeyautofills[i][1]){
                    settings.custombuttons[i-1][2][2]=[false,false,false,false];
                    inputs[i][7].value="";
                  }
                }
                else if(j==6){
                  if(hotkeyautofills[i][1]){
                    settings.custombuttons[i-1][2][2]=[false,false,false,false];
                    inputs[i][7].value="";
                  }
                  hotkeyautofills[i][0]=false;
                }
                else{
                  hotkeyautofills[i][1]=false;
                }
                portupdate();
                chrome.storage.local.set({
                  "custombuttons":settings.custombuttons
                },storageseterrorhandler);
              };
            })(i,j));
          }
        }
      }
    };
    var rows=[];
    var cells=[];
    cells[0]=false;
    var propertiesbuttons=[];
    var inputs=[];
    var fileinputbuttons=[];
    var fileinputs=[];
    inputs[0]=false;
    var removehotkeys=[];
    var hotkeyautofills=[];
    for(var i=1;i<settings.custombuttons.length+1;i++){
      hotkeyautofills[i]=[];
      hotkeyautofills[i][0]=(settings.custombuttons[i-1][2][0][0]==false||settings.custombuttons[i-1][2][0][2])?(settings.custombuttons[i-1][2][1][0]==false&&settings.custombuttons[i-1][2][2][0]==false):(settings.custombuttons[i-1][2][0][3]?(isequal(settings.custombuttons[i-1][2][1],[settings.custombuttons[i-1][2][0][0],settings.custombuttons[i-1][2][0][1],true,true])&&settings.custombuttons[i-1][2][2][0]==false):(isequal(settings.custombuttons[i-1][2][1],[settings.custombuttons[i-1][2][0][0],settings.custombuttons[i-1][2][0][1],true,false])&&isequal(settings.custombuttons[i-1][2][2],[settings.custombuttons[i-1][2][0][0],settings.custombuttons[i-1][2][0][1],true,true])));
      hotkeyautofills[i][1]=hotkeyautofills[i][0];
      createtablerow(i);
    }
    var newrowinputs=[];
    var newrowhotkeyautofill=[true,true];
    for(var i=1;i<8;i++){
      newrowinputs[i]=document.getElementById("newrowinput"+i.toString());
      newrowinputs[i].size=inputsizes[i];
      newrowinputs[i].hotkeyvalue=[false,false,false,false];
      if(i==4){
        newrowinputs[i].addEventListener("change",function(){
          newrowfileinput.value="";
        });
      }
      if(i>4){
        newrowinputs[i].addEventListener("keydown",(function(i){
          return function(event){
            if((event.keyCode<16||event.keyCode>18)&&event.keyCode!=9){
              this.hotkeyvalue=[event.keyCode,event.altKey,event.ctrlKey,event.shiftKey];
              this.value=hotkeytotext(this.hotkeyvalue);
              if(i==5){
                if(newrowhotkeyautofill[0]){
                  newrowinputs[6].hotkeyvalue=event.ctrlKey?[false,false,false,false]:[event.keyCode,event.altKey,true,event.shiftKey];
                  newrowinputs[6].value=hotkeytotext(newrowinputs[6].hotkeyvalue);
                }
                if(newrowhotkeyautofill[1]){
                  newrowinputs[7].hotkeyvalue=(event.ctrlKey||event.shiftKey)?[false,false,false,false]:[event.keyCode,event.altKey,true,true];
                  newrowinputs[7].value=hotkeytotext(newrowinputs[7].hotkeyvalue);
                }
              }
              else if(i==6){
                if(newrowhotkeyautofill[1]){
                  newrowinputs[7].hotkeyvalue=((!event.ctrlKey)||event.shiftKey)?[false,false,false,false]:[event.keyCode,event.altKey,true,true];
                  newrowinputs[7].value=hotkeytotext(newrowinputs[7].hotkeyvalue);
                }
                newrowhotkeyautofill[0]=false;
              }
              else{
                newrowhotkeyautofill[1]=false;
              }
              event.preventDefault();
            }
          };
        })(i));
        document.getElementById("newrowremovehotkey"+((i-4).toString())).addEventListener("click",(function(i){
          return function(){
            newrowinputs[i].hotkeyvalue=[false,false,false,false];
            newrowinputs[i].value="";
            if(i==5){
              if(newrowhotkeyautofill[0]){
                newrowinputs[6].hotkeyvalue=[false,false,false,false];
                newrowinputs[6].value="";
              }
              if(newrowhotkeyautofill[1]){
                newrowinputs[7].hotkeyvalue=[false,false,false,false];
                newrowinputs[7].value="";
              }
            }
            else if(i==6){
              if(newrowhotkeyautofill[1]){
                newrowinputs[7].hotkeyvalue=[false,false,false,false];
                newrowinputs[7].value="";
              }
              newrowhotkeyautofill[0]=false;
            }
            else{
              newrowhotkeyautofill[1]=false;
            }
          };
        })(i));
      }
    }
    document.getElementById("newrowfileinputbutton").addEventListener("click",function(){
      document.getElementById("newrowfileinput").click();
    });
    document.getElementById("newrowfileinput").addEventListener("change",function(){
      getimagedata(document.getElementById("newrowfileinput"),function(imagedata){
        document.getElementById("newrowinput4").value=imagedata;
      });
    });
    document.getElementById("newrowcreatenew").addEventListener("click",function(){
      if(disableall==false){
        settings.custombuttons[settings.custombuttons.length]=[true,false,[newrowinputs[5].hotkeyvalue,newrowinputs[6].hotkeyvalue,newrowinputs[7].hotkeyvalue],newrowinputs[1].value,newrowinputs[2].value,newrowinputs[3].value];
        settings["i"+settings.custombuttons.length.toString()]=newrowinputs[4].value;
        portupdate();
        chrome.storage.local.set(JSON.parse("{\"custombuttons\":"+JSON.stringify(settings.custombuttons)+",\"i"+settings.custombuttons.length.toString()+"\":\""+settings["i"+settings.custombuttons.length.toString()]+"\"}"),storageseterrorhandler);
        resetsearchbarpreview();
        hotkeyautofills[settings.custombuttons.length]=newrowhotkeyautofill;
        createtablerow(settings.custombuttons.length);
        for(var i=1;i<8;i++){
          newrowinputs[i].value="";
          newrowhotkeyautofill=[true,true];
          if(i>4){
            newrowinputs[i].hotkeyvalue=[false,false,false,false];
          }
        }
      }
    });
    if(window.name==""){
      window.name="basic";
    }
    document.getElementById("toggleadvanced").showing=window.name=="advanced"?false:true;
    document.getElementById("toggleadvanced").clickfunction=function(){
      this.showing=!this.showing;
      window.name=this.showing?"advanced":"basic";
      this.textContent=this.showing?"hide advanced options":"show advanced options";
      for(var j=0;j<8;j++){
        if(j==2||j==3||j==4||j==6||j==7){
          document.getElementsByClassName("custombuttonsheader")[j].style.display=this.showing?"table-cell":"none";
          for(var i=1;i<cells.length;i++){
            cells[i][j].style.display=this.showing?"table-cell":"none";
          }
        }
      }
      for(var i=1;i<inputs.length;i++){
        inputs[i][1].size=this.showing?inputsizes[1]:inputsizes[0];
      }
      document.getElementById("newrow").style.display=this.showing?"table-row":"none";
      document.getElementById("notes").style.display=this.showing?"block":"none";
    }
    document.getElementById("toggleadvanced").clickfunction();
    document.getElementById("toggleadvanced").addEventListener("click",document.getElementById("toggleadvanced").clickfunction);
    document.getElementById("portselectall").addEventListener("click",function(){
      document.getElementById("porttext").select();
    });
    document.getElementById("portsavechanges").addEventListener("click",function(){
      disableall=true;
      inputtags=document.getElementsByTagName("input");
      for (var i=0;i<inputtags.length;i++){
        inputtags[i].disabled=true;
      }
      buttontags=document.getElementsByTagName("button");
      for(var i=0;i<buttontags.length;i++){
        buttontags[i].disabled=true;
      }
      document.getElementById("searchsuggestionslocale").disabled=true;
      document.getElementById("detectcustom").disabled=true;
      document.getElementById("porttext").disabled=true;
      if(document.getElementById("porttext").value==""){
        chrome.runtime.sendMessage("defaultsettings",function(defaultsettings){
          chrome.storage.local.clear(function(){
            chrome.storage.local.set(defaultsettings,function(){
              window.location.reload(false);
            });
          });
        });
      }
      else{
        chrome.storage.local.set(JSON.parse(document.getElementById("porttext").value),function(){
          storageseterrorhandler();
          window.location.reload(false);
        });
      }
    });
    var portupdate=function(){
      var stringifiedsettings=JSON.stringify(settings);
      document.getElementById("porttext").value=stringifiedsettings;
      if(stringifiedsettings.length>65535){
        document.getElementById("portwarning").style.display="inline";
      }
      else{
        document.getElementById("portwarning").style.display="none";
      }
      window.clearTimeout(changedtimeout);
    };
    portupdate();
    for(var i=0;i<inputtags.length;i++){
      inputtags[i].disabled=false;
    }
    for(var i=0;i<buttontags.length;i++){
      buttontags[i].disabled=false;
    }
    document.getElementById("showontextselectionexception").disabled=(!document.getElementById("showontextselection").checked);
    document.getElementById("searchsuggestionslocale").disabled=(!document.getElementById("sendsearchsuggestions").checked);
    document.getElementById("maximumnumberofsearchsuggestions").disabled=(!document.getElementById("sendsearchsuggestions").checked);
    document.getElementById("maximumnumberoffindbuttons").disabled=(!document.getElementById("displayfindbuttons").checked);
    for(var i=0;i<settings.maximumnumberoffindbuttons;i++){
      for(var j=0;j<2;j++){
        findbuttonhotkeysinputs[i][j].disabled=(!document.getElementById("displayfindbuttons").checked);
        findbuttonhotkeysbuttons[i][j].disabled=(!document.getElementById("displayfindbuttons").checked);
      }
    }
    document.getElementById("detectprimary").disabled=(!document.getElementById("detect").checked);
    document.getElementById("notdetectprimary").disabled=(!document.getElementById("detect").checked);
    document.getElementById("detecttosearchhistory").disabled=(!document.getElementById("detect").checked)||(document.getElementById("disablesearchhistory").checked);
    document.getElementById("detectcustom").disabled=(!document.getElementById("detect").checked)||document.getElementById("detectprimary").checked;
    document.getElementById("porttext").disabled=false;
    chrome.storage.onChanged.addListener(function(changes,areaName){
      var changed=false;
      for(var key in changes){
        if(!isequal(changes[key].newValue,settings[key])){
          changed=key;
        }
      }
      if(changed!=false){
        window.clearTimeout(changedtimeout);
        changedtimeout=window.setTimeout((function(changed){
          return function(){
            chrome.storage.local.get(changed,(function(changed){
              return function(newsettings){
                if(!isequal(settings[changed],newsettings[changed])){
                  window.location.reload(false);
                }
              };
            })(changed));
          };
        })(changed),500);
      }
    });
  });
});
