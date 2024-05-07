import React, { useCallback, useState } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge } from 'reactflow';
 
import 'reactflow/dist/style.css';
import './App.css';
 
const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
  { id: '3', position: { x: 0, y: 200 }, data: { label: '2' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
 
export default function App() {
  const MIN_VERTICES = 3;
  const MAX_VERTICES = 50;
  const [darkMode, setDarkMode] = useState(false);
  const [topVertices, setTopVertices] = useState(3);
  const [bottomVertices, setBottomVertices] = useState(3);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
 
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const undoLastLine = () => {
    setEdges(edges.slice(0, -1));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
 
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div className='option-wrap'>
        <div>
          <div className='option-switch'>
            <button id = 'undoButton' onClick={undoLastLine}>Undo Last Line</button>
            <button id="modeSwitch" onClick={toggleDarkMode}>{darkMode ? 'Light Mode' : 'Dark Mode'}</button>
          </div>
          <h1 className="title">ColorTaiko!</h1>
        </div>
        <div>
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
        </div>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        minZoom={1}
        maxZoom={1}
        panOnScroll={false}
        panOnDrag={false}
        nodesDraggable={false}
      />
    </div>
  );
}