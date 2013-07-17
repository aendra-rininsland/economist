var labelType, useGradients, nativeTextSupport, animate;
var currentParentDepth = 0;

if (typeof window.gid === "undefined") {
	var gid = 0;
}

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport 
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
  elem: false,
  write: function(text){
    if (!this.elem) 
      this.elem = document.getElementById('log');
    this.elem.innerHTML = text;
    this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
  }
};


function init(){

var json = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': 'get_by_sport.php?sheet=' + gid,
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
	//console.dir(json);    
    return json;
})(); 


var json2 = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': 'get_by_country.php?sheet=' + gid,
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
	//console.dir(json);    
    return json;
})(); 

  var tm = new $jit.TM.Squarified({
    //where to inject the visualization
    injectInto: 'infovis',
    //parent box title heights
    titleHeight: 15,
    //enable animations
//    animate: animate,
//	animation: false,
    //box offsets
    offset: 1,
    //show two levels initially
    levelsToShow: 2,
    constrained: true,
    //use cushions
//    cushion: 'useGradients',
    //Attach left and right click events
    Events: {
      enable: true,
      onClick: function(node) {
        if(node && currentParentDepth < 3) {
			if (node.id === "root") {
			tm.config.levelsToShow = 2;  
    	} else {
    		tm.config.levelsToShow = 1; 
    		}
        	tm.enter(node);
        }
      },
      onRightClick: function() { 
      		//console.dir(tm);
      		if(currentParentDepth < 2) {
			tm.config.levelsToShow = 2;  
			}
        tm.out();
      }
    },
    duration: 1000,
    //Enable tips
    Tips: {
      enable: true,
      //add positioning offsets
      offsetX: 20,
      offsetY: 20,
      //implement the onShow method to
      //add content to the tooltip when a node
      //is hovered
      onShow: function(tip, node, isLeaf, domElement) {
        var html = "<div class=\"tip-title\"><strong>" + node.name 
          + "</strong></div><div class=\"tip-text\">";
        var data = node.data;
        if(data.recipients) {
          if (data.recipients != 'null') {
	          if (currentParentDepth == 1) {
	             html += "Gold medal: "
	          } else {
		          html += "Recipient: "
		      }
		          html += data.recipients + "<br>";        
          }
	        if(data.country != "null") { 
	          html += "Country: " + data.country;          
	        }
       	}
        tip.innerHTML =  html; 
      }  
    },

    
    //Add the name of the node in the correponding label
    //This method is called once, on label creation.    
    onCreateLabel: function(domElement, node){
        var html = ""
		/*if (tm.leaf(node)|| (node._depth == currentParentDepth)) {
	        html = "<div class=\"node-title\" style=\"width: auto; margin: 0px auto; background: #333; height: 15px;\">" + node.name + "</div>";
	    } else {
	        html = "<div class=\"node-title\" style=\"width: 100%; margin: 0px auto; background: #333; height: 13px;\">" + node.name + "</div>";
	    
	    }
        domElement.innerHTML = html;*/
        domElement.innerHTML = node.name;
        var style = domElement.style;
        style.display = '';
        style.color = '#000000';
        style.border = '1px solid transparent';
        domElement.onmouseover = function() {
          style.border = '1px solid #9FD4FF';
        };
        domElement.onmouseout = function() {
          style.border = '1px solid transparent';
        };
        
    },
    
	//sets the selected node depth as the .currentParentDepth
    onBeforeCompute : function(node){
    	if ((typeof currentParentDepth === "undefined") || (typeof node._depth === "undefined") ) {
    		currentParentDepth = 0;
    	}
    	else {
	    	currentParentDepth = node._depth; 
    	}

    	/*if (node.id === "root") {
			tm.config.levelsToShow = 2;  
			tm.plot();    	
    	} else {
    		tm.config.levelsToShow = 1;      	
    	}*/
//    	console.dir(node);
    	//console.log("Depth: " + currentParentDepth);
    	//console.log("LevelsToShow: " + tm.config.levelsToShow);
    },
        
    onPlaceLabel: function(domElement, node){
		if (currentParentDepth == 0) {
        	if (node._depth > 1) {
        		domElement.style.display = 'none';
        	} else {
        		domElement.style.display = '';        	
        	}
        } else if (currentParentDepth == 1) {
        	if (node._depth > 2) {
        		domElement.style.display = 'none';
        	} else {
        		domElement.style.display = '';        	
        	}  
        }
    }
  });
  tm.loadJSON(json);
  tm.refresh();
  //end
  //add events to radio buttons
  var sq = $jit.id('r-sq'),
      st = $jit.id('r-st'),
      sd = $jit.id('r-sd'),
      vg = $jit.id('v-games'),
      vc = $jit.id('v-country');
  var util = $jit.util;
  util.addEvent(sq, 'change', function() {
    if(!sq.checked) return;
    util.extend(tm, new $jit.Layouts.TM.Squarified);
    tm.refresh();
  });
  util.addEvent(st, 'change', function() {
    if(!st.checked) return;
    util.extend(tm, new $jit.Layouts.TM.Strip);
    tm.layout.orientation = "v";
    tm.refresh();
  });
  util.addEvent(sd, 'change', function() {
    if(!sd.checked) return;
    util.extend(tm, new $jit.Layouts.TM.SliceAndDice);
    tm.layout.orientation = "v";
    tm.refresh();
  });
  
  util.addEvent(vg, 'change', function() {
    if(!vg.checked) return;
	tm.out(); tm.out(); tm.out(); tm.out();	
	currentParentDepth = 0;	 	
	tm.loadJSON(json);		
    tm.refresh();
   
  });
  
  util.addEvent(vc, 'change', function() {
    if(!vc.checked) return;
	tm.out(); tm.out(); tm.out(); tm.out();	        		
   	currentParentDepth = 0;	    	
    tm.loadJSON(json2);	    
    tm.refresh();    
  });    
  //add event to the back button
  var back = $jit.id('back');
  $jit.util.addEvent(back, 'click', function() {
	if(currentParentDepth < 2) {
		tm.config.levelsToShow = 2;  
	}  
    tm.out();
  });
// }); //end jQuery getJSON call. 
}
