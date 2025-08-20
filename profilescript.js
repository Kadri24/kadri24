const videoPaths = [
    "assets/videos/profile-bg/video-background1.mp4",
    "assets/videos/profile-bg/video-background2.mp4"
];

const randomIndex = Math.floor(Math.random() * videoPaths.length);
const randomVideoPath = videoPaths[randomIndex];

const videoSource = document.getElementById("video-source");

const unlockScreen = document.getElementById("unlock");
const backgroundVideo = document.getElementById("background-video")
const maindiv = document.getElementById("main-div")
const pageName = "kadri24"

if (videoSource && backgroundVideo) {
    videoSource.src = randomVideoPath;
    backgroundVideo.load();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function animateTitle() {
    while (true) {
        for (let i = 1; i <= pageName.length; i++) {
            document.title = "@"+pageName.slice(0, i);
            await sleep(500);
        }
        await sleep(1000);
        for (let j = pageName.length - 1; j > 0; j--) {
            document.title = "@"+pageName.slice(0, j);
            await sleep(500);
        }
        await sleep(500);
    }
}

unlockScreen.onclick = function() {
    unlockScreen.classList.add("hidden");
    backgroundVideo.classList.add("unblur");

    backgroundVideo.muted = false;
    backgroundVideo.volume = 0;

    gsap.to(backgroundVideo, {
        volume: 0.1,
        duration: 0.5,
        ease: "power1.out"
    });
    setTimeout(() => {
        unlockScreen.style.display = "none";
        maindiv.classList.add("show")
    }, 500);

    animateTitle();
};