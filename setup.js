var i = 0;
var txt = 'Kadri24: Setup';
var speed = 100;

function typeWriterSetup() {
  if (i < txt.length) {
    document.getElementById("bigTitle").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriterSetup, speed);
  }
}

window.onload = function() {
  typeWriterSetup();
};