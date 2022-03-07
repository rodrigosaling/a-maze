export default function resizeCanvas(canvas) {
  const { width, height } = canvas.getBoundingClientRect();

  if (canvas.width !== width || canvas.height !== height) {
    // const { devicePixelRatio: ratio = 1 } = window;
    const ratio = 1;
    const context = canvas.getContext('2d');
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.scale(ratio, ratio);
    return true; // here you can return some useful information like delta width and delta height instead of just true
    // this information can be used in the next redraw...
  }

  return false;
}
