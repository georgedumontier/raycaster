// Called initially and whenever the window resizes to update the canvas
function sizeCanvas() {
  const canvas = document.getElementById("canvas");
  width = window.innerWidth;
  height = window.innerHeight;
  blockSize = height > width ? parseInt(width / gridSize) : parseInt(height / gridSize)
  canvas.width = blockSize * 8;
  canvas.height = blockSize * 8;
}