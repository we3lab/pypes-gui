import { ComponentType, useCallback } from 'react';
import { useStore, getStraightPath, EdgeProps, getBezierPath, BaseEdge, EdgeLabelRenderer } from 'reactflow';
import { getEdgeParams } from './utils';
import useMainStore from "@/store/store";
import ConnectionCreationModal from '../connection-creation-modal/connection-creation-modal';
import ConnectionDeatails from '../connection-details/connection-details';

const FloatingEdge: ComponentType<EdgeProps> = ({ id, source, target, markerEnd, style }) => {
  const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
  const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

  const { setSelectedEdge, setSelectedNode, openEdgeDetailsModal, setSelectedEdgeId,selectedEdgeId } = useMainStore();

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  return (
    <>
    <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all',
            backgroundColor: '#ffd',
            outline: '2px solid #000',
          }}
          className="nodrag nopan p-2 rounded-md shadow-md hover:cursor-pointer"
          onClick={async (event) => {
            await setSelectedEdgeId(id);
            openEdgeDetailsModal();
            
          }}
        >
          <button className="edgebutton bg-red text-black font-black">
            ~
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default FloatingEdge;
