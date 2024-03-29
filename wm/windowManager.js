WM = function (w,h,t,l) {
	this.list = new Array();
}

WM.prototype.find = function (window){
	for(var i = 0; i < this.list.length; i++){
		if(this.list[i].window === window){
			return this.list[i];
		}
	}
	return null;
}

JSWindow = function (w,h,t,l, content, title) {
	var _this = this;
	this.w = w;
	this.h = h;
	this.t = t;
	this.l = l;
	this.dragging = true;
	this.title = title;
	this.minWidth = 200;
	this.minHeight = 50;

	this.window = document.createElement('DIV');
	$(this.window).addClass('window');

	this.handle = this.window.appendChild(document.createElement('DIV'));
	$(this.handle).addClass('handle');

	this.NW = this.window.appendChild(document.createElement('DIV'));
	$(this.NW).addClass('resize NW');

	this.NE = this.window.appendChild(document.createElement('DIV'));
	$(this.NE).addClass('resize NE');

	this.SW = this.window.appendChild(document.createElement('DIV'));
	$(this.SW).addClass('resize SW');

	this.SE = this.window.appendChild(document.createElement('DIV'));
	$(this.SE).addClass('resize SE');

	this.N = this.window.appendChild(document.createElement('DIV'));
	$(this.N).addClass('resize N');

	this.S = this.window.appendChild(document.createElement('DIV'));
	$(this.S).addClass('resize S');

	this.W = this.window.appendChild(document.createElement('DIV'));
	$(this.W).addClass('resize W');

	this.E = this.window.appendChild(document.createElement('DIV'));
	$(this.E).addClass('resize E');

	$(this.handle).click(function (){
		console.log('_____________________');
		t_graph.find(_this).print('links');
		console.log('_____________________');
	});

	function resizeN(n, _this){
		_this.setSize(0, n.relative.top, 10, true);
		_this.setPosition(0, -n.relative.top, true);

		var stack = new Array();
		stack.push(_this);

		var node = t_graph.find(_this);
		
		for(var i = 0; i < node.north.length; i++){
			stack.push(node.north[i].self);
		}
		var nextStart = stack.length;
		
		for(var i = 0; i < node.north.length; i++){
			var north = node.north[i].self;
			north.setSize(0, -n.relative.top, 10, true);
		
			for(var j = 0; j < node.north[i].south.length; j++){
				if(	!isinArray(stack, node.north[i].south[j].self) ){
					stack.push(node.north[i].south[j].self);
				}
			}
		}
		/*for(var k = 0; k < stack.length; k++){
			var other = stack[k];
			//var sz = other.getSize();
			if(other != _this){
				other.setSize(0, n.relative.top, 10, true);
				other.setPosition(0, -(n.relative.top), true);
			}	
		}*/
		resizeLinks('n', reSouth, reNorth, n, stack, nextStart); 
		t_graph.updateGraphState();
		
		function reSouth(other, n, obj){
			other.setSize(0, n.relative.top, 10, true);
			other.setPosition(0, -(n.relative.top), true);
			console.log('reSouth()');
		}
		function reNorth(other, n){
			other.setSize(0, -n.relative.top, 10, true);
			console.log('reNorth()');
		}
	};

	
	function resizeS(n, _this){
		var s = _this.getSize();
	  	_this.setSize(s.width, n.absolute.top, 10, false);
	  	//var p = _this.getPosition();
		var p = _this.getPosition();
		var obj = new Object();
		obj.s = s;
		obj.p = p;

	  	
		var stack = new Array();
		stack.push(_this);

		var node = t_graph.find(_this);
		
		for(var i = 0; i < node.south.length; i++){
			stack.push(node.south[i].self);
		}
		var nextStart = stack.length;
		
	  	for(var i = 0; i < node.south.length; i++){
	  		var south = node.south[i].self;
	  		var pos = south.getPosition();
	  		var newSize = p.top + s.height - pos.top;
	  		south.setSize(0, -newSize, 10, true);	
			south.setPosition(0, newSize, true);  
			
			for(var j = 0; j < node.south[i].north.length; j++){
				if(!isinArray(stack, node.south[i].north[j].self) ){
					stack.push(node.south[i].north[j].self);
				}
			}
	  	}
	  	/*for(var k = 0; k < stack.length; k++){
	  		var other = stack[k];
	  		var sz = other.getSize();
			if(other != _this){
			  	other.setSize(sz.width, n.absolute.top, 10, false);				
			}
	  	}*/
		resizeLinks('s', reSouth, reNorth, n, stack, nextStart, obj);  	
		t_graph.updateGraphState();
		
		function reSouth(other, n, obj){
			var pos = other.getPosition();
	  		var newSize = obj.p.top + obj.s.height - pos.top;
	  		other.setSize(0, -newSize, 10, true);	
			other.setPosition(0, newSize, true); 
			console.log('reSouth()');
		}
		function reNorth(other, n){
			var sz = other.getSize();
		  	other.setSize(sz.width, n.absolute.top, 10, false);	
			console.log('reNorth()');
		}
		
	}

	function resizeE(n, _this){
		var s = _this.getSize();
		_this.setSize(n.absolute.left, s.height, 10, false);
		var p = _this.getPosition();
		var obj = new Object();
		obj.s = s;
		obj.p = p;

		var stack = new Array();
		stack.push(_this);

		var node = t_graph.find(_this);
		
		for(var i = 0; i < node.east.length; i++){
			stack.push(node.east[i].self);
		}
		var nextStart = stack.length;
		
		for(var i = 0; i < node.east.length; i++){ //resize windows next to "this"
			var west = node.east[i].self;
			var pos = west.getPosition();
			var newSize =  p.left + s.width - pos.left;
			west.setSize(-newSize , 0, 10, true);	
			west.setPosition( newSize, 0, true);

			for(var j = 0; j < node.east[i].west.length; j++){
				if( !isinArray(stack, node.east[i].west[j].self) ){
					stack.push(node.east[i].west[j].self);
				}
			}
		}
		/*for(var k = 0; k < stack.length; k++){ //resize the other windows that where conected to "this"
			var other = stack[k];
			var sz = other.getSize();
			other.setSize(n.absolute.left, sz.height, 10, false);
		}*/
		resizeLinks('e', reWest, reEast, n, stack, nextStart, obj);
		t_graph.updateGraphState();
		
		function reWest(other, n, obj){
			var pos = other.getPosition();
			var newSize =  obj.p.left + obj.s.width - pos.left;
			other.setSize(-newSize , 0, 10, true);	
			other.setPosition( newSize, 0, true);
			console.log('reWest()');
		}
		function reEast(other, n){
			var sz = other.getSize();
			other.setSize(n.absolute.left, sz.height, 10, false);
			console.log('reEast()');
		}
		
	}

	function resizeW(n, _this){
		_this.setSize(n.relative.left, 0, 10, true);
		_this.setPosition(-n.relative.left, 0, true);	

		var stack = new Array();
		stack.push(_this);
		
		var node = t_graph.find(_this);
		
		for(var i = 0; i < node.west.length; i++){
			stack.push(node.west[i].self);
		}
		var nextStart = stack.length;
		
		for(var i = 0; i < node.west.length; i++){
			var east = node.west[i].self;
			var size = east.getSize();
			east.setSize(-n.relative.left, 0, 10, true);
			//stack.push(node.west[i].self);
			
			for( j = 0; j < node.west[i].east.length; j++){
				if( !isinArray(stack, node.west[i].east[j].self) ){
					stack.push(node.west[i].east[j].self);
				}
			}
		}
		/*for(var k = 1; k < stack.length; k++){
			var other = stack[k];
			other.setSize(n.relative.left, 0, 10, true);
			other.setPosition(-n.relative.left, 0, true);
		}*/
		console.log('_________________');
		resizeLinks('w', reWest, reEast, n, stack, nextStart);
		t_graph.updateGraphState();
		
		function reWest(other, n){
			other.setSize(n.relative.left, 0, 10, true);
			other.setPosition(-n.relative.left, 0, true);
			console.log('reWest()');
		}
		function reEast(other, n){
			var size = other.getSize();
			other.setSize(-n.relative.left, 0, 10, true);
			console.log('reEast()');
		}
		
	}
	
	function resizeLinks(side, resize1, resize2, n, stack, num, obj){
		console.log('resizeLinks()');
		
		if(side === 'n'){
			console.log('  Started North!');	
			var nextStart = stack.length;
			for(var i = num; i < nextStart; i++){
				resize1(stack[i], n, obj);
				var curr = t_graph.find(stack[i]);	
				for(var k = 0; k < curr.north.length; k++){
					if(!isinArray(stack, curr.north[k].self)){
						stack.push(curr.north[k].self);
					}
				}
			}
			if(num === nextStart){return;}
			resizeLinks('s', resize1, resize2, n, stack, nextStart, obj);
		}
		
		
		if(side === 's'){
			console.log('  Started South!');	
			var nextStart = stack.length;
			for(var i = num; i < nextStart; i++){
				resize2(stack[i], n, obj);
				var curr = t_graph.find(stack[i]);
				for(var k = 0; k < curr.south.length; k++){
					if(!isinArray(stack, curr.south[k].self)){
						stack.push(curr.south[k].self);
					}
				}
			}
			if(num === nextStart){return;}
			resizeLinks('n', resize1, resize2, n, stack, nextStart, obj);
		}
		
		
		if(side === 'w'){
			console.log('  Started West!');
			var nextStart = stack.length;
			for(var i = num; i < nextStart; i++){
				resize1(stack[i], n, obj);
				var curr = t_graph.find(stack[i]);
				for(var k = 0; k < curr.west.length; k++){
					if(!isinArray(stack, curr.west[k].self)){
						stack.push(curr.west[k].self);
					}
				}
			}
			if(num === nextStart){return;}
			resizeLinks('e', resize1, resize2, n, stack, nextStart, obj);
		}
		if(side === 'e'){
			console.log('  Started East!');
			var nextStart = stack.length;
			for(var i = num; i < nextStart; i++){
				resize2(stack[i], n, obj);
				var curr = t_graph.find(stack[i]);
				for(var k = 0; k < curr.east.length; k++){
					if(!isinArray(stack, curr.east[k].self) ){
						stack.push(curr.east[k].self);
					}
				}
			}
			if(num === nextStart){return;}
			resizeLinks('w', resize1, resize2, n, stack, nextStart, obj);
		}
		
	}
	

	var dragN = function (drag, ui) {
		if(_this.dragging === false){ return; }
		var n = calculateSize(drag, ui, this, _this, 'n');
		resizeN(n, _this);
  };
	var dragS = function (drag, ui) {
		if(_this.dragging === false){ return; }
		var n = calculateSize(drag, ui, this, _this, 's');
		resizeS(n, _this);
  };


	var dragE = function (drag, ui) {
		if(_this.dragging === false){ return; }
		var n = calculateSize(drag, ui, this, _this, 'e');
		resizeE(n,_this);
  };

	function isinArray(array,object){
		for(var k = 0; k < array.length; k++){
			if(object === array[k]){
				return true;
			}
		}
		return false;
	}

	var dragW = function (drag, ui) {
		if(_this.dragging === false){ return; }
		var n = calculateSize(drag, ui, this, _this, 'w');
  	//_this.setSize(n.relative.left, 0, 10, true);
		//_this.setPosition(-n.relative.left, 0, true);
		resizeW(n, _this);
  };


	var dragNW = function (drag, ui) {
		if(_this.dragging === false){ return; }
		var n = calculateSize(drag, ui, this, _this, 'nw');
  	_this.setSize(0, n.relative.top, 10, true);
		_this.setPosition(0, -n.relative.top, true);
  	_this.setSize(n.relative.left, 0, 10, true);
		_this.setPosition(-n.relative.left, 0, true);
  };
	var dragNE = function (drag, ui) {
		if(_this.dragging === false){ return; }
		var n = calculateSize(drag, ui, this, _this, 'ne');
  	_this.setSize(0, n.relative.top, 10, true);
		_this.setPosition(0, -n.relative.top, true);
		//var s = _this.getSize();
  	//_this.setSize(n.absolute.left, s.height, 10, false);
		resizeE(n, _this);
  };
	var dragSW = function (drag, ui) {
		if(_this.dragging === false){ return; }
		var n = calculateSize(drag, ui, this, _this, 'sw');
		var s = _this.getSize();
  	_this.setSize(s.width, n.absolute.top, 10, false);
  	_this.setSize(n.relative.left, 0, 10, true);
		_this.setPosition(-n.relative.left, 0, true);
  };
	var dragSE = function (drag, ui) {
		if(_this.dragging === false){ return; }
		var n = calculateSize(drag, ui, this, _this, 'se');
		var s = _this.getSize();
  	_this.setSize(s.width, n.absolute.top, 10, false);
		s = _this.getSize();
  	_this.setSize(n.absolute.left, s.height, 10, false);
  };

	$( this.window ).append( content );
	document.body.appendChild(this.window);

	this.setSize(w,h);
	this.setPosition(l,t);

	$(this.N).draggable({
      	drag: dragN,
        stop: dragN
	});
	$(this.S).draggable({
      	drag: dragS,
        stop: dragS
	});
	$(this.E).draggable({
      	drag: dragE,
        stop: dragE
	});
	$(this.W).draggable({
      	drag: dragW,
        stop: dragW
	});

	$(this.NW).draggable({
      	drag: dragNW,
        stop: dragNW
	});
	$(this.NE).draggable({
      	drag: dragNE,
        stop: dragNE
	});
	$(this.SW).draggable({
      	drag: dragSW,
        stop: dragSW
	});
	$(this.SE).draggable({
      	drag: dragSE,
        stop: dragSE
	});


};

function calculateSize(drag, ui, thee, win, direction){
	var s = win.getSize();
	var p = win.getPosition();
	var max_h = $( window ).height();
	var max_w = $( window ).width();
  var relative = {
    left: $(thee.parentNode).offset().left - ui.offset.left,
    top: $(thee.parentNode).offset().top - ui.offset.top
  };
  var absolute = {
    left: $(thee).offset().left - $(thee.parentNode).offset().left + $(thee).width(),
    top: $(thee).offset().top - $(thee.parentNode).offset().top + $(thee).height()
  };
	if(direction === 'n' || direction === 'nw' || direction === 'ne'){
		if(relative.top + s.height > p.top + s.height + 2 ){
			relative.top = p.top + 2;
			console.log("N");
		}
	}
	if(direction === 'w' || direction === 'nw' || direction === 'sw'){
		if(relative.left + s.width > p.left + s.width + 2 ){
			relative.left = p.left + 2;
			console.log("W");
		}
	}
	if(direction === 's' || direction === 'sw' || direction === 'se'){
		if(absolute.top + p.top  > max_h - 2){
			absolute.top = max_h - 2 - p.top;
		}
	}
	if(direction === 'e' || direction === 'se' || direction === 'ne'){
		if(absolute.left + p.left  > max_w - 2){
			absolute.left = max_w - 2 - p.left;
		}
	}
	var x = new Object();
	x.relative = relative;
	x.absolute = absolute;
	return x;			
}

JSWindow.prototype.setSize = function (w, h, fixedCorner, relative) {
	if(relative === true){
		w = w + this.w;
		h = h + this.h;
	}

	this.w = w;
	this.h = h;
	t_graph.update_size(this, w, h);

	$(this.window).css({
    width: w + 'px',
    height: h + 'px'
  });

	var rw = w/3;
	var rh = h/3;

	$(this.handle).css({
    left: rw + 'px',
    top: rh + 'px',
    width: rw + 'px',
    height: rh + 'px'
  });

	$(this.NW).css({
    left: '0',
    top: '0',
    width: rw + 'px',
    height: rh + 'px'
  });
	$(this.NE).css({
    left: (w-rw) + 'px',
    top: '0',
    width: rw + 'px',
    height: rh + 'px'
  });
	$(this.SW).css({
    left: '0',
    top: (h-rh) + 'px',
    width: rw + 'px',
    height: rh + 'px'
  });
	$(this.SE).css({
    left: (w-rw) + 'px',
    top: (h-rh) + 'px',
    width: rw + 'px',
    height: rh + 'px'
  });

	$(this.N).css({
    left: rw + 'px',
    top: 0 + 'px',
    width: rw + 'px',
    height: rh + 'px'
  });
	$(this.S).css({
    left: rw + 'px',
    top: (h-rh) + 'px',
    width: rw + 'px',
    height: rh + 'px'
  });
	$(this.W).css({
    left: 0 + 'px',
    top: rh + 'px',
    width: rw + 'px',
    height: rh + 'px'
  });
	$(this.E).css({
    left: (w-rw) + 'px',
    top: rh + 'px',
    width: rw + 'px',
    height: rh + 'px'
  });


};

JSWindow.prototype.setPosition = function (l, t, relative) {
	//console.log('adjustint to top:', t);
	if(relative === true){
		l = l + this.l;
		t = t + this.t;
	}

	this.l = l;
	this.t = t;
	t_graph.update_position(this, l, t);

	$(this.window).css({
		left: l + 'px',
		top: t + 'px'
	});

};

JSWindow.prototype.getPosition = function () {
	var x = new Object();
	x.left = this.l;
	x.top = this.t;
	return x;
};

JSWindow.prototype.getSize = function () {
	var x = new Object();
	x.width = this.w;
	x.height = this.h;
	return x;
};

JSWindow.prototype.print = function (opt) {
	console.log("Printed:",this);
};


