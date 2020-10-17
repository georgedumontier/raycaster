// Called initially and whenever the window resizes to update the canvas
function sizeCanvas() {
  const canvas = document.getElementById("canvas");
  width = window.innerWidth;
  height = window.innerHeight;
  // blockSize = 100
  // canvas.width = blockSize * 8;
  // canvas.height = blockSize * 8;
  blockSize = height > width ? parseInt(width / gridSize) : parseInt(height / gridSize)
  canvas.width = blockSize * 8;
  canvas.height = blockSize * 8;

  columnWidth = canvas.width / fov;
}