import { Handle, Position } from 'reactflow';
import './customNode.css';

// const connectionNodeIdSelector = (state) => state.connectionNodeId;

export default function CustomNode() {
  // const connectionNodeId = useStore(connectionNodeIdSelector);

  // const isConnecting = !!connectionNodeId;

  return (
    <div className="customNode">
      <div
        className="customNodeBody"
        // style={{
        //   borderStyle: isTarget ? 'dashed' : 'solid',
        //   backgroundColor: isTarget ? '#ffcce3' : '#ccd9f6',
        // }}
      >
        {/* If handles are conditionally rendered and not present initially, you need to update the node internals https://reactflow.dev/docs/api/hooks/use-update-node-internals/ */}
        {/* In this case we don't need to use useUpdateNodeInternals, since !isConnecting is true at the beginning and all handles are rendered initially. */}
        {/* {!isConnecting && (
          <Handle className="customHandle" position={Position.Right} type="source" />
        )} */}
        <Handle
          className="customHandle"
          position={Position.Top}
          type="source"
          id='a'
          // isConnectableStart={false}
        />
        <Handle
          className="customHandle"
          position={Position.Right}
          type="source"
          id='b'
          // isConnectableStart={false}
        />
        
        <Handle
          className="customHandle"
          position={Position.Bottom}
          type="source"
          id='c'
          // isConnectableStart={false}
        />
        <Handle
          className="customHandle"
          position={Position.Left}
          type="source"
          id='d'
          // isConnectableStart={false}
        />
      </div>
    </div>
  );
}