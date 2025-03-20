import { addOrUpdateTile } from "../call/tile.js";

const wrapper = document.getElementById('wrapper');
let toggleRoomBtn = document.getElementById('toggleRoom');
let roomLayer0 = document.getElementById('roomLayer0');

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

toggleRoomBtn.addEventListener(clickEvent, toggleRoom);
addOrUpdateTile(specialUserName, specialUserName, null, null, true);
// setupParticipantCursor(p);

// registerToggleRoomListener(toggleRoom);

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