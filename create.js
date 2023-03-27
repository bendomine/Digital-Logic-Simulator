document.getElementById('workspace').oncontextmenu = (e) => {
	e.preventDefault();
	document.getElementById('contextMenu').style.top = e.clientY + "px";
	document.getElementById('contextMenu').style.left = e.clientX + "px";
	document.getElementById('contextMenu').style.transform = "scaleY(1)";
	document.getElementById('contextMenu').style.opacity = "1";
	document.getElementById('contextMenu').scrollTop = 0;
}
document.getElementById('workspace').addEventListener('mousedown', (e) => {
	if (document.getElementById('contextMenu').style.transform == "scaleY(1)") document.getElementById('contextMenu').style.transform = "scaleY(0)";
	if (document.getElementById('contextMenu').style.opacity == "1") document.getElementById('contextMenu').style.opacity = "0";
});