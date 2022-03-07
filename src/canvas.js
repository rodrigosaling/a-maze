import React, { useEffect, useRef } from 'react';
import useCanvas from './use-canvas.hook';
import predraw from './predraw';
import postdraw from './postdraw';

// From here: https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
// and here: https://github.com/I-Can-Do-This/Canvas-with-React.js-Code/tree/master/src

export default function Canvas(props) {
  const { draw, options, setCanvasRef, ...rest } = props;
  const { context, ...moreConfig } = options;
  const canvasRef = useCanvas(draw, { context }, { predraw, postdraw });

  return <canvas ref={canvasRef} {...rest} />;
}
