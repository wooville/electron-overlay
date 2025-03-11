const wrapper = document.getElementById('wrapper');
let cursorIcon = document.getElementById('cursorIcon'); //one cursor for now

export default function setupParticipantCursor(participant) {
    // TODO disinct cursors
    var line = new LeaderLine(
        participant, cursorIcon, {
        endPlug: 'hand'
    }
    );

    wrapper.addEventListener('mousemove', () => {
        line.position();
    })

    line.positionByWindowResize = false;

    return line;
}



const move = (e) => {
    var x = e.pageX;
    var y = e.pageY;
    cursorIcon.style.left = x + "px";
    cursorIcon.style.top = y + "px";
}

document.addEventListener('mousemove', (e) => {
    move(e);
});


// line.color = 'red'; // Change the color to red.
// line.size = 8; // Up size.
// console.log(line.size); // Output current size.