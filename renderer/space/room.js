import { addOrUpdateTile } from "../call/tile.js";

const wrapper = document.getElementById('wrapper');
// const webstrates = document.getElementById('webstrates');
// const toggleRoomBtn = document.getElementById('toggleRoom');
// const applyColorBtn = document.getElementById('applyColor');
// const roomLayer0 = document.getElementById('roomLayer0');

// const syncBtn = document.getElementById('syncBtn');
// const presetsBtn = document.getElementById('presetsBtn');
// const editBtn = document.getElementById('editBtn');
// const refreshBtn = document.getElementById('refreshBtn');

let clickEvent = 'click';
export const specialUserName = 'admin'

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

// toggleRoomBtn.addEventListener(clickEvent, toggleRoom);
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