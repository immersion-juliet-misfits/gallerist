import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import DrawingList from './DrawingList';


function Canvas() {
  const paintCanvasRef = useRef(null);
  const isPainting = useRef(false);
  const undoHistory = useRef([]);
  const redoHistory = useRef([]);
  const [brushSize, setBrushSize] = useState(15);
  const [color, setColor] = useState('#000000');
  const [tool, setTool] = useState('brush');
  const [title, setTitle] = useState('');
  const [drawings, setDrawings] = useState([]);
  const [currentDrawing, setCurrentDrawing] = useState(null);

  useEffect(() => {
    function handleShortcut(e) {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        moveHistory(true);
      }
      if (e.ctrlKey && e.key === 'x') {
        e.preventDefault();
        moveHistory(false);
      }
      if (e.key === 'b') {
        setTool('brush');
      }
      if (e.key === 'e') {
        setTool('eraser');
      }
      if (e.key === 'v') {
        setTool('bucket');
      }
    }

    window.addEventListener('keydown', handleShortcut);

    return () => {
      window.removeEventListener('keydown', handleShortcut);
    };
  }, []);

  useEffect(() => {
    fetchDrawings();
  }, []);

  function fetchDrawings() {
    axios.get('/db/drawings')
      .then((res) => setDrawings(res.data))
      .catch((err) => console.error('Could not fetch drawings: ', err));
  }

  function startStroke(e) {
    const { x, y } = getScaledPoint(e);
    if (tool === 'bucket') {
      floodFill(x, y, color);
      return;
    }
    isPainting.current = true;
    const ctx = paintCanvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }

  function paint(e) {
    if (!isPainting.current) return;
    const ctx = paintCanvasRef.current.getContext('2d');
    const { x, y } = getScaledPoint(e);
    ctx.lineTo(x, y);
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = color;
    if (tool === 'brush') {
      ctx.globalCompositeOperation = 'source-over';
    } else if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    }
    ctx.stroke();
  }

  function stopStroke() {
    isPainting.current = false;
    undoHistory.current.push(paintCanvasRef.current.toDataURL());
  }

  function adjustBrushSize(e) {
    setBrushSize(Number(e.target.value));
  }

  function adjustColor(e) {
    setColor(e.target.value);
  }

  function moveHistory(undone) {
    if (!undoHistory.current.length && undone) return;
    if (!redoHistory.current.length && !undone) return;
    const canvas = paintCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    undone 
      ? redoHistory.current.push(undoHistory.current.pop())
      : undoHistory.current.push(redoHistory.current.pop());
    img.src = undoHistory.current[undoHistory.current.length - 1];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }

  function saveDrawing(e) {
    e.preventDefault();
    const canvas = paintCanvasRef.current;
    const imageUrl = canvas.toDataURL();
    if (!currentDrawing) {
      axios.post('/db/drawings', {
        art: {
          imageUrl,
          isForSale: false,
          title,
        },
      })
        .then((res) => {
          setDrawings((prev) => [...prev, res.data]);
          setCurrentDrawing(res.data);
        })
        .catch((err) => console.error('Save failed: ', err));
    } else {
      axios.put(`/db/drawings/${currentDrawing._id}`, {
        art: {
          imageUrl,
        },
      })
        .then((res) => {
          setDrawings((prev) => prev.map((d) => (d._id === res.data._id ? res.data : d)));
          setCurrentDrawing(res.data);
        })
        .catch((err) => console.log('Save failed: ', err));
    }
    setTitle('');
  }

  function loadDrawing(id) {
    const canvas = paintCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const drawing = drawings.find((d) => d._id === id);

    if (!drawing) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setCurrentDrawing(null);
      undoHistory.current = [];
      redoHistory.current = [];
      return;
    }

    setCurrentDrawing(drawing);
    const img = new Image();
    img.src = drawing.imageUrl;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      undoHistory.current = [drawing.imageUrl];
      redoHistory.current = [];
    };
  }

  function getScaledPoint(e) {
    const canvas = paintCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function floodFill(startX, startY, fillColor) {
    const canvas = paintCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = imageData;

    const startX_int = Math.floor(startX);
    const startY_int = Math.floor(startY);

    function getPixelIndex(x, y) {
      return (y * width + x) * 4;
    }

    const startIdx = getPixelIndex(startX_int, startY_int);
    const startColor = [data[startIdx], data[startIdx + 1], data[startIdx + 2], data[startIdx + 3]];

    const fillRGBA = hexToRGBA(fillColor);

    if (colorsMatch(startColor, fillRGBA)) return;

    const queue = [[startX_int, startY_int]];

    while (queue.length) {
      const [x, y] = queue.pop();
      if (x < 0 || x >= width || y < 0 || y >= height) continue;

      const idx = getPixelIndex(x, y);
      const currentColor = [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
      if (!colorsMatch(currentColor, startColor)) continue;

      data[idx] = fillRGBA[0];
      data[idx + 1] = fillRGBA[1];
      data[idx + 2] = fillRGBA[2];
      data[idx + 3] = fillRGBA[3];

      queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
  }

  function colorsMatch(a, b, tolerance = 32) {
    return (
      Math.abs(a[0] - b[0]) <= tolerance
      && Math.abs(a[1] - b[1]) <= tolerance
      && Math.abs(a[2] - b[2]) <= tolerance
      && Math.abs(a[3] - b[3]) <= tolerance
    );
  }

  function hexToRGBA(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b, 255];
  }

  return (
    <div>
      <div className="d-flex align-items-center gap-2 flex-wrap bg-light p-2">
        <Form onSubmit={saveDrawing} className="d-flex align-items-center gap-2">
          <Form.Control
            size="sm"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title your Drawing"
            style={{ width: '130px' }}
          />
          <Button variant="primary" size="sm" type="submit">
            Save
          </Button>
        </Form>
        <span className="small">Brush Size</span>
        <input
          type="range"
          min="0.5"
          max="15"
          step="0.1"
          value={brushSize}
          onChange={adjustBrushSize}
        />
        <input
          type="color"
          value={color}
          onChange={adjustColor}
          style={{ width: '32px', height: '32px', padding: '2px' }}
        />
        <OverlayTrigger placement="bottom" overlay={<Tooltip>b</Tooltip>}>
          <Button variant="dark" size="sm" onClick={() => setTool('brush')}>
            Brush
          </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={<Tooltip>e</Tooltip>}>
          <Button variant="dark" size="sm" onClick={() => setTool('eraser')}>
            Eraser
          </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={<Tooltip>v</Tooltip>}>
          <Button variant="dark" size="sm" onClick={() => setTool('bucket')}>
            Bucket
          </Button>
        </OverlayTrigger>

        <OverlayTrigger placement="bottom" overlay={<Tooltip>ctrl + z</Tooltip>}>
          <Button variant="dark" size="sm" onClick={() => moveHistory(true)}>
            Undo
          </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={<Tooltip>ctrl + x</Tooltip>}>
          <Button variant="dark" size="sm" onClick={() => moveHistory(false)}>
            Redo
          </Button>
        </OverlayTrigger>
      </div>
      <div style={{
        position: 'relative',
        width: '600px',
        maxWidth: '100%',
        aspectRatio: '600 / 400',
      }}
      >
        <canvas
          ref={paintCanvasRef}
          style={{
            position: 'absolute',
            top: '0',
            bottom: '0',
            width: '100%',
            height: '100%',
            border: '2px solid #ccc',
          }}
          width={600}
          height={400}
          onMouseDown={startStroke}
          onMouseMove={paint}
          onMouseUp={stopStroke}
        />
      </div>
      <DrawingList
        drawings={drawings}
        currentDrawing={currentDrawing}
        loadDrawing={loadDrawing}
      />
    </div>
  );
}

export default Canvas;
