import { addOrUpdateTile } from "../call/tile.js";

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
export const specialUserName = 'admin'

  const wrapperObserver = new MutationObserver(function(mutations) {
    // check every detected mutation inside of wrapper wrapper and handle accordingly
    mutations.forEach(function(mutation) {
      switch (mutation.type) {
        case "childList":
          //setup new nodes
        //   handleMutationNodeAddRemove(mutation);
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

//   function handleMutationNodeAddRemove(mutation){
//     mutation.addedNodes.forEach(function(newElement) {
//       setupElement(newElement);
//       setupMediaPlaybackSync(newElement);
//     });
//   }
  
//   function handleMutationEdit(mutation){
//     if (mutation.oldValue.includes("edit") != mutation.target.className.includes("edit")) {
// //       console.log("edit toggle");
//       setupAllElements();
//     }
//   }

  function handleMutationClickableTiles(mutation) {
    // check draggable locks
    if (mutation.target.classList.contains('tile') && mutation.target.classList.contains('clickthrough')){
      //         console.log("lock");
      var drag = Draggable.get(mutation.target);
      if (drag) drag.disable();
    } else if (mutation.target.className.includes("clickable")){
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
document.onmousemove = (event) => { api.sendMouseMove(event.x, event.y); }
// document.onclick = (event) => { api.sendClick(event.x, event.y); }
document.onmousedown = (event) => { api.sendMouseDown(event.x, event.y); }
document.onmouseup = (event) => { api.sendMouseUp(event.x, event.y); }
document.onmousewheel = (event) => { api.sendMouseWheel(event.deltaX, event.deltaY); }

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
addOrUpdateTile(specialUserName, specialUserName, null, null, true);
// webstrate.webstrate.on("transcluded", function (webstrateId, clientId, user) {
//     // The webstrate client in the iframe has now finished loading.
//     console.log("clude test");
// });
// setupParticipantCursor(p);

// registerToggleRoomListener(toggleRoom);

function toggleSeeMyself() {
    const tiles = document.querySelectorAll(".tile.localUser");
    tiles.forEach(function (tile) {
        tile.classList.toggle("hide");
    });
}

function toggleClickableTiles() {
    const participants = document.querySelectorAll(".participant");
    console.log(participants.length);
    participants.forEach(function (participant) {
        participant.classList.toggle("clickthrough");
    });
}

function changeMode() {
    var modeCount = parseInt(modeBtn.innerHTML);
    var count = 0;
    // const nearX=["0px", window.visualViewport.width+"px"];
    // const nearY=["0px", window.visualViewport.height+"px"];
    const participants = document.querySelectorAll(".participant");

    participants.forEach(function (participant) {
        var cs = getComputedStyle(participant);
        console.log(modeCount);
        if (modeCount%3===0) {
            //mode0
            participant.style.width="";
            participant.style.height="";
            participant.style.left="";
            participant.style.top="";

            participant.style.left= (count%2===0) ? "0px" : window.visualViewport.width-cs.width+"px";
            participant.style.top= window.visualViewport.height-cs.height+"px";
        } else if (modeCount%3===1) {
            //mode1
            participant.style.width="";
            participant.style.height="";
            participant.style.left="";
            participant.style.top="";

            participant.style.width="800px";
            participant.style.height="800px";
            participant.style.left= "0px";
            participant.style.top= cs.height*count+"px";
        } else if (modeCount%3===2){
            //mode2
            participant.style.width="";
            participant.style.height="";
            participant.style.left="";
            participant.style.top="";

            participant.style.top= (count%2===0) ? "0px" : window.visualViewport.width-cs.height+"px";
            participant.style.left= window.visualViewport.height-cs.width+"px";
        }
        
        // participant.style.left = fourCorners[(count+1)%3];
        console.log(cs.width + ", " + cs.top);
        count++;
        // count %= 2;
        
        Draggable.get(participant)?.update();
    });

    modeBtn.innerHTML = (modeCount+1)%3;
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