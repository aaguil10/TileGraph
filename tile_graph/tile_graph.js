//var Tile_Graph;


Tile_Graph = function (){
	_this = this;
	this.t_list = new Array();
	this.size = 0;

};

Tile_Graph.prototype.print = function () {
	for(var i = 0; i < this.t_list.length; i++){
		this.t_list[i].print('none');
	}
};

Tile_Graph.prototype.find = function (window) {
	if(this.t_list.length === 0){ return null;}
	for(var i = 0; i < this.t_list.length; i++){
    if(this.t_list[i].self === window){
			//console.log("Make it!");
			return this.t_list[i];
		}
	}
	//console.log("stoped here!");
	return null;
};


Tile_Graph.prototype.add = function (active, new_win, mode) {
	if(this.isinGraph(new_win)){
		return;
	}
	var Jwindow = $(new_win);
	//var tmp = new node(new_win);
	var tmp = new node(Jwindow);
	var padding = 2;
	var h;
	var w;
	if(this.t_list.length === 0){	//If it's the first window
			h = $( window ).height() - padding;
			w = $( window ).width() - padding;
			if(h > w){
				tmp.mode = 'h';
			}else{
				tmp.mode = 'v';
			}
			new_win.setPosition(0,0,false);
			new_win.setSize(w,h);
			tmp.w = w;
			tmp.h = h;
			tmp.top = 0;
			tmp.left = 0;
			this.t_list[this.size++] = tmp;
			this.t_list[0].print('links');


	}else{	//If the is more than one
		if (active === null){
			active = this.t_list[this.t_list.length - 1].self;
		}
		for(var i = 0; i < this.t_list.length; i++){
			//console.log('pop');
			if(active === this.t_list[i].self){
				if(mode != null){
					this.t_list[i].mode = mode;
				}
				var parent = this.t_list[i];
				h = parent.h;
				w = parent.w;
				if(parent.mode === 'h'){
					tmp.top = parent.top + h/2;
					tmp.left = parent.left;
					new_win.setPosition(tmp.left, tmp.top, false);
					tmp.h = h/2;
					parent.h = h/2;
					tmp.w = w;
					new_win.setSize(tmp.w,tmp.h);
					parent.self.setSize(parent.w,parent.h);
					if(tmp.h > tmp.w){
						tmp.mode = 'h';
						parent.mode = 'h';
					}else{
						tmp.mode = 'v';
						parent.mode = 'v';
					}
					this.t_list[this.size++] = tmp;
					this.updateH(parent, tmp);

					console.log('---------------Parent---------------');
					parent.print('links');
					console.log('---------------Child---------------');
					tmp.print('links');
					console.log('-----------------------------------');
				}

				else if(parent.mode === 'v'){
					tmp.top = parent.top;
					tmp.left = parent.left + w/2;
					new_win.setPosition(tmp.left, tmp.top, false);
					tmp.w = w/2;
					parent.w = w/2;
					tmp.h = h;
					new_win.setSize(tmp.w,tmp.h);
					parent.self.setSize(parent.w,parent.h);
					if(tmp.h > tmp.w){
						tmp.mode = 'h';
						parent.mode = 'h';
					}else{
						tmp.mode = 'v';
						parent.mode = 'v';
					}
					this.t_list[this.size++] = tmp;
					this.updateV(parent,tmp);

					console.log('---------------Parent---------------');
					parent.print('links');
					console.log('---------------Child---------------');
					tmp.print('links');
					console.log('-----------------------------------');
				}
			}
		}
	}

	if(this.t_list.length === 0){ 
		new_win.dragging = false; 
	}else{
		this.t_list[0].dragging = true;
  }
};

function debug(graph, wm){
	/*var window = wm.curr_active_window;
	for(var i = 0; i < graph.t_list.length; i++){
		if(graph.t_list[i].self === window){
			graph.t_list[i].print('links');
		}
	}*/
	graph.print();
};


Tile_Graph.prototype.updateH = function (parent, curr) {
	console.log("Updating Horizontal");
	var tmp;

	if(parent.east.length != 0){
		tmp = parent.east;
		parent.east = new Array();
		var j = 0; //counter for curr east
		var k = 0; //counter for parent east
		for(var i = 0; i < tmp.length; i++){
			if(tmp[i].top < (parent.top + parent.h) ){ //if window is next to parent
				parent.east[k] = tmp[i];
				k++;
			}else{
				for(var x = 0; x < tmp[i].west.length; x++){ //remove conection to parent
					if(tmp[i].west[x] === parent){
						tmp[i].west.splice(x,0);
					}
				}
			}
			if( (tmp[i].top + tmp[i].h) > curr.top ){ //if window is next to curr
				curr.east[j] = tmp[i];
				if(tmp[i].top < (parent.top + parent.h) ){
					curr.east[j].west[curr.east[j].west.length] = curr;
				}else{
					var west = curr.east[j].west;
					for(var d = 0; d < west.length; d++){
						if(west[d] === parent){
							west[d] = curr;
						}
					}
				}
				j++
			}
		}
	}

	if(parent.west.length != 0){
		tmp = parent.west;
		parent.west = new Array();
		var j = 0; //counter for curr west
		var k = 0; //counter for parent west
		for(var i = 0; i < tmp.length; i++){
			if(tmp[i].top < (parent.top + parent.h) ){ //if its next to parent
				parent.west[k] = tmp[i];
				k++;
			}else{
				for(var x = 0; x < tmp[i].east.length; x++){ //remove link to parent
					if(tmp[i].east[x] === parent){
						tmp[i].east.splice(x, 1);
					}
				}
			}
			if( (tmp[i].top + tmp[i].h) > curr.top ){ //add curr's links
				curr.west[j] = tmp[i];
					//if(tmp[i].top < (parent.top + parent.h) ){
						//console.log("blop");
						curr.west[j].east[curr.west[j].east.length] = curr;
						//curr.west[j].east.splice(i, 0, curr);
					/*}else{
						var east = curr.west[j].east;
						for(var d = 0; d < east.length; d++){
							if(east[d] === parent){
								console.log("blap");
								east[d] = curr;
							}
						}
					}*/
				j++;
			}
		}
	}

	if(parent.south.length != 0){
		tmp = parent.south;
		parent.south = new Array();
		for(var i = 0; i < tmp.length; i++){
			curr.south[i] = tmp[i];
			//parent.south[i].north[parent.south[i].north.length] = curr;
			for(var x = 0; x < curr.south[i].north.length; x++){
				if(curr.south[i].north[x] === parent){
					console.log("POLLO!");
					curr.south[i].north[x] = curr;
				}
			}
		}
	}

	parent.south[0] = curr;
	curr.north[0] = parent;

};

Tile_Graph.prototype.updateV = function (parent, curr) {
	console.log("Updating Vertical");
	var tmp;

	if(parent.north.length != 0){
		tmp = parent.north;
		parent.north = new Array();
		var j = 0; //counter for parent
		var k = 0; //counter for curr
		for(var i = 0; i < tmp.length; i++){
			if(tmp[i].left < (parent.left + parent.w) ){ //if window is above parent
				parent.north[j] = tmp[i];
				j++;
			}else{
      	for(var x = 0; x < tmp[i].south.length; x++){ //remove link to parent
					if(tmp[i].south[x] === parent){
						tmp[i].south.splice(x,0);
					}
				}
			}

			if( (tmp[i].left + tmp[i].w) > curr.left){ //if window is above curr
				curr.north[k] = tmp[i];
				if(tmp[i].left < (parent.left + parent.w) ){ //if window was also below curr
        	curr.north[k].south[curr.north[k].south.length] = curr;
				}else{
					for(var x = 0; x < tmp[i].south.length; x++){
						if(tmp[i].south[x] === parent){
							tmp[i].south[x] = curr;
						}
					}
				}
				k++;
			}
		}
	}

	if(parent.south.length != 0){
		tmp = parent.south;
		parent.south = new Array();
		var j = 0; //counter for parent
    var k = 0; //counter for curr
		for(var i = 0; i < tmp.length; i++){
			if(tmp[i].left < (parent.left + parent.w) ){ //if window is below parent
				parent.south[j] = tmp[i];
				j++
			}else{
				for(var x = 0; x < tmp[i].north.length; x++){ //remove link to parent
					if(tmp[i].north[x] === parent){
						tmp[i].north.splice(x,0);
					}
				}
			}
			if( (tmp[i].left + tmp[i].w) > curr.left){ //if window is below curr
				curr.south[k] = tmp[i];
				if(tmp[i].left < (parent.left + parent.w) ){ //if window was also below parent
					curr.south[k].north[curr.south[k].north.length] = curr;
				}else{
					for(var x = 0; x < curr.south[k].north.length; x++){
						if(curr.south[k].north[x] === parent){
							curr.south[k].north[x] = curr;
						}
					}
        }
				k++;
			}
		}
	}

	if(parent.east.length != 0){
		tmp = parent.east;
		parent.east = new Array();
		for(var i = 0; i < tmp.length; i++){
			curr.east[i] = tmp[i];
			for(var x = 0; x < curr.east[i].west.length; x++){ //update west's links
				if(curr.east[i].west[x] === parent){
					curr.east[i].west[x] = curr;
				}
			}
		}
	}

	parent.east[0] = curr;
	curr.west[0] = parent;

};


Tile_Graph.prototype.isinGraph = function (window) {
	for(var i = 0; i < this.t_list.length; i++){
		if(this.t_list[i].self === window){
			return true;
		}
	}
	return false;
};

Tile_Graph.prototype.changeMode = function (window, mode) {
	for(var i = 0; i < this.t_list.length; i++){
		if(this.t_list[i].self === window){
			this.t_list[i].mode = mode;
		}
	}
};

Tile_Graph.prototype.update_size = function (window,w,h) {
	var curr = this.find(window);
	curr.w = w;
	curr.h = h;
};

Tile_Graph.prototype.update_position = function (window,l,t) {
	var curr = this.find(window);
	curr.left = l;
	curr.top = t;
};

Tile_Graph.prototype.remove = function () {
	console.log('removing window');

};

Tile_Graph.prototype.switch_win = function (window1,window2) {
	//console.log('switching windows');
	var a = this.find(window1);
	var b = this.find(window2);
	//console.log('window1: ' + a);
	//console.log('window2: ' + b);
	var tmp = a.self;
	a.self = b.self;
	b.self = tmp;
	reposition(a);
	reposition(b);

};

function reposition(node){
	//console.log("Repositioning!");
	//node.print('ps');
	node.self.setPosition(node.left,node.top);
	node.self.setSize(node.w,node.h);
}

Tile_Graph.prototype.default_t = function () {
	console.log('default tile');

};


var node = function (window) {
	//_this = this;
	this.self = window[0];
	this.north = new Array();
	this.south = new Array();
	this.east = new Array();
	this.west = new Array();
	this.top = 0;
	this.left = 0;
	this.w = 0;
	this.h = 0;
	this.mode = null;
	console.log('created node');

}

node.prototype.print = function (opt){
	console.log("<<<<<< " + this.self.title + " >>>>>>");
	if(opt === null || opt === 'mode' || opt === 'ps'){
		console.log('this.mode: ' + this.mode);
	}

	if(opt === null || opt === 'n' || opt === 'links'){
		if(this.north.length != 0){
			for(var i = 0; i < this.north.length; i++){
				console.log('this.north[' + i + ']: ' + this.north[i].self.title);
			}
		}else{
			console.log("this.north is empty");
		}
	}

	if(opt === null || opt === 's' || opt === 'links'){
		if(this.south.length != 0){
			for(var i = 0; i < this.south.length; i++){
				console.log('this.south[' + i + ']: ' + this.south[i].self.title);
			}
		}else{
			console.log("this.south is empty");
		}
	}

	if(opt === null || opt === 'e' || opt === 'links'){
		if(this.east.length != 0){
			for(var i = 0; i < this.east.length; i++){
				console.log('this.east[' + i + ']: ' + this.east[i].self.title);
			}
		}else{
			console.log("this.east is empty");
		}
	}

	if(opt === null || opt === 'w' || opt === 'links'){
		if(this.west.length != 0){
			for(var i = 0; i < this.west.length; i++){
				console.log('this.west[' + i + ']: ' + this.west[i].self.title);
			}
		}else{
			console.log("this.west is empty");
		}
	}

	if(opt === null || opt === 'pos' || opt === 'ps'){
		console.log('this.top: ' + this.top);
		console.log('this.left: ' + this.left);
	}

	if(opt === null || opt === 'size' || opt === 'ps'){
		console.log('this.w: ' + this.w);
		console.log('this.h: ' + this.h);
	}
	

};


//var my_graph = new Tile_Graph;
//my_graph.add(null);
//my_graph.remove();
//my_graph.switch_win();
//my_graph.default_t();





