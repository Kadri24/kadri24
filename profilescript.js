const unlockScreen = document.getElementById("unlock");
const backgroundVideo = document.getElementById("background-video")
const card = document.getElementById("card")
const pageName = "kadri24"

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

    backgroundVideo.volume = 0.1
    backgroundVideo.muted = false
    setTimeout(() => {
        unlockScreen.style.display = "none";
        card.classList.add("show")
    }, 500);

    animateTitle();
};