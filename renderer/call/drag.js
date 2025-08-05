// document.addEventListener('dragover', event => event.preventDefault())
// document.addEventListener('drop', event => event.preventDefault())

// const wrapper = document.getElementById('wrapper');
// var dragged = null; //The note currently dragged
// var offset = {x: 0, y: 0}; //Offset from mouse when dragging
// var prevDimensions = {width: 0, height: 0};
// // On a mouse-down event, check if the target is a note, if so store it and its offset from the mouse.
// wrapper.addEventListener("mousedown", function(e) {
//   var target = e.target.closest(".draggable");
// //   console.log("test");
//   if (target===null || e.target.closest(".undraggable")) return;
// //     if (edited) return; // If we are editing, we want to disable dragging.

//   dragged = target;
//   var style = getComputedStyle(dragged);
  
//   offset.x = e.clientX - parseInt(style.getPropertyValue("left"));
//   offset.y = e.clientY - parseInt(style.getPropertyValue("top"));
//   prevDimensions.width = parseInt(style.getPropertyValue("width"));
//   prevDimensions.height = parseInt(style.getPropertyValue("height"));
// });

// // On a mouse-move event, check if something is dragged, if so position it relative to the stored offset.
// wrapper.addEventListener("mousemove", function(e) {
//   if (dragged === null) return;

//   var style = getComputedStyle(dragged);
//   if (prevDimensions.width != parseInt(style.getPropertyValue("width"))) return;
//   if (prevDimensions.height != parseInt(style.getPropertyValue("height"))) return;
// //     if (edited) return;
//   var left = e.clientX - offset.x;
//   var top = e.clientY - offset.y;
// //   var zIndex = 998;
//   dragged.style.left = left+"px";
//   dragged.style.top = top+"px";
// //   dragged.style.zIndex = zIndex+"px";
// //     dragged.setAttribute("style", "z-index:"+zIndex+";"+"left: "+left+"px; top:"+top+"px;");
// });

// wrapper.addEventListener("mouseup", function(e) {
//   if (dragged === null) return;
//   dragged = null;
// });

// wrapper.addEventListener("mouseleave", function(e) {
//   if (dragged === null) return;
//   dragged = null;
// });

  // var container = document.querySelector("#wrapper");
  // var dragElements = document.querySelectorAll(".draggable");

  // for (var i = 0; i < dragElements.length; i++) {
  //   setupDraggableElement(dragElements[i]);
  // }

  export default function setupDraggableElement(element) {
    var container = document.querySelector("#wrapper");
    var handles = element.querySelectorAll(".resize-handle");
    var handle;
    
    if (handles.length > 0) {
      for (var i = 1; i < handles.length; i++) {
        handles[i].remove();
      }
      handle = handles[0];
    } else {
      handle = document.createElement("div");
      handle.className = "resize-handle clickable";
      element.appendChild(handle);
    }

    var rect1 = element.getBoundingClientRect();

    TweenLite.set(handle, { x: rect1.width, y: rect1.height });

    var rect2 = handle.getBoundingClientRect();

    var offset = {
      x1: rect2.left - rect1.right,
      y1: rect2.top - rect1.bottom,
      x2: rect2.right - rect1.right,
      y2: rect2.bottom - rect1.bottom
    };

    Draggable.create(element, {
      bounds: container,
      type: "left,top",
      autoScroll: 1,
      inertia: true,
    });

    Draggable.create(handle, {
      bounds: container,
      type: "left,top",
      autoScroll: 1,
      onPress: function(e) {
        e.stopPropagation();
      },
      onDrag: function() {      
        var w = parseInt(element.style.width,10);
      var h = parseInt(element.style.height,10);
      if (isNaN(w)) w=0;
      if (isNaN(h)) h=0;
        TweenLite.set(element, { width: this.x + rect1.width, height: this.y + rect1.height });      
      },
      liveSnap: {
        x: function(x) {
          return clamp(x, -offset.x1, x + offset.x2);
        },
        y: function(y) {
          return clamp(y, -offset.y1, y + offset.y2);
        }
      }
    });  
  }

  export function refreshDraggableElement(element) {
    var handle = element.querySelector(".resize-handle");
    handle.style.left = "";
    handle.style.top = "";
    var rect1=element.getBoundingClientRect();
    // var cs = getComputedStyle(element);
    var w = parseInt(element.style.width,10);
    var h = parseInt(element.style.height,10);
    if (isNaN(w)) w=0;
    if (isNaN(h)) h=0;
    console.log(rect1.width+' '+w);
    // TweenLite.set(element, { width: handle.x + rect1.width, height: handle.y + rect1.height });
    TweenLite.set(handle, { x: Math.max(rect1.width,w), y: Math.max(rect1.height, h) });    
  }

  function clamp(value, min, max) {
    return value < min ? min : (value > max ? max : value);
  }