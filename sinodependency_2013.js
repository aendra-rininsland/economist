var labelType, useGradients, nativeTextSupport, animate;
var currentParentDepth = 0,
	selected_cat = 'all',
	selected_year = '2013';

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

var json2013 = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': 'fetch_sinoindex_json_2013.php?year=2013',
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });

  //console.dir(json);
    return json;
})();


var json = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': 'fetch_sinoindex_json.php?year=2012',
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
        'url': 'fetch_sinoindex_json.php?year=2010',
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
	//console.dir(json);
    return json;
})();

var json3 = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': 'fetch_sinoindex_json.php?year=2009',
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
    levelsToShow: 3,
    constrained: true,
    //use cushions
//    cushion: 'useGradients',
    //Attach left and right click events
    Events: {
      enable: true,
      /*onClick: function(node) {
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
      }*/
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
        if (typeof node.data.year != 'undefined') {
	        var data = node.data;
	        var weight;
	        var year = data.year;
	        if (data.year === "2013") {
	          weight = data.Weight2013;
	        } else if (data.year === "2012") {
	        	weight = data.Weight2012;
          } else if (data.year === "2011") {
            weight = data.Weight2011;
	        } else if (data.year === "2010") {
	        	weight = data.Weight2010;
	        } else if (data.year === "2009") {
	        	weight = data.Weight2009;
	        }
	        html += year + ": " + weight + "%<br />";
	        html += "(" + data.industry + ")";
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

    /*onPlaceLabel: function(domElement, node){
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
    }*/
  });
  tm.loadJSON(json2013);
  tm.refresh();
  //end
  //add events to radio buttons
  var sq = $jit.id('r-sq'),
      st = $jit.id('r-st'),
      sd = $jit.id('r-sd'),
      viz2013 = $jit.id('2013'),
      viz2012 = $jit.id('2012'),
      viz2011 = $jit.id('2011'),
      viz2010 = $jit.id('2010'),
      viz2009 = $jit.id('2009'),
      group_by_sector = $jit.id('group_by_sector');
  /*    cat_basic_materials = $jit.id('cat_basic_materials'),
      cat_communications = $jit.id('cat_communications'),
      cat_consumer_cyclical = $jit.id('cat_consumer_cyclical'),
      cat_consumer_noncyclical = $jit.id('cat_consumer_noncyclical'),
      cat_financial = $jit.id('cat_financial'),
      cat_industrial = $jit.id('cat_industrial'),
      cat_technology = $jit.id('cat_technology'),
      cat_utilities = $jit.id('cat_utilities');  */

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

  util.addEvent(viz2013, 'change', function() {
    if(!viz2013.checked) return;
  jQuery('.country-legend td').each(function(){
          var theCurrent = jQuery(this).children('a').attr('id');
            jQuery(this).removeClass('disabled');
        });
  selected_cat = 'all';
  selected_year = '2013';
  tm.out(); tm.out(); tm.out(); tm.out();
  currentParentDepth = 0;
  if (group_by_sector.checked != true) {
    var json = (function () {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': 'fetch_sinoindex_json_2013.php?year=2013',
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();
  } else {
    var json = (function () {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': 'fetch_sinoindex_json_2013.php?year=2013&group_by_sector=TRUE',
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();
  }
  tm.loadJSON(json);
    tm.refresh();

  });

  util.addEvent(viz2012, 'change', function() {
    if(!viz2012.checked) return;
	jQuery('.country-legend td').each(function(){
	  			var theCurrent = jQuery(this).children('a').attr('id');
	  				jQuery(this).removeClass('disabled');
	  		});
	selected_cat = 'all';
	selected_year = '2012';
	tm.out(); tm.out(); tm.out(); tm.out();
	currentParentDepth = 0;
	if (group_by_sector.checked != true) {
		var json = (function () {
		    var json = null;
		    $.ajax({
		        'async': false,
		        'global': false,
		        'url': 'fetch_sinoindex_json_2013.php?year=2012',
		        'dataType': "json",
		        'success': function (data) {
		            json = data;
		        }
		    });
		    return json;
		})();
	} else {
		var json = (function () {
		    var json = null;
		    $.ajax({
		        'async': false,
		        'global': false,
		        'url': 'fetch_sinoindex_json_2013.php?year=2012&group_by_sector=TRUE',
		        'dataType': "json",
		        'success': function (data) {
		            json = data;
		        }
		    });
		    return json;
		})();
	}
	tm.loadJSON(json);
    tm.refresh();

  });

  util.addEvent(viz2010, 'change', function() {
    if(!viz2010.checked) return;
	jQuery('.country-legend td').each(function(){
	  			var theCurrent = jQuery(this).children('a').attr('id');
	  				jQuery(this).removeClass('disabled');
	  		});
	selected_cat = 'all';
	selected_year = '2010';
	tm.out(); tm.out(); tm.out(); tm.out();
   	currentParentDepth = 0;
	if (group_by_sector.checked != true) {
		var json = (function () {
		    var json = null;
		    $.ajax({
		        'async': false,
		        'global': false,
		        'url': 'fetch_sinoindex_json_2013.php?year=2010',
		        'dataType': "json",
		        'success': function (data) {
		            json = data;
		        }
		    });
		    return json;
		})();
	} else {
		var json = (function () {
		    var json = null;
		    $.ajax({
		        'async': false,
		        'global': false,
		        'url': 'fetch_sinoindex_json_2013.php?year=2010&group_by_sector=TRUE',
		        'dataType': "json",
		        'success': function (data) {
		            json = data;
		        }
		    });
		    return json;
		})();
	}
    tm.loadJSON(json);
    tm.refresh();
  });

  util.addEvent(viz2009, 'change', function() {
    if(!viz2009.checked) return;
	jQuery('.country-legend td').each(function(){
	  			var theCurrent = jQuery(this).children('a').attr('id');
	  				jQuery(this).removeClass('disabled');
	  		});
	selected_cat = 'all';
	selected_year = '2009';
	tm.out(); tm.out(); tm.out(); tm.out();
   	currentParentDepth = 0;
	if (group_by_sector.checked != true) {
		var json = (function () {
		    var json = null;
		    $.ajax({
		        'async': false,
		        'global': false,
		        'url': 'fetch_sinoindex_json_2013.php?year=2009',
		        'dataType': "json",
		        'success': function (data) {
		            json = data;
		        }
		    });
		    return json;
		})();
	} else {
		var json = (function () {
		    var json = null;
		    $.ajax({
		        'async': false,
		        'global': false,
		        'url': 'fetch_sinoindex_json_2013.php?year=2009&group_by_sector=TRUE',
		        'dataType': "json",
		        'success': function (data) {
		            json = data;
		        }
		    });
		    return json;
		})();
	}
    tm.loadJSON(json);
    tm.refresh();
  });

  util.addEvent(group_by_sector, 'change', function() {
    if(group_by_sector.checked != true) {
	    var json = (function () {
				    var json = null;
				    $.ajax({
				        'async': false,
				        'global': false,
				        'url': 'fetch_sinoindex_json_2013.php?year=' + selected_year,
				        'dataType': "json",
				        'success': function (data) {
				            json = data;
				        }
				    });

					//console.dir(json);
				    return json;
				})();
    } else {
	    var json = (function () {
				    var json = null;
				    $.ajax({
				        'async': false,
				        'global': false,
				        'url': 'fetch_sinoindex_json_2013.php?year=' + selected_year + '&group_by_sector=TRUE',
				        'dataType': "json",
				        'success': function (data) {
				            json = data;
				        }
				    });

					//console.dir(json);
				    return json;
				})();
    }

	selected_cat = 'all';
   	currentParentDepth = 0;
    tm.loadJSON(json);
    tm.refresh();


  });

  //The following adds events for each category idea.
  jQuery('.country-legend td a').each(function(){
  	  var current_link_id = jQuery(this).attr('id');
  	  var current_link = $jit.id(current_link_id);

	  util.addEvent(current_link, 'click', function(){
	  	if (selected_cat === 'all') { //no category selected; select this.
	  		jQuery('.country-legend td').each(function(){
	  			var theCurrent = jQuery(this).children('a').attr('id');
	  			if (theCurrent != current_link_id) {
	  				jQuery(this).addClass('disabled');
	  			}
	  		});
	  		selected_cat = current_link_id;
		  	var json = (function () {
			    var json = null;
			    $.ajax({
			        'async': false,
			        'global': false,
			        'url': 'fetch_sinoindex_json_2013.php?year=' + selected_year + '&cat=' + selected_cat,
			        'dataType': "json",
			        'success': function (data) {
			            json = data;
			        }
			    });

				//console.dir(json);
			    return json;
			})();
			group_by_sector.disabled = true; //disable group by sector when in sector mode.
		    tm.loadJSON(json);
		    tm.refresh();
	  	} else if (selected_cat === current_link_id) { //current category selected; unselect.
	  		jQuery('.country-legend td').each(function(){
	  			var theCurrent = jQuery(this).children('a').attr('id');
	  				jQuery(this).removeClass('disabled');
	  		});
	  		selected_cat = 'all';
		  	var json = (function () {
			    var json = null;
			    $.ajax({
			        'async': false,
			        'global': false,
			        'url': 'fetch_sinoindex_json_2013.php?year=' + selected_year,
			        'dataType': "json",
			        'success': function (data) {
			            json = data;
			        }
			    });

				//console.dir(json);
			    return json;
			})();
	  		group_by_sector.disabled = false; //enable group by sector when exiting sector mode.
		    tm.loadJSON(json);
		    tm.refresh();
	  	} else { //another category selected; unselect that, select this.
	  		jQuery('.country-legend td #' + current_link_id).removeClass('disabled');
	  		jQuery('.country-legend td #' + selected_cat).addClass('disabled');
	  		jQuery('.country-legend td').each(function(){
	  			var theCurrent = jQuery(this).children('a').attr('id');
	  				jQuery(this).removeClass('disabled');
	  		});
	  		selected_cat = current_link_id;
		  	var json = (function () {
			    var json = null;
			    $.ajax({
			        'async': false,
			        'global': false,
			        'url': 'fetch_sinoindex_json_2013.php?year=2012&cat=' + selected_cat,
			        'dataType': "json",
			        'success': function (data) {
			            json = data;
			        }
			    });

				//console.dir(json);
			    return json;
			})();

		    tm.loadJSON(json);
		    tm.refresh();
	  	}

	  });
	});

  //add event to the back button
/*  var back = $jit.id('back');
  $jit.util.addEvent(back, 'click', function() {
	if(currentParentDepth < 2) {
		tm.config.levelsToShow = 2;
	}
    tm.out();
  });*/
// }); //end jQuery getJSON call.
}
