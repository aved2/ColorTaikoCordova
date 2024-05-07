import React, { useState ,useRef, useEffect} from 'react';
import './App.css';

const Dot = React.forwardRef(({ id, onStartLine, onEndLine }, ref) => (
  <div 
    ref={ref} 
    className="dot" 
    onMouseDown={() => onStartLine(id, ref)} 
    onMouseUp={() => onEndLine(id, ref)}
  ></div>
));



const App = () => {
 const [topVertices, setTopVertices] = useState(3);
 const [bottomVertices, setBottomVertices] = useState(3);
 const [darkMode, setDarkMode] = useState(false);
 const [lines, setLines] = useState([]); 
 const [drawing, setDrawing] = useState(false);
 const MAX_VERTICES = 50;
 const dotRefs = useRef([]);
 const MIN_VERTICES = 3;
 const svgRef = useRef(null);
 const colors = ['purple', 'lightblue', 'green', 'red', 'orange', 'pink', 'mediumslateblue', 'mediumseagreen', 'rgb(183, 183, 244)', 'rosybrown', 'olivedrab', 'crimson', 'rgb(213, 213, 55)', 'palevioletred', 'indigo', 'coral', 'teal', 'plum', 'navy', 'yellowgreen'];
 const Dot = React.forwardRef(({ onDotClick }, ref) => (
   <div ref={ref} className="dot" onMouseDown={() => onDotClick(ref)}></div>
 ));




 const [currentLine, setCurrentLine] = useState(null);
 const [colorIndex, setColorIndex] = useState(0);




 const getDotPosition = (index) => {
  const dotRef = dotRefs.current[index];
  if (!svgRef.current || !dotRef) {
    return { x: 0, y: 0 };
  }
  const svgRect = svgRef.current.getBoundingClientRect();
  const dotRect = dotRef.getBoundingClientRect();
  return {
    x: dotRect.left + dotRect.width / 2 - svgRect.left,
    y: dotRect.top + dotRect.height / 2 - svgRect.top,
  };
};







 const handleMouseDown = (dotRef) => {
   if (drawing) return;
    const start = getDotPosition(dotRef);
   setDrawing(true);
   setLines([...lines, { start, end: null }]);
 };
  const handleMouseMove = (e) => {
   if (!drawing) return;
    const end = { x: e.clientX, y: e.clientY };
   const newLines = [...lines];
   newLines[newLines.length - 1].end = end;
   setLines(newLines);
 };
  const handleMouseUp = () => {
   setDrawing(false);
 };
  const undoLastLine = () => {
   setLines(lines.slice(0, -1));
 };








 const startLine = (event) => {
   if (drawing) return;
   setDrawing(true);
   const rect = svgRef.current.getBoundingClientRect();
   const newLine = {
     x1: event.clientX - rect.left,
     y1: event.clientY - rect.top,
     x2: event.clientX - rect.left,
     y2: event.clientY - rect.top,
     color: colors[colorIndex]
   };
   setCurrentLine(newLine);
 };


 const createLine = (event) => {
   if (!drawing) return;
   const rect = svgRef.current.getBoundingClientRect();
   setCurrentLine(prevLine => ({
     ...prevLine,
     x2: event.clientX - rect.left,
     y2: event.clientY - rect.top
   }));
 };


 const endLine = () => {
   if (!drawing) return;
   setLines(prevLines => [...prevLines, currentLine]);
   setCurrentLine(null);
   setDrawing(false);
   setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
 };


 useEffect(() => {
   dotRefs.current = dotRefs.current.slice(0, topVertices + bottomVertices);
 }, [topVertices, bottomVertices]);






 const handleDotClick = (index) => {
  if (lines.length && lines[lines.length - 1].end === null) {
    setLines(lines => [...lines.slice(0, -1), { ...lines[lines.length - 1], end: index }]);
  } else {
    setLines(lines => [...lines, { start: index, end: null }]);
  }
};


 const renderDots = (count, offset) => {
   return Array.from({ length: count }, (_, index) => (
     <Dot
       key={index}
       ref={el => dotRefs.current[offset + index] = el} // Ensure the ref is correctly assigned
       onDotClick={() => handleDotClick(offset + index)}
     />
   ));
 };




 const toggleDarkMode = () => {
   setDarkMode(!darkMode);
 };


 return (
   <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
     <header>
       <link rel="preconnect" href="https://fonts.googleapis.com" />
       <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
       <link href="https://fonts.googleapis.com/css2?family=DotGothic16&display=swap" rel="stylesheet" />
     </header>
     <div className="title">
       <h1>ColorTaiko!</h1>
     </div>
     <div className="container" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
       <div className="input-container">
         <label htmlFor="top-vertices">Top Vertices:</label>
         <input
           id="top-vertices"
           value={topVertices}
           min={MIN_VERTICES}
           max={MAX_VERTICES}
           maxLength={2}
           onChange={(e) => {
             const newValue = Math.min(Math.max(parseInt(e.target.value), MIN_VERTICES), MAX_VERTICES);
             setTopVertices(newValue);
           }}
         />
         <button onClick={() => setTopVertices(Math.min(topVertices + 1, MAX_VERTICES))}>+</button>
         <button onClick={() => setTopVertices(Math.max(topVertices - 1, MIN_VERTICES))}>-</button>
       </div>
       <div className="input-container">
         <label htmlFor="bottom-vertices">Bottom Vertices:</label>
         <input
           id="bottom-vertices"
           type="number"
           value={bottomVertices}
           min={MIN_VERTICES}
           max={MAX_VERTICES}
           maxLength={2}
           onChange={(e) => {
             const newValue = Math.min(Math.max(parseInt(e.target.value), MIN_VERTICES), MAX_VERTICES);
             setBottomVertices(newValue);
           }}
         />
         <button onClick={() => setBottomVertices(Math.min(bottomVertices + 1, MAX_VERTICES))}>+</button>
         <button onClick={() => setBottomVertices(Math.max(bottomVertices - 1, MIN_VERTICES))}>-</button>
       </div>
       <div className="vertices-container">
         {renderDots(topVertices, 0)}
       </div>
       <div className="vertices-container" style={{ marginTop: '100px' }}>
         {renderDots(bottomVertices, topVertices)}
       </div>
       <svg ref={svgRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          {lines.map((line, index) => {
            if (line.end !== null) {
              const startPos = getDotPosition(line.start);
              const endPos = getDotPosition(line.end);
              return (
                <line
                  key={index}
                  x1={startPos.x}
                  y1={startPos.y}
                  x2={endPos.x}
                  y2={endPos.y}
                  stroke={line.color || "black"}
                  strokeWidth="2"
                />
              );
            }
            return null;
          })}
        </svg>

     </div>
     <button id = 'undoButton' onClick={undoLastLine}>Undo Last Line</button>
     <button id="modeSwitch" onClick={toggleDarkMode}>{darkMode ? 'Light Mode' : 'Dark Mode'}</button>
   </div>
 );
}


export default App;