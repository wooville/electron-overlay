document.addEventListener('dragover', event => event.preventDefault())
document.addEventListener('drop', event => event.preventDefault())

const wrapper = document.getElementById('wrapper');
var dragged = null; //The note currently dragged
var offset = {x: 0, y: 0}; //Offset from mouse when dragging
var prevDimensions = {width: 0, height: 0};
// On a mouse-down event, check if the target is a note, if so store it and its offset from the mouse.
wrapper.addEventListener("mousedown", function(e) {
  var target = e.target.closest(".draggable");
//   console.log("test");
  if (target===null || e.target.closest(".undraggable")) return;
//     if (edited) return; // If we are editing, we want to disable dragging.

  dragged = target;
  var style = getComputedStyle(dragged);
  
  offset.x = e.clientX - parseInt(style.getPropertyValue("left"));
  offset.y = e.clientY - parseInt(style.getPropertyValue("top"));
  prevDimensions.width = parseInt(style.getPropertyValue("width"));
  prevDimensions.height = parseInt(style.getPropertyValue("height"));
});

// On a mouse-move event, check if something is dragged, if so position it relative to the stored offset.
wrapper.addEventListener("mousemove", function(e) {
  if (dragged === null) return;

  var style = getComputedStyle(dragged);
  if (prevDimensions.width != parseInt(style.getPropertyValue("width"))) return;
  if (prevDimensions.height != parseInt(style.getPropertyValue("height"))) return;
//     if (edited) return;
  var left = e.clientX - offset.x;
  var top = e.clientY - offset.y;
//   var zIndex = 998;
  dragged.style.left = left+"px";
  dragged.style.top = top+"px";
//   dragged.style.zIndex = zIndex+"px";
//     dragged.setAttribute("style", "z-index:"+zIndex+";"+"left: "+left+"px; top:"+top+"px;");
});

wrapper.addEventListener("mouseup", function(e) {
  if (dragged === null) return;
  dragged = null;
});

wrapper.addEventListener("mouseleave", function(e) {
  if (dragged === null) return;
  dragged = null;
});