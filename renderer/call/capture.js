const startButton = document.getElementById('startButton')
const stopButton = document.getElementById('stopButton')
const video = document.querySelector('video')

const options = { mimeType: 'video/mp4; codecs="avc1.424028, mp4a.40.2"' };
var mediaRecorder;
var recordedChunks = [];

startButton.addEventListener('click', () => {
  navigator.mediaDevices.getDisplayMedia({
    // audio: true,
    video: {
      width: 1920,
      height: 1080,
      frameRate: 30
    }
  }).then(stream => {
    mediaRecorder = new MediaRecorder(stream, options);
    console.log(stream);
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
    video.srcObject = stream
    video.onloadedmetadata = (e) => video.play()
  }).catch(e => console.log(e))
})

stopButton.addEventListener('click', () => {
  video.pause()
  console.log("stopping");
  mediaRecorder.stop();
  recordedChunks = [];
})





function handleDataAvailable(event) {
  console.log("data-available");
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
    console.log(recordedChunks);
    download();
  } else {
    // …
  }
}
function download() {
  const blob = new Blob(recordedChunks, {
    type: "video/mp4",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = url;
  a.download = "test.mp4";
  a.click();
  URL.revokeObjectURL(url);
}

// demo: to download after 9sec
// setTimeout((event) => {
//         console.log("stopping");
//         mediaRecorder.stop();
//     }, 9000);