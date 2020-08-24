function Controls() {
  this.codes = { 65: 'left', 68: 'right', 87: 'forward', 83: 'backward' }
  this.states = { 'left': false, 'right': false, 'forward': false, 'backward': false }
  this.onKey = function(val, e) {
    let state = this.codes[e.keyCode]
    if (typeof state === 'undefined') return
    this.states[state] = val
    e.preventDefault && e.preventDefault()
    e.stopPropagation && e.stopPropagation()
  };
  document.addEventListener('keydown', this.onKey.bind(this, true), false)
  document.addEventListener('keyup', this.onKey.bind(this, false), false)
}