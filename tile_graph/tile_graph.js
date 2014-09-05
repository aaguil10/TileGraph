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

Tile_Graph.prototype.updateGraphState = function (window) {
	for(var i = 0; i < this.t_list.length; i++){
		this.t_list[i].updateLinks(this.t_list);
	}
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
		console.log('updating north connections');
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



function updateV (parent, curr) {
	console.log("Updating Vertical");
	var tmp;

	if(parent.north.length != 0){
		tmp = parent.north;
		parent.north = new Array();
		var j = 0; //counter for parent
		var k = 0; //counter for curr
		for(var i = 0; i < tmp.length; i++){
			if(tmp[i].left < (parent.left + parent.w) ){ //if window is above parent
				if( !isinArray(parent.north, tmp[i]) ){
					parent.north[j] = tmp[i];
					if( !isinArray(parent.north[j].south, parent) ){
						parent.north[j].south[parent.north[j].south.length] = parent;
					}
					j++;
				}
			}else{
      	for(var x = 0; x < tmp[i].south.length; x++){ //remove link to parent
					if(tmp[i].south[x] === parent){
						tmp[i].south.splice(x,1);
					}
				}
			}

			if( (tmp[i].left + tmp[i].w) > curr.left){ //if window is above curr
				if( !isinArray(curr.north, tmp[i]) ){
					curr.north[k] = tmp[i];				
					if(tmp[i].left < (parent.left + parent.w) ){ //if window was also below curr
						console.log("OH lord!");
						if( !isinArray(curr.north[k].south, curr) ){
							console.log("My lord!");
	        		curr.north[k].south[curr.north[k].south.length] = curr;
						}
					}else{	//replace link pointing to parent with curr
						tmp[i].south = removeMutiple(tmp[i].south);
						for(var x = 0; x < tmp[i].south.length; x++){
							if(tmp[i].south[x] === parent){
								tmp[i].south[x] = curr;
								if( !isinArray(tmp[i].south, curr) ){
									console.log("OH savior!");
									tmp[i].south.splice(x,1);
								}
							}
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
				if( !isinArray(parent.south, tmp[i]) ){
					parent.south[j] = tmp[i];
					if( !isinArray(parent.south[j].north, parent) ){
						parent.south[j].north[parent.south[j].north.length] = parent;
					}
					j++
				}
			}else{
				for(var x = 0; x < tmp[i].north.length; x++){ //remove link to parent
					if(tmp[i].north[x] === parent){
						tmp[i].north.splice(x,1);
					}
				}
			}
			if( (tmp[i].left + tmp[i].w) > curr.left){ //if window is below curr
				if( !isinArray(curr.south, tmp[i]) ){
					curr.south[k] = tmp[i];
					if(tmp[i].left < (parent.left + parent.w) ){ //if window was also below parent
						if(!isinArray(curr.south[k].north, curr) ){
							curr.south[k].north[curr.south[k].north.length] = curr;
						}
					}else{
						tmp[i].north = removeMutiple(tmp[i].north);
						for(var x = 0; x < curr.south[k].north.length; x++){
							if(curr.south[k].north[x] === parent){
								curr.south[k].north[x] = curr;
							}
						}
        	}
				}
				k++;
			}
		}
	}

	/*if(parent.east.length != 0){
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
	}*/

	//parent.east[0] = curr;
	//curr.west[0] = parent;

};

function updateNS(parent, curr){
		//update north links
		var tmp = parent.north;
		//console.log('parent.north:', parent.north);
		parent.north = new Array();
		for(var i = 0; i < tmp.length; i++){
			if(tmp[i].left < (parent.left + parent.w) ){
				parent.north.push(tmp[i]);
			}else{
				for(var j = 0; j < tmp[i].south.length; j++){ //delete link to parent
					if(tmp[i].south[j] === parent){
						tmp[i].south.splice(0,j);
					}
				}
			}
			console.log('tmp['+ i + ']: ' + (tmp[i].left + tmp[i].w) + ' < curr: ' + curr.left);
			if( (tmp[i].left + tmp[i].w) > curr.left){
					curr.north.push(tmp[i]);
					console.log('insreted:', tmp[i].self.title + " into curr");
			}
			if(tmp[i].left < (curr.left + curr.w) ){
					curr.north[curr.north.length - 1].south.push(curr);
					console.log('insreted:', curr.north[curr.north.length - 1].south[curr.north[curr.north.length - 1].south.length - 1].self.title + " into previous");
			}		
		}
		//update south links

}

function removeMutiple(a){
	var tmp = a;
	a = new Array();
	for(var i = 0; i < tmp.length; i++){
		if(!isinArray(a,tmp[i]) ){
			a.push(tmp[i]);
		}
	}
	return a;
}

Tile_Graph.prototype.updateEW = function (window, direction) {
	var me = this.find(window);
	if(direction === 'w'){ me = me.returnX('l',false); }
	/*var tmpArray = new Array();
	if(me.south.length > 0){
		var tmp = me.south[0];
		tmpArray.push(tmp);
		while( tmp.returnX('r',true) != null){
			tmp = tmp.returnX('r', true);
			tmpArray.push(tmp);
		}
		me.south = tmpArray;
		var right = me.returnX('r', true);
		if(right != null){
			updateV(me, right);
		} 
	}
	tmpArray = new Array();
	if(me.north.length > 0){
		var tmp = me.north[0];
		tmpArray.push(tmp);
		while( tmp.returnX('r',false) != null){
			tmp = tmp.returnX('r', false);
			tmpArray.push(tmp);
		}
		me.north = tmpArray;*/
		var right = me.returnX('r', false);
		if(right != null){
			conca(me.north, right.north);
			right.cut_link('n');
		}
		right = me.returnX('r', true);
		if(right != null){
			conca(me.south, right.south);
			right.cut_link('s');
		}
		updateNS(me,right);
	
};

function conca(a, b){	//concatinates arrays without putting the same object twice
	for(var i = 0; i < b.length; i++){
		if( !isinArray(a,b[i]) ){
			a.push(b[i]);
		}
	}
}


/*Tile_Graph.prototype.updateW = function (window) {
	var me = this.find(window);
	me = me.returnX('l', false);
	me.print('links');
	var tmpArray = new Array();
	if(me.south.length > 0){
		var tmp = me.south[0];
		tmpArray.push(tmp);
		while( tmp.returnX('r',true) != null){
			tmp = tmp.returnX('r', true);
			tmpArray.push(tmp);
		}
		me.south = tmpArray;
		var left = me.returnX('r', true);
		if(left != null){
			t_graph.updateV(me, left);
		} 
	}
	tmpArray = new Array();
	if(me.north.length > 0){
		var tmp = me.north[0];
		tmpArray.push(tmp);
		while( tmp.returnX('r',false) != null){
			tmp = tmp.returnX('r', false);
			tmpArray.push(tmp);
		}
		me.north = tmpArray;
		var left = me.returnX('r', false);
		if(left != null){
			t_graph.updateV(me, left);
		}
	}

	console.log("________________________");
	console.log('tmpArray(west):',	tmpArray.length );
	me.print('links');

};*/

Tile_Graph.prototype.isinGraph = function (window) {
	for(var i = 0; i < this.t_list.length; i++){
		if(this.t_list[i].self === window){
			return true;
		}
	}
	return false;
};

function isinArray (array, object) {
	for(var i = 0; i < array.length; i++){
		if(array[i] === object){
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
	if(curr != null){
		curr.w = w;
		curr.h = h;
	}
};

Tile_Graph.prototype.update_position = function (window,l,t) {
	var curr = this.find(window);
	if(curr != null){
		curr.left = l;
		curr.top = t;
	}
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

//if boo === true, then it will return top most or left most element
node.prototype.returnX = function (direction,boo) {
	var curr = this;
	if(direction === 'r'){
		if(curr.east.length != 0){
			for(var i = 0; i < curr.east.length; i++){
				if(boo === true){	//returns top element
					if(curr.east[i].top <= curr.top){
						if( (curr.east[i].top + curr.east[i].h) >= curr.top){
							return curr.east[i];
						}
					}
				}else{
					if(curr.east[i].top <= (curr.top + curr.h) ){
						if( (curr.east[i].top + curr.east[i].h) >= (curr.top + curr.h) ){
							return curr.east[i];
						}
					}
				}
			}
		}
	}
	if(direction === 'l'){
		if(curr.west.length != 0){
			for(var i = 0; i < curr.west.length; i++){
				if(boo === true){
					if(curr.west[i].top <= curr.top){
						if( (curr.west[i].top + curr.west[i].h) >= curr.top){
							return curr.west[i];
						}
        	}
				}else{
					if(curr.west[i].top <= (curr.top + curr.h) ){
						if( (curr.west[i].top + curr.west[i].h) >= (curr.top + curr.h) ){
							return curr.west[i];
						}
        	}
				}
			}
		}
  }
	if(direction === 'u'){
		if(curr.north.length != 0){
			for(var i = 0; i < curr.north.length; i++){
				if(boo === true){
					if(curr.north[i].left <= curr.left ){
						if( (curr.north[i].left + curr.north[i].w) >= curr.left ){
							return curr.north[i];
						}
        	}
				}else{
					if(curr.north[i].left <= (curr.left + curr.w) ){
						if( (curr.north[i].left + curr.north[i].w) >= (curr.left + curr.w) ){
							return curr.north[i];
						}
        	}
				}
			}
		}
  }
	if(direction === 'd'){
		if(curr.south.length != 0){
			for(var i = 0; i < curr.south.length; i++){
				if(boo === true){
					if(curr.south[i].left <= curr.left ){
						if( (curr.south[i].left + curr.south[i].w) >= curr.left ){
							return curr.south[i];
						}
        	}
				}else{
					if(curr.south[i].left <= (curr.left + curr.w) ){
						if( (curr.south[i].left + curr.south[i].w) >= (curr.left + curr.w) ){
							return curr.south[i];
						}
        	}
				}
			}
		}
  }
	return null;
};

node.prototype.cut_link = function (opt) {
	//console.log("Cutting link!");
	if(opt === 'n' || opt === 'all'){
		for(var i = 0; i < this.north.length; i++){
			cut_self(this.north[i].south, this);
		}	
		this.north = new Array();
	}	
	if(opt === 's' || opt === 'all'){
		for(var i = 0; i < this.south.length; i++){
			cut_self(this.south[i].north, this);
		}	
		this.south = new Array();
	}
	if(opt === 'e' || opt === 'all'){
		for(var i = 0; i < this.east.length; i++){
			cut_self(this.east[i].west, this);
		}	
		this.east = new Array();
	}
	if(opt === 'w' || opt === 'all'){
		for(var i = 0; i < this.west.length; i++){
			cut_self(this.west[i].east, this);
		}	
		this.west = new Array();
	}
};

function cut_self(array, self){
	var tmp = array;
	for(var i = 0; i < tmp.length; i++){
		if(array[i] === self){
			array.splice(i, 1);
		}
	}

}


////////////////////////////////////////////////////////////////////////////

node.prototype.updateLinks = function (nodes) {
	this.cut_link('all');
	var me = this.self;
	var s = me.getSize();
	var p = me.getPosition();
	this.w = s.width;
	this.h = s.height;
	this.left = p.left;
	this.top = p.top;
	
	for(var i = 0; i < nodes.length; i++){
		var tmp = nodes[i];
		//console.log('tmp:', tmp);

		if( above(tmp, this) ){
			if( isNextTo(tmp, this, 'ew') ){
				this.north.push(tmp);
			}
		}

		if( below(tmp, this) ){
			if( isNextTo(tmp, this, 'ew') ){
				this.south.push(tmp);
			}
		}

		if( onLeft(tmp, this) ){
			if( isNextTo(tmp, this, 'sn') ){
				this.west.push(tmp);
			}
		}

		if( onRight(tmp, this) ){
			if( isNextTo(tmp, this, 'sn') ){
				this.east.push(tmp);
			}
		}
	}

};

function isNextTo(a, curr, opt){
	if(opt === 'ew'){
		if( (a.left) < (curr.left + curr.w) ){
			if( (a.left + a.w) > curr.left ){
				return true;
			}
		}
	}
	if(opt === 'sn'){
		if( (curr.top + curr.h) > a.top){
			if(curr.top < (a.top + a.h) ){
				return true;
			}
		}
	}
	return false;
}

function above(a, curr){
	var minH = a.self.minHeight - 1; // /2; //makes function less sensitive
	if( (a.top + a.h - minH ) <= curr.top){
		if(curr.top <= (a.top + a.h + minH ) ){
			return true;
		}
	} 
	return false;
}

function below(a, curr){
	var minH = a.self.minHeight - 1;// /2; //makes function less sensitive
	var c = curr.top + curr.h;
	if(a.top - minH <= c){
		if(c <= a.top + minH){
			return true;
		}
	}
	return false;
}

function onLeft(a, curr){
	var minW = a.self.minWidth - 1; // /2; //makes function less sensitive
	var l = a.left + a.w;
	if( (l - minW ) <= curr.left ){
		if(curr.left <= (l+minW) ){
			return true;
		}
	} 
	return false;
}

function onRight(a, curr){
	var minW = a.self.minWidth - 1;// /2; //makes function less sensitive
	var c = curr.left + curr.w;
	if(a.left - minW <= c){
		if(c <= a.left + minW){
			return true;
		}
	}
	return false;
}


function around(num1, num2, size){
	if(num2 - size <= num1){
		if(num1 <= num2 + size){
			return true;
		}
	}
	return false;
}

function gDebug(node, opt){
	if(node.self.title === 'Polar Love'){
		console.log("nextTo:", opt.self.title );
	}
	
}

