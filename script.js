
var wm = new WM();
var t_graph = new Tile_Graph();


$(document).ready(function(){
	wm.list[wm.list.length] = new JSWindow(200,200, 300, 100, '<img src="1.jpg">', 'Moon');
	t_graph.add(null, wm.list[wm.list.length-1], 'h');
	wm.list[wm.list.length] = new JSWindow(200,200, 300, 100, '<img src="2.jpg">', 'Dark Cat');
	t_graph.add(wm.list[0], wm.list[wm.list.length-1], 'h');
	var img = document.createElement("img");
	img.setAttribute('src', '3.jpg');
	wm.list[wm.list.length] = new JSWindow(200,200, 100, 100, img, 'Dark Road' );
	t_graph.add(wm.list[1], wm.list[wm.list.length-1], 'v');
	wm.list[wm.list.length] = new JSWindow(200,200, 100, 100, '<img src="4.jpg">', 'White Flower' );
	t_graph.add(wm.list[1], wm.list[wm.list.length-1], 'v');
	wm.list[wm.list.length] = new JSWindow(200,200, 300, 100, '<img src="5.jpg">', 'White Cat');
	t_graph.add(wm.list[0], wm.list[wm.list.length-1], 'v');
	/*wm.list[wm.list.length] = new JSWindow(200,200, 300, 100, '<img src="6.jpg">', 'Polar Love');
	t_graph.add(wm.list[2], wm.list[wm.list.length-1], 'v');
	wm.list[wm.list.length] = new JSWindow(200,200, 300, 100, '<img src="7.jpg">', 'Monkey Tiger');
	t_graph.add(wm.list[1], wm.list[wm.list.length-1], 'v');
	console.log("+++++++++++++++++++++++++");
	t_graph.find(wm.list[0]).returnX('d', false).print('none');
	console.log("+++++++++++++++++++++++++");
	t_graph.updateGraphState();*/

});






