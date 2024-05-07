import { useCallback, useState, useRef, useEffect } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, ConnectionMode, ConnectionLineType, MarkerType } from 'reactflow';
import CustomNode from './customNode';
import { invertColor, generateRandomColor } from './utils';
import 'reactflow/dist/style.css';
import './App.css';

const lineWidths = [1, 2, 3, 4, 5, 6];

const initItemStyle = {
  markerEnd: undefined,
  markerStart: undefined,
  animated: false
}

const initWarpStyle = {
  strokeDasharray: undefined
}

const nodeTypes = {
  custom: CustomNode,
};

const nodeDefault = {
  // sourcePosition: Position.Right,
  // targetPosition: Position.Left,
  style: {
    borderRadius: '100%',
    backgroundColor: 'rgb(227, 213, 194)',
    width: 27,
    height: 27,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'solid 3px #604d93',
  },
}
 
export default function App() {
  const MIN_VERTICES = 3;
  const MAX_VERTICES = 50;
  const idTop = useRef(0)
  const idBottom = useRef(100)
  // const [rfInstance, setRfInstance] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [topVertices, setTopVertices] = useState(3);
  const [bottomVertices, setBottomVertices] = useState(3);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [lineColor, setLineColor] = useState('#666')
  const [lineWidth, setLineWidth] = useState(4)
  const [lineStyle, setLineStyle] = useState('default')

  const lineStyles = useCallback(() => {
    return [
      {
        key: 'default',
        name: 'Default',
        lineComponent: undefined,
        itemStyle: initItemStyle, // add to edges
        wrapStyle: initWarpStyle // add to linestyles
      },
      {
        key: 'dashed',
        name: 'Dasthed',
        lineComponent: undefined,
        itemStyle: {},
        wrapStyle: {
          strokeDasharray: '5, 5'
        }
      },
      {
        key: 'dotDash',
        name: 'DotDash',
        lineComponent: undefined,
        itemStyle: {},
        wrapStyle: {
          strokeDasharray: '1, 5'
        }
      },
      {
        key: 'shortDash',
        name: 'ShortDash',
        lineComponent: undefined,
        itemStyle: {},
        wrapStyle: {
          strokeDasharray: '5, 5, 1, 5'
        }
      },
      {
        key: 'moveDash',
        name: 'MoveDash',
        lineComponent: undefined,
        itemStyle: {
          animated: true
        },
        wrapStyle: {}
      },
      {
        key: 'endArrow',
        name: 'EndArrow',
        lineComponent: undefined,
        itemStyle: {
          markerEnd: {
            type: MarkerType.Arrow,
            // color: lineColor,
          },
          animated: false
        },
        wrapStyle: {}
      },
      {
        key: 'endArrowClosed',
        name: 'EndArrowClosed',
        lineComponent: undefined,
        itemStyle: {
          markerEnd: {
            type: MarkerType.ArrowClosed,
            // color: lineColor,
          },
          animated: false
        },
        wrapStyle: {}
      },
      {
        key: 'bothArrow',
        name: 'BothArrow',
        lineComponent: undefined,
        itemStyle: {
          markerEnd: {
            type: MarkerType.Arrow,
            // color: lineColor,
          },
          markerStart: {
            type: MarkerType.Arrow,
            // color: lineColor,
          },
          animated: false
        },
        wrapStyle: {}
      },
      {
        key: 'bothArrowClosed',
        name: 'BothArrowClosed',
        lineComponent: undefined,
        itemStyle: {
          markerEnd: {
            type: MarkerType.ArrowClosed,
            // color: lineColor,
          },
          markerStart: {
            type: MarkerType.ArrowClosed,
            // color: lineColor,
          },
          animated: false
        },
        wrapStyle: {}
      },
      // {
      //   key: 'bothArrowClosed',
      //   name: 'BothArrowClosed',
      //   lineComponent: undefined,
      //   itemStyle: {},
      //   wrapStyle: {}
      // },
    ]
  }, []) 

  useEffect(() => {
    setNodes(() => []);
    idTop.current = 0;
    idBottom.current = 100;
    const width = window.innerWidth
    const height = window.innerHeight
    // top
    const topArr = new Array(topVertices).fill(idTop.current + 1)
    const topItemWidth = (width - 30) / (topVertices - 1)
    topArr.forEach((_, index) => {
      addItems({x: index * topItemWidth, y: 0})
    })
    // bottom
    const bottomItemWidth = (width - 30) / (bottomVertices - 1)
    new Array(bottomVertices).fill(idBottom.current + 1).forEach((_, index) => {
      addItems({x: index * bottomItemWidth, y: height * 3 / 5})
    })
  }, [topVertices, bottomVertices])

  useEffect(() => {
    // const filterEages = edges.filter((item) => !(item.target < 100 && item.source < 100))
    // topLine
    // const topArr = new Array(topVertices).fill('1').map((_, index) => index + 1)
    // const lineArr = topArr.map((item) => {
    //   if (item === topArr.length) return null
    //   return {
    //     id: `reactflow__edge-${item.toString()}b-${(item + 1).toString()}b`,
    //     source: item.toString(),
    //     sourceHandle: "b",
    //     style: {stroke: lineColor, strokeWidth: lineWidth},
    //     target:(item + 1).toString(),
    //     targetHandle: "b",
    //     type: "straight"
    //   }
    // }).filter((item => item))
    // const nds = [...filterEages, ...lineArr].map((item) => {
      const style = lineStyles().find((item) => item.key === lineStyle)
      const nds = edges.map((item) => {
      return {
        ...item,
        style: {
          stroke: item?.style?.stroke,
          strokeWidth: lineWidth,
          ...initWarpStyle,
          ...style.wrapStyle,
        },
        ...initItemStyle,
        ...{
          ...style.itemStyle,
          markerEnd: style.itemStyle.markerEnd ? {...style.itemStyle.markerEnd, color: item?.style?.stroke,} : undefined,
          markerStart: style.itemStyle.markerStart ? {...style.itemStyle.markerStart, color: item?.style?.stroke} : undefined,
        },
      }
    })
    // directly setEdges([...nds])，do not re-render lines with arrows
    if (lineStyle.includes('Arrow')) {
      setEdges([])
      setTimeout(() => {
        setEdges([...nds])
      });
    } else {
      setEdges([...nds])
    }
  }, [lineWidth, lineStyle])

  const addItems = (pos) => {
    let idNode;
    if (pos.y > 80) {
      idBottom.current = idBottom.current + 1;
      idNode = idBottom.current
    } else {
      idTop.current = idTop.current + 1;
      idNode = idTop.current
    }
    const newNode = {
      id: idNode.toString(),
      position: pos,
      data: { label: '' },
      type: 'custom',
      ...nodeDefault
    };
    setNodes((nds) => nds.concat(newNode));
  }
 
  const onConnect = useCallback(
    (params) => {
      let shNode = {};
      let thNode = {};
      nodes.forEach((item) => {
        if (item.id === params.source) {
          shNode = item
        }
        if (item.id === params.target) {
          thNode = item
        }
      })
      const style = lineStyles().find((item) => item.key === lineStyle)
      const { source, sourceHandle, target, targetHandle,...P } = params
      let sh = sourceHandle
      let th = targetHandle
      // const med = Math.abs(source - target);
      // confirm the postitions of connected vertices
      if (shNode.position.y === thNode.position.y) {
        if (shNode.position.x < thNode.position.x) {
          sh = 'b'
          th = 'd'
        } else {
          sh = 'd'
          th = 'b'
        }
      } else {
        if (shNode.position.y < thNode.position.y) {
          sh = 'c'
          th = 'a'
        } else {
          sh = 'a'
          th = 'c'
        }
      }
      return setEdges((eds) => addEdge({
        ...P,
        source,
        target,
        sourceHandle: sh,
        targetHandle: th,
        type: ConnectionLineType.Straight, 
        style: {stroke: lineColor, strokeWidth: lineWidth, ...initWarpStyle, ...style.wrapStyle},
        ...initItemStyle,
        ...style.itemStyle,
        markerEnd: style?.itemStyle?.markerEnd ? {...style?.itemStyle?.markerEnd, color: lineColor} : undefined,
        markerStart: style?.itemStyle?.markerStart ? {...style?.itemStyle?.markerStart, color: lineColor} : undefined,
      }, eds))
    },
    [setEdges, lineColor, lineWidth, lineStyle, nodes, lineStyles],
  );

  const undoLastLine = () => {
    setEdges(edges.slice(0, -1));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    const egs = edges.map(e => {
      return {
        ...e, 
        style: {...e.style, stroke: invertColor(e.style.stroke)},
        markerEnd: e.markerEnd ? {
          ...e.markerEnd,
          color: invertColor(e.markerEnd.color),
        } : undefined,
        markerStart: e.markerStart ? {
          ...e.markerStart,
          color: invertColor(e.markerStart.color),
        } : undefined,
      } 
    })
    setEdges([...egs])
  };
 
  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`} style={{ height: 'auto' }}>
      <div className='option-wrap'>
        <div className='option-title'>
          <div className='option-switch'>
            <button id = 'undoButton' onClick={undoLastLine}>Undo</button>
            <button id="modeSwitch" onClick={toggleDarkMode}>{darkMode ? 'Light Mode' : 'Dark Mode'}</button>
          </div>
          <h1 className="title">ColorTaiko</h1>
        </div>
        <div className='input-wrap'>
        <div>
            <div style={{height: '30px'}} className="input-container">
              <label style={{height: '30px', width: '70px', padding: '0px'}} htmlFor="top-vertices">Top Vertices:</label>
              <input
                style={{height: '30px', width: '50px'}}
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
              <button style={{height: '30px'}} onClick={() => setTopVertices(Math.min(topVertices + 1, MAX_VERTICES))}>+</button>
              <button style={{height: '30px'}} onClick={() => setTopVertices(Math.max(topVertices - 1, MIN_VERTICES))}>-</button>
            </div>
            <div className="input-container">
              <label style={{height: '80px', width: '70px', padding: '0px'}} htmlFor="bottom-vertices">Bottom Vertices:</label>
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
              <button style={{height: '30px'}} onClick={() => setBottomVertices(Math.min(bottomVertices + 1, MAX_VERTICES))}>+</button>
              <button style={{height: '30px'}} onClick={() => setBottomVertices(Math.max(bottomVertices - 1, MIN_VERTICES))}>-</button>
            </div>
          </div>
          <div>
            <div className="input-container">
                <label htmlFor="top-vertices">Line style:</label>
                <select defaultValue={lineStyle} onChange={(e) => {
                  setLineStyle(e.target.value)
                }}>
                  {
                    lineStyles().map((lineItem) => {
                      return <option key={lineItem.key} value={lineItem.key}>{lineItem.name}</option>
                    })
                  }
                </select>
              </div>
          </div>
          <div>
            <div className="input-container">
              <label htmlFor="top-vertices">Line width:</label>
              <select defaultValue={lineWidth} onChange={(e) => {
                setLineWidth(e.target.value)
              }}>
                {lineWidths.map(width => {
                  return <option key={width + 'width'} value={width}>{width}</option>
                })}
              </select>
            </div>
            <div className="input-container">
              <label htmlFor="top-vertices">Line color:</label>
              <input type='color' value={lineColor} onChange={(e) => {
                setLineColor(e.target.value)
              }} />
            </div>
          </div>
        </div>
      </div>
      <div className='svg-content'>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          // onInit={setRfInstance}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={() => {
            const initColor = generateRandomColor()
            setLineColor(initColor)
          }}
          autoPanOnConnect={false} // cannot move after connecting
          panOnDrag={false}
          nodesDraggable={false}
          nodesFocusable={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          connectionMode={ConnectionMode.Loose}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.Straight}
          onEdgeClick={(e, node) => {
            // change the lines you selected here
            console.log(e, node)
          }}
          connectionLineStyle={{
            stroke: lineColor,
            strokeWidth: lineWidth,
            ...(lineStyles().find((style) => style.key === lineStyle).wrapStyle)
            // strokeDasharray: '5, 5'
          }}
          // viewportInitialized={false}
        />
      </div>
    </div>
  );
}