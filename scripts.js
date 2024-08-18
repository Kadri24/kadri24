var i = 0;
var txt = 'Kadri24';
var speed = 100;

function typeWriter() {
  if (i < txt.length) {
    document.getElementById("bigTitle").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}

window.onload = function() {
  typeWriter();
};