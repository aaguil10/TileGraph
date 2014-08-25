	function resizeE(n, _this){
		var s = _this.getSize();
  	_this.setSize(n.absolute.left, s.height, 10, false);
		var p = _this.getPosition();

		var stack = new Array();
		stack.push(_this);

		var node = t_graph.find(_this);
		for(var i = 0; i < node.east.length; i++){
			var west = node.east[i].self;
			var size = west.getSize();
			var pos = west.getPosition();
			var newSize = n.absolute.left - pos.left;
			newSize =  p.left + s.width - pos.left;
  		west.setSize(-newSize , 0, 10, true);	
			west.setPosition( newSize, 0, true);

			for(var j = 0; j < node.east[i].west.length; j++){
				if( !isinArray(stack, node.east[i].west[j].self) ){
					stack.push(node.east[i].west[j].self);
				}
			}
		}
		for(var k = 0; k < stack.length; k++){
			var other = stack[k];
			var sz = other.getSize();
  		other.setSize(n.absolute.left, sz.height, 10, false);
		}
	}
