// const addressBar = document.getElementById('addressBar');

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
const inCallID = 'calling';

// const participantName = document.getElementById('participantName');
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

export function registerCamBtnListener(f) {
  toggleCamBtn.addEventListener('click', f);
}

export function registerMicBtnListener(f) {
  toggleMicBtn.addEventListener('click', f);
}


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


export function registerJoinListener(f) {
  window.addEventListener('join-call', (e) => {
    const { url, name } = e.detail;
    f(url, name)
      .then((joined) => {
        api.callJoinUpdate(joined);
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
  leaveBtn.addEventListener(clickEvent, leave);
  window.addEventListener('leave-call', leave);
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

function setupInCallView(callURL) {
  const entry = document.getElementById(entryID);
  const inCall = document.getElementById(inCallID);
  entry.style.display = 'none';
  inCall.style.display = 'block';
  const wrapper = document.getElementById('callControlsPalette');
  wrapper.classList.remove(entryID);
  wrapper.classList.add(inCallID);

  // const copyButton = document.getElementById('clipboard');
  // copyButton.onclick = () => {
  //   navigator.clipboard.writeText(callURL).catch((err) => {
  //     const msg = 'failed to copy room URL to clipboard';
  //     console.error(msg, err);
  //     alert(msg);
  //   });
  // };
}

joinForm.addEventListener('submit', (event) => {
  event.preventDefault();
  // console.log("test");
  api.joinCall(callURL, "participantNamevalue");
  setupInCallView(callURL);
});


quitBtn.addEventListener('click', () => {
  api.close();
});

homeBtn.addEventListener('click', () => {
  api.pageHome();
});

refreshBtn.addEventListener('click', () => {
  api.refreshPage();
});

forwardBtn.addEventListener('click', () => {
  api.pageForward();
});

backBtn.addEventListener('click', () => {
  api.pageBack();
});

devBtn.addEventListener('click', () => {
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