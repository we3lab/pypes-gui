import FlowsNode from "./common";

interface CustomNodeProps {
  id: string;
}

const FacilityNode: React.FC<CustomNodeProps> = ({ id }) => {
  return <FlowsNode nodeName={id} id={id} nodeIcon="/Facility.svg" />;
};

export default FacilityNode;


// import useStore from '@/store/store';
// import Image from 'next/image';
// import * as ReactFlow from 'reactflow';

// const connectionNodeIdSelector = (state: { connectionNodeId: any; }) => state.connectionNodeId;

// interface CustomNodeProps {
//   id: string;
// } 

// const sourceStyle = { zIndex: 1 };

// const FacilityNode: React.FC<CustomNodeProps> = ({ id }) => {
//   const connectionNodeId = ReactFlow.useStore(connectionNodeIdSelector);

//   const { activePage, openNodeOptimizeModal, openNodeDetailsModal, setSelectedNodeId, selectedNodeId } = useStore();

//   const isConnecting = !!connectionNodeId;
//   const isTarget = connectionNodeId && connectionNodeId !== id;

//   return (
//     <div className={`customNode ${id === selectedNodeId ? 'selected' : ''}`}>
//       <span className='text-2xl font-bold'>
//         {id}
//       </span>
//       <div
//         className="customNodeBody bg-stone-300"
//         style={{
//           borderStyle: isTarget ? 'dashed' : 'solid',
//           //backgroundColor: '#ffd',
//         }}
//       >
//         {/* If handles are conditionally rendered and not present initially, you need to update the node internals https://reactflow.dev/docs/api/hooks/use-update-node-internals/ */}
//         {/* In this case we don't need to use useUpdateNodeInternals, since !isConnecting is true at the beginning and all handles are rendered initially. */}
//         {!isConnecting && (
//           <ReactFlow.Handle className="customHandle" position={ReactFlow.Position.Right} type="source" style={sourceStyle} />
//         )}
//         <ReactFlow.Handle
//           className="customHandle"
//           position={ReactFlow.Position.Left}
//           type="target"
//           isConnectableStart={false}
//         />
//        <div onClick={() => {
//           // setSelectedNode(id);
//           console.log("ID",id);
//           setSelectedNodeId(id);
//           if(activePage == "1"){
//             openNodeDetailsModal();
//           } else if(activePage == "4"){
//             openNodeOptimizeModal();
//           }
//         }} className='absolute top-1 left-1 text-2xl text-center cursor-pointer hover:transform hover:scale-110' style={{ zIndex: 2 }}>
//           <Image src="/view.png" alt="view" width={32} height={32} />
//         </div>
//        <Image src="/Facility.svg" alt="facility" width={100} height={100} />
//       </div>
//     </div>
//   );
// }

// export default FacilityNode;
