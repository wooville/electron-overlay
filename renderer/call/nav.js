// nav.js handles all call controls

import setupDraggableElement from './drag.js';

// control panels and related elements
// call controls, device toggles
const toggleCamBtn = document.getElementById('toggleCam');
const toggleMicBtn = document.getElementById('toggleMic');
const toggleBlurBtn = document.getElementById('toggleBlur');
const callControls = document.getElementById('callControls');
const callControlsDraggable = setupDraggableElement(callControls);

// room controls
// const toggleLiveBtn = document.getElementById('toggleLive'); // join/start a "room" for a call, each user entitled to their own room at least
// const roomControls = document.getElementById('roomControls');
// const roomControlsDraggable = setupDraggableElement(roomControls);

const mainControls = document.getElementById('mainControls');
// const mainControlsDraggable = setupDraggableElement(mainControls);

// avatar controls
// const avatarControls = document.getElementById('avatarControls');
// const avatarControlsDraggable = setupDraggableElement(avatarControls);

const clickEvent = 'click';



export function registerJoinListener(f) {
  window.addEventListener('join-call', (e) => {
    const { url, name } = e.detail;
    f(url, name)
      .then((joined) => {
        api.callJoinUpdate(joined);
        if (joined) {
          updateClipboardBtnClick(url);
        }
      })
      .catch(() => api.callJoinUpdate(false));
  });
}

export function registerLeaveBtnListener(f) {
  const leaveBtn = document.getElementById('leave');
  const leave = () => {
    f();
    api.leftCall();
    updateClipboardBtnClick(null);
  };
  leaveBtn.addEventListener(clickEvent, leave);
  window.addEventListener('leave-call', leave);
}

export function registerCamBtnListener(f) {
  toggleCamBtn.addEventListener(clickEvent, f);
}

export function registerMicBtnListener(f) {
  toggleMicBtn.addEventListener(clickEvent, f);
}

export function registerBlurBtnListener(f) {
  toggleBlurBtn.addEventListener(clickEvent, f);
}

export function updateCallControls(inCall) {
  const controls = document.getElementById('callControls');
  const on = 'controls-on';

  // var line = new LeaderLine(
  //   document.getElementById('testbox'),
  //   document.getElementById('testbox2')
  // );
  // line.color = 'red'; // Change the color to red.
  // line.size = 8; // Up size.
  // console.log(line.size); // Output current size.

  // If the user has joined a call, remove the call entry form
  // and display the call controls. Otherwise, do the opposite.
  if (inCall) {
    controls.classList.add(on);
    return;
  }
  controls.classList.remove(on);
}

export function updateCamBtn(camOn) {
  const off = 'cam-off';
  const on = 'cam-on';
  if (camOn && !toggleCamBtn.classList.contains(on)) {
    toggleCamBtn.classList.remove(off);
    toggleCamBtn.classList.add(on);
  }
  if (!camOn && !toggleCamBtn.classList.contains(off)) {
    toggleCamBtn.classList.remove(on);
    toggleCamBtn.classList.add(off);
  }
}

export function updateMicBtn(micOn) {
  const off = 'mic-off';
  const on = 'mic-on';
  if (micOn && !toggleMicBtn.classList.contains(on)) {
    toggleMicBtn.classList.remove(off);
    toggleMicBtn.classList.add(on);
  }
  if (!micOn && !toggleMicBtn.classList.contains(off)) {
    toggleMicBtn.classList.remove(on);
    toggleMicBtn.classList.add(off);
  }
}

export function updateBlurBtn(blurOn) {
  const off = 'blur-off';
  const on = 'blur-on';
  if (blurOn && !toggleBlurBtn.classList.contains(on)) {
    toggleBlurBtn.classList.remove(off);
    toggleBlurBtn.classList.add(on);
  }
  if (!blurOn && !toggleBlurBtn.classList.contains(off)) {
    toggleBlurBtn.classList.remove(on);
    toggleBlurBtn.classList.add(off);
  }
}

function updateClipboardBtnClick(callURL) {
  const clipboardBtn = document.getElementById('clipboard');
  if (!callURL) {
    clipboardBtn.onclick = null;
    return;
  }
  const tooltip = document.getElementById('clipboardTooltip');

  let timer;
  clipboardBtn.onclick = () => {
    const active = 'active';
    navigator.clipboard
      .writeText(callURL)
      .then(() => {
        if (!tooltip.classList.contains(active)) {
          tooltip.classList.add(active);
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          tooltip.classList.remove(active);
        }, 1200);
      })
      .catch((err) => {
        const msg = `failed to copy room URL to clipboard: ${err}`;
        console.error(msg, err);
        alert(msg);
      });
  };
}


