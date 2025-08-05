// const addressBar = document.getElementById('addressBar');

// import { showAllTiles } from "../call/tile";

// import setupDraggableElement from "../call/drag";

// basic nav
const quitBtn = document.getElementById('quitBtn');
const homeBtn = document.getElementById('homeBtn');
const refreshBtn = document.getElementById('refreshBtn');
const forwardBtn = document.getElementById('forwardBtn');
const backBtn = document.getElementById('backBtn');
const devBtn = document.getElementById('devBtn');

const callURL = "https://esi.daily.co/Yg0D0AfEbvFcXT7UqaC0";
// const goBtn = document.getElementById('goBtn');

const entryID = 'entry';
const inCallID = 'inCall';

const participantName = document.getElementById('participantName');
const toggleSeeMyselfBtn = document.getElementById('toggleSeeMyself');
const toggleClickableTilesBtn = document.getElementById('toggleClickableTiles');
const joinForm = document.getElementById('enterCall');
const toggleCamBtn = document.getElementById('toggleCam');
const toggleMicBtn = document.getElementById('toggleMic');
// export const toggleBlurBtn = document.getElementById('toggleBlur');
// var windowTopBar = document.createElement('div')
// windowTopBar.style.width = "100%"
// windowTopBar.style.height = "32px"
// windowTopBar.style.backgroundColor = "#000"
// windowTopBar.style.position = "absolute"
// windowTopBar.style.top = windowTopBar.style.left = 0
// windowTopBar.style.webkitAppRegion = "drag"
// document.body.appendChild(windowTopBar)
const clickEvent = 'click';

// resetPalette();
// addressBar.addEventListener('submit', (event) => {
//   event.preventDefault();
//   const urlEle = document.getElementById('playgroundURL');
//   // const nameEle = document.getElementById('userName');
//   api.enterPlayground(urlEle.value);
//   // setupInCallView(urlEle.value);
// });

// function setupInCallView(callURL) {
//   const entry = document.getElementById(entryID);
//   const inCall = document.getElementById(inCallID);
//   entry.style.display = 'none';
//   inCall.style.display = 'block';
//   const wrapper = document.getElementById('wrapper');
//   wrapper.classList.remove(entryID);
//   wrapper.classList.add(inCallID);

//   const copyButton = document.getElementById('clipboard');
//   copyButton.onclick = () => {
//     navigator.clipboard.writeText(callURL).catch((err) => {
//       const msg = 'failed to copy room URL to clipboard';
//       console.error(msg, err);
//       alert(msg);
//     });
//   };
// }
window.addEventListener('join-failure', () => {
  resetPalette();
});

window.addEventListener('left-call', () => {
  resetPalette();
});

function resetPalette() {
  const entry = document.getElementById(entryID);
  const inCall = document.getElementById(inCallID);
  entry.style.display = 'block';
  inCall.style.display = 'none';
  const wrapper = document.getElementById('callControlsPalette');
  wrapper.classList.remove(inCallID);
  wrapper.classList.add(entryID);
}

export function registerSeeMyselfBtnListener(f) {
  // const toggleSeeMyselfBtn = document.getElementById('toggleSeeMyself');
  // console.log(toggleSeeMyselfBtn);
  if (toggleSeeMyselfBtn) toggleSeeMyselfBtn.addEventListener('click', f);
}

export function registerClickableTilesBtnListener(f) {
  // const toggleClickableTilesBtn = document.getElementById('toggleClickableTiles');
  // console.log(toggleClickableTilesBtn);
  if (toggleClickableTilesBtn) toggleClickableTilesBtn.addEventListener('click', f);
}

export function registerCamBtnListener(f) {
  if (toggleCamBtn) toggleCamBtn.addEventListener('click', f);
}

export function registerMicBtnListener(f) {
  if (toggleCamBtn) toggleMicBtn.addEventListener('click', f);
}

export function registerJoinListener(f) {
  window.addEventListener('join-call', (e) => {
    const { url, name } = e.detail;
    f(url, name)
      .then((joined) => {
        api.callJoinUpdate(joined);
        // showAllTiles();
        if (joined) {
          // updateClipboardBtnClick(url);
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
    // updateClipboardBtnClick(null);
  };
  if (leaveBtn) leaveBtn.addEventListener(clickEvent, leave);
  window.addEventListener('leave-call', leave);
}

export function updateCamBtn(camOn) {
  const off = 'cam-off';
  const on = 'cam-on';
  if (camOn && toggleCamBtn && !toggleCamBtn.classList.contains(on)) {
    toggleCamBtn.classList.remove(off);
    toggleCamBtn.classList.add(on);
  }
  if (!camOn && toggleCamBtn && !toggleCamBtn.classList.contains(off)) {
    toggleCamBtn.classList.remove(on);
    toggleCamBtn.classList.add(off);
  }
}

export function updateMicBtn(micOn) {
  const off = 'mic-off';
  const on = 'mic-on';

  if (micOn && toggleMicBtn && !toggleMicBtn.classList.contains(on)) {
    toggleMicBtn.classList.remove(off);
    toggleMicBtn.classList.add(on);
  }
  if (!micOn && toggleMicBtn && !toggleMicBtn.classList.contains(off)) {
    toggleMicBtn.classList.remove(on);
    toggleMicBtn.classList.add(off);
  }
}
function setupInCallView(callURL) {
  const entry = document.getElementById(entryID);
  const inCall = document.getElementById(inCallID);
  entry.style.display = 'none';
  inCall.style.display = 'flex';
  const wrapper = document.getElementById('callControlsPalette');
  wrapper?.classList.remove(entryID);
  wrapper?.classList.add(inCallID);

  // const copyButton = document.getElementById('clipboard');
  // copyButton.onclick = () => {
  //   navigator.clipboard.writeText(callURL).catch((err) => {
  //     const msg = 'failed to copy room URL to clipboard';
  //     console.error(msg, err);
  //     alert(msg);
  //   });
  // };
}

export function updateCallControlsPalette(inCall) {
  // const controls = document.getElementById('callControlsPalette');
  // const on = 'controls-on';

  // // var line = new LeaderLine(
  // //   document.getElementById('testbox'),
  // //   document.getElementById('testbox2')
  // // );
  // // line.color = 'red'; // Change the color to red.
  // // line.size = 8; // Up size.
  // // console.log(line.size); // Output current size.

  // // If the user has joined a call, remove the call entry form
  // // and display the call controls. Otherwise, do the opposite.
  // if (inCall) {
  //   controls?.classList.add(on);
  //   return;
  // }
  // controls?.classList.remove(on);
}

if (joinForm) joinForm.addEventListener('submit', (event) => {
  event.preventDefault();
  // console.log("test");
  api.joinCall(callURL, participantName.value);
  setupInCallView(callURL);
});

if (toggleSeeMyselfBtn) toggleSeeMyselfBtn.addEventListener('click', () => {
  api.toggleSeeMyself();
});

if (toggleClickableTilesBtn) toggleClickableTilesBtn.addEventListener('click', () => {
  // api.toggleClickableTiles();
});

if (quitBtn) quitBtn.addEventListener('click', () => {
  api.close();
});

if (homeBtn) homeBtn.addEventListener('click', () => {
  api.pageHome();
});

if (refreshBtn) refreshBtn.addEventListener('click', () => {
  api.refreshPage();
});

if (forwardBtn) forwardBtn.addEventListener('click', () => {
  api.pageForward();
});

if (backBtn) backBtn.addEventListener('click', () => {
  api.pageBack();
});

if (devBtn) devBtn.addEventListener('click', () => {
  api.pageDev();
});

// function resetTray() {
//   const entry = document.getElementById(entryID);
//   const inCall = document.getElementById(inCallID);
//   entry.style.display = 'block';
//   inCall.style.display = 'none';
//   const wrapper = document.getElementById('wrapper');
//   wrapper.classList.remove(inCallID);
//   wrapper.classList.add(entryID);
// }