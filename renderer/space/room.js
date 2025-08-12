import { addOrUpdateTile, hideAllTiles } from '../call/tile.js';
import setupDraggableElement, { refreshDraggableElement } from '../call/drag.js'
// import { ipcRenderer } from 'electron';

const wrapper = document.getElementById('wrapper');
// const webstrates = document.getElementById('webstrates');
const modeBtn = document.getElementById('modeBtn');
// const applyColorBtn = document.getElementById('applyColor');
// const roomLayer0 = document.getElementById('roomLayer0');

// const syncBtn = document.getElementById('syncBtn');
// const presetsBtn = document.getElementById('presetsBtn');
// const editBtn = document.getElementById('editBtn');
// const refreshBtn = document.getElementById('refreshBtn');

let clickEvent = 'click';
export const specialUserName = 'You'

const wrapperObserver = new MutationObserver(function (mutations) {
  // check every detected mutation inside of wrapper wrapper and handle accordingly
  mutations.forEach(function (mutation) {
    switch (mutation.type) {
      case "childList":
        //setup new nodes
        // refreshClickableElements();
        break;
      case "attributes":
        switch (mutation.attributeName) {
          case "class":
          //               handleMutationEdit(mutation);
          handleMutationClickableTiles(mutation);
          break;
        }
        break;
    }
  });
});

// const paletteControls = document.getElementById('paletteControls');
// refreshDraggableElement(paletteControls);

// function refreshClickableElements() {
//   const clickableElements = document.querySelectorAll('.clickable');
//   const listeningAttr = 'listeningForMouse';
//   for (let i = 0; i < clickableElements.length; i += 1) {
//     const ele = clickableElements[i];
//     // If the listeners are already set up for this element, skip it.
//     if (ele.getAttribute(listeningAttr)) {
//       continue;
//     }
//     ele.addEventListener('mouseenter', () => {
//       ipcRenderer.invoke('set-ignore-mouse-events', false);
//       console.log(ele);
//       // ipcRenderer.invoke('focus-call', true);
//     });
//     ele.addEventListener('mouseleave', () => {
//       ipcRenderer.invoke('set-ignore-mouse-events', true, { forward: true });
//     });
//     ele.setAttribute(listeningAttr, true);
//   }
// }

//   function handleMutationEdit(mutation){
//     if (mutation.oldValue.includes("edit") != mutation.target.className.includes("edit")) {
// //       console.log("edit toggle");
//       setupAllElements();
//     }
//   }

function handleMutationClickableTiles(mutation) {
  // check draggable locks
  if (mutation.target.classList.contains('clickthrough')) {
    //         console.log("lock");
    var drag = Draggable.get(mutation.target);
    if (drag) drag.disable();
  } else if (mutation.target.className.includes("clickable")) {
    // console.log(mutation.target);
    //         Draggable.get(mutation.target.id).enable();
    var drag = Draggable.get(mutation.target);
    if (drag) drag.enable();
  }
}

wrapperObserver.observe(wrapper, {
  childList: true, // observe direct children
  subtree: true,
  //     characterDataOldValue: true // pass old data to callback
  attributes: true,
  //     attributeOldValue: true,
  attributeFilter: ['class']
});

// electron.screen.getCursorScreenPoint();
// document.onmousemove = (event) => { api.sendMouseMove(event.x, event.y); }
// document.onclick = (event) => { api.sendClick(event.x, event.y); }
// document.onmousedown = (event) => { api.sendMouseDown(event.x, event.y); }
// document.onmouseup = (event) => { api.sendMouseUp(event.x, event.y); }
// document.onmousewheel = (event) => { api.sendMouseWheel(event.deltaX, event.deltaY); }

// window.onkeydown = (event) => { api.sendKeyDown(event.keyDown); }
// remote.getCurrentWebContents().sendInputEvent({ type: 'mouseMove', x: 10, y: 10 })

// window.addEventListener('focus', () => {
//     roomLayer0.classList.add('roomLayer-on');
//     // window.title = 'focused';
//     // mousePos = screen.getCursorScreenPoint();
//     // console.log(mousePos);
//     // callWindow.transparent = false;
// });

// window.addEventListener('blur', () => {
//     roomLayer0.classList.remove('roomLayer-on');
//     // window.title = 'blurred';
//     // callWindow.transparent = true;
// });

modeBtn.addEventListener(clickEvent, changeMode);
// applyColorBtn.addEventListener(clickEvent, applyColor);
// syncBtn.addEventListener(clickEvent, requestSync);
// presetsBtn.addEventListener(clickEvent, requestPresets);
// editBtn.addEventListener(clickEvent, requestEdit);
// refreshBtn.addEventListener(clickEvent, refreshPage);
// addOrUpdateTile(specialUserName, specialUserName, null, null, true);
// addOrUpdateTile('specialUserName', 'specialUserName', null, null, false);
// hideAllTiles();
// window.open('https://google.com');
// webstrate.webstrate.on("transcluded", function (webstrateId, clientId, user) {
//     // The webstrate client in the iframe has now finished loading.
//     console.log("clude test");
// });
// setupParticipantCursor(p);
const refreshBtn = document.getElementById('refreshBtn');
// registerToggleRoomListener(toggleRoom);
if (refreshBtn) refreshBtn.addEventListener('click', () => {
  api.refreshPage();
});

function changeMode() {
  var modeCount = parseInt(modeBtn.innerHTML);
  var count = 0;
  // const nearX=["0px", window.visualViewport.width+"px"];
  // const nearY=["0px", window.visualViewport.height+"px"];
  const participants = document.querySelectorAll(".participant");


  participants.forEach(function (participant) {
    var state = Flip.getState(participant);
    var cs = getComputedStyle(participant);
    // console.log(count);
    participant.style.width = "";
    participant.style.height = "";
    participant.style.left = "";
    participant.style.top = "";

    if (modeCount % 2 === 1) {
      participant.style.width = "800px";
      participant.style.height = "800px";
    }

    if (modeCount < 2) {
      //mode0
      // participant.style.width = "";
      // participant.style.height = "";
      // participant.style.left = "";
      // participant.style.top = "";
      participant.style.left = (count % 2 === 0) ? "0px" : (window.visualViewport.width - parseInt(cs.width, 10)) + "px";
      participant.style.top = (window.visualViewport.height - parseInt(cs.height, 10)) + "px";
    } else if (modeCount < 4) {
      //mode1

      // TweenLite.set(participant, { width: 800, height: 800 });

      participant.style.left = "0px";
      participant.style.top = (parseInt(cs.height, 10) * count) + "px";
    } else if (modeCount < 6) {
      //mode2


      participant.style.top = (count % 2 === 0) ? "0px" : (window.visualViewport.height - parseInt(cs.height, 10)) + "px";
      participant.style.left = (window.visualViewport.width - parseInt(cs.width, 10)) + "px";
    }

    // participant.style.left = fourCorners[(count+1)%3];
    console.log(participant.style.top + ", " + participant.style.left);
    count++;
    // count %= 2;

    Flip.from(state, {
      duration: 1,
      ease: "power1.inOut",
      absolute: true,
      onComplete: updateDraggable(participant)
    });

  });

  modeBtn.innerHTML = (modeCount + 1) % 6;
}

function updateDraggable(participant) {
  Draggable.get(participant)?.update();
  setupDraggableElement(participant);
  refreshDraggableElement(participant);
}

function requestSync() {
  // const seats = webstrate.contentWindow.document.querySelectorAll(".draggable");
  // console.log(seats.length);

  // const frame = document.getElementById('your-frame-id');
  // webstrates.contentWindow.postMessage("messageData test", webstrates.getAttribute("src"));
  api.requestSync();
}

function requestPresets() {
  api.requestPresets();
}

function requestEdit() {
  api.requestEdit();
}

function refreshPage() {
  api.refreshPage();
}

function applyColor() {
  const pickColorMain = document.getElementById('pickColorMain');
  const pickColorAccent = document.getElementById('pickColorAccent');
  const roomWrapper = document.getElementById("webstrates").contentWindow.document.getElementById("wrapper");
  roomWrapper.style.backgroundColor = pickColorMain.value;
  console.log(roomWrapper.id + ", " + pickColorMain.value);
}

function toggleRoom() {
  if (roomLayer0.classList.contains('roomLayer-on')) {
    roomLayer0.classList.remove('roomLayer-on');
  } else {
    roomLayer0.classList.add('roomLayer-on');
  }
  console.log(roomLayer0.classList);
}

// function registerToggleRoomListener(f) {
//     const toggleRoomBtn = document.getElementById('toggleRoom');
//     const toggleRoom = () => {
//         f();
//         api.leftCall();
//         updateClipboardBtnClick(null);
//     };
//     toggleRoomBtn.addEventListener(clickEvent, toggleRoom);
//     // window.addEventListener('leave-call', toggleRoom);
// }