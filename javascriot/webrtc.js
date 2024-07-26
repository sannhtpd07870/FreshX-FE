const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chathub")
    .build();
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
let localStream;
let remoteStream;
let peerConnection;

const config = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302",
        },
    ],
};

connection.start().then(() => {
    console.log("SignalR connected");
});

connection.on("ReceiveMessage", (user, message) => {
    console.log(`${user}: ${message}`);
    addAIMessage(message);
});

connection.on("CallStarted", async (offer) => {
    console.log("Call started with offer:", offer);

    peerConnection = new RTCPeerConnection(config);
    peerConnection.ontrack = (event) => {
        remoteVideo.srcObject = event.streams[0];
    };
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            connection.invoke("SendIceCandidate", event.candidate);
        }
    };

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    connection.invoke("SendAnswer", answer);
});

connection.on("ReceiveAnswer", async (answer) => {
    console.log("Received answer:", answer);
    await peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
    );
});

connection.on("ReceiveIceCandidate", async (candidate) => {
    console.log("Received ICE candidate:", candidate);
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
});

async function startCall() {
    localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
    });
    localVideo.srcObject = localStream;

    peerConnection = new RTCPeerConnection(config);
    localStream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, localStream));

    peerConnection.ontrack = (event) => {
        remoteVideo.srcObject = event.streams[0];
    };

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            connection.invoke("SendIceCandidate", event.candidate);
        }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    connection.invoke("StartCall", offer);
}

function endCall() {
    peerConnection.close();
    localStream.getTracks().forEach((track) => track.stop());
    connection.invoke("EndCall");
}
