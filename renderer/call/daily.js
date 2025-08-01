// daily.js contains all DailyJS listeners and call joining/leaving logic.

import {
    // registerJoinListener,
    // registerLeaveBtnListener,
    // registerCamBtnListener,
    // registerMicBtnListener,
    // updateCamBtn,
    // updateMicBtn,
    updateCallControls,
  //   //   // registerBlurBtnListener,
  //   //   // updateBlurBtn,
} from './nav.js';
import {
  addOrUpdateTile,
  removeAllTiles,
  removeTile,
  updateActiveSpeaker,
} from './tile.js';
import {
  specialUserName
} from '../space/room.js'
import {
  registerJoinListener,
  registerLeaveBtnListener,
  registerCamBtnListener,
  registerMicBtnListener,
  // registerSeeMyselfBtnListener,
  // registerClickableTilesBtnListener,
  updateCamBtn,
  updateMicBtn,
  updateCallControlsPalette,
} from '../tray/palette.js'
// import {
//   drawLine
// } from '../lines/lines.js';
const playableState = 'playable';

let callObject = null;
const localState = {
  audio: null,
  video: null,
  blur: false,
};
// const localUserName = 'You';

registerJoinListener(initAndJoin);
registerLeaveBtnListener(leave);
registerCamBtnListener(toggleCamera);
registerMicBtnListener(toggleMicrophone);
// registerSeeMyselfBtnListener(toggleSeeMyself);
// registerClickableTilesBtnListener(toggleClickableTiles);
// registerBlurBtnListener(toggleBlur);

async function initAndJoin(roomURL, name) {
  callObject = DailyIframe.createCallObject({
    dailyConfig: {
      avoidEval: true,
    },
    // inputSettings: {
    //   audio: {
    //     settings: {
    //       // oddly, in electron, this seems to make echo cancellation work :confused:
    //       echoCancellation: false,
    //     },
    //     processor: { type: 'noise-cancellation' },
    //   },
    // },
  })
    .on('camera-error', handleCameraError)
    .on('joined-meeting', handleJoinedMeeting)
    .on('left-meeting', handleLeftMeeting)
    .on('error', handleError)
    .on('participant-updated', handleParticipantUpdated)
    .on('participant-joined', handleParticipantJoined)
    .on('participant-left', handleParticipantLeft)
    .on('active-speaker-change', handleActiveSpeakerChange)
  // .on('input-settings-updated', handleInputSettingsChange);

  return callObject
    .join({ url: roomURL, userName: name })
    .then(() => true)
    .catch((err) => {
      alert(err);
      return false;
    });
}

async function leave() {
  callObject.leave();
  callObject.destroy();
  callObject = null;
}

function toggleCamera() {
  callObject.setLocalVideo(!localState.video);
}

function toggleMicrophone() {
  callObject.setLocalAudio(!localState.audio);
}

function toggleBlur() {
  let type;
  let config;
  if (!localState.blur) {
    type = 'background-blur';
    config = { strength: 0.95 };
  } else {
    type = 'none';
  }

  callObject.updateInputSettings({
    video: {
      processor: {
        type,
        config,
      },
    },
  });
}

function handleCameraError(event) {
  console.error(event);
}

function handleError(event) {
  console.error(event);
}

function handleJoinedMeeting(event) {
  updateCallControls(true);
  updateCallControlsPalette(true);
  const p = event.participants.local;
  updateLocal(p);

}

function handleLeftMeeting() {
  updateCallControls(false);
  updateCallControlsPalette(false);
  removeAllTiles();
}

function handleParticipantUpdated(event) {
  const up = event.participant;
  if (up.session_id === callObject.participants().local.session_id) {
    updateLocal(up);
    return;
  }
  const tracks = getParticipantTracks(up);
  addOrUpdateTile(up.session_id, up.user_name, tracks.video, tracks.audio);
}

function handleParticipantJoined(event) {
  const up = event.participant;
  const tracks = getParticipantTracks(up);
  addOrUpdateTile(up.session_id, up.user_name, tracks.video, tracks.audio);
}

function getParticipantTracks(participant) {
  const vt = participant?.tracks.video;
  const at = participant?.tracks.audio;

  const videoTrack = vt.state === playableState ? vt.persistentTrack : null;
  const audioTrack = at.state === playableState ? at.persistentTrack : null;
  return {
    video: videoTrack,
    audio: audioTrack,
  };
}

function handleParticipantLeft(event) {
  const up = event.participant;
  removeTile(up.session_id);
}

function handleActiveSpeakerChange(event) {
  updateActiveSpeaker(event.activeSpeaker.peerId);
}

// function handleInputSettingsChange(event) {
//   localState.blur =
//     event.inputSettings?.video?.processor?.type === 'background-blur';
//   updateBlurBtn(localState.blur);
// }

function updateLocal(p) {
  if (localState.audio !== p.audio) {
    localState.audio = p.audio;
    updateMicBtn(localState.audio);
  }
  if (localState.video !== p.video) {
    localState.video = p.video;
    updateCamBtn(localState.video);
  }
  const tracks = getParticipantTracks(p);
  addOrUpdateTile(specialUserName, specialUserName, tracks.video, tracks.audio, true);
}

// function toggleSeeMyself() {
//   const tiles = document.querySelectorAll(".tile.localUser");
//   tiles.forEach(function (tile) {
//     tile.classList.toggle("hide");
//   });
// }

// function toggleClickableTiles() {
//   const tiles = document.querySelectorAll(".participant");
//   console.log(tiles.length);
//   tiles.forEach(function (tile) {
//     tile.classList.toggle("clickthrough");
//   });
// }