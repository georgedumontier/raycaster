// Called initially and whenever the window resizes to update the canvas
function sizeCanvas() {
  const mainCanvas = document.getElementById("mainCanvas")
  width = window.innerWidth;
  height = window.innerHeight;
  blockSize = height > width ? parseInt(width / gridSize) : parseInt(height / gridSize) // how big are the grid squares
  mainCanvas.width = width
  mainCanvas.height = height

  // mini canvas
  const miniCanvas = document.getElementById("miniCanvas")
  if(maxMap){
    scale = 1
    miniCanvas.width = width > height ? height : width
    miniCanvas.height = miniCanvas.width
    miniCanvas.style.left = width / 2 - (miniCanvas.width / 2) + 'px'
  } else {
    miniCanvas.width = 300
    miniCanvas.height = miniCanvas.width
    miniCanvas.style.left = '0px'
    scale = parseInt(miniCanvas.width / gridSize) / blockSize
  }
}