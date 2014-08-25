
var wm = new WM();
var t_graph = new Tile_Graph();


$(document).ready(function(){
	wm.list[wm.list.length] = new JSWindow(200,200, 300, 100, 'lala');
	t_graph.add(null, wm.list[wm.list.length-1], 'v');
	wm.list[wm.list.length] = new JSWindow(200,200, 300, 100, '<img src="1.jpg">');
	t_graph.add(wm.list[0], wm.list[wm.list.length-1], 'v');
	var img = document.createElement("img");
	img.setAttribute('src', '2.jpg');
	wm.list[wm.list.length] = new JSWindow(200,200, 100, 100, img );
	t_graph.add(wm.list[0], wm.list[wm.list.length-1], 'v');
	wm.list[wm.list.length] = new JSWindow(200,200, 300, 100, 'BOOM, BAM');
	t_graph.add(wm.list[2], wm.list[wm.list.length-1], 'h');
	wm.list[wm.list.length] = new JSWindow(200,200, 300, 100, '<img src="3.jpg">');
	t_graph.add(wm.list[2], wm.list[wm.list.length-1], 'h');
	wm.list[wm.list.length] = new JSWindow(200,200, 300, 100, 'ALL YOU DO');
	t_graph.add(wm.list[1], wm.list[wm.list.length-1], 'h');
	

});






