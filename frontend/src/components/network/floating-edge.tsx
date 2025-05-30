import React, { ComponentType, useCallback } from 'react';
import { useStore, getBezierPath, EdgeProps } from 'reactflow';
import ConnectionDeatails from '../connection-details/connection-details';

const FloatingEdge: ComponentType<EdgeProps> = ({ id, source, target, markerEnd, style }) => {
  const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
  const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

  if (!sourceNode || !targetNode) {
    return null;
  }

  const [edgePath] = getBezierPath({
    sourceX: sourceNode.position.x + (sourceNode.width || 0) / 2,
    sourceY: sourceNode.position.y + (sourceNode.height || 0) / 2,
    sourcePosition: sourceNode.sourcePosition,
    targetX: targetNode.position.x + (targetNode.width || 0) / 2,
    targetY: targetNode.position.y + (targetNode.height || 0) / 2,
    targetPosition: targetNode.targetPosition,
  });

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd?.type ? `url(#${markerEnd.type})` : undefined}
      />
      {/* Add any additional edge elements, like labels or buttons */}
      <ConnectionDeatails edgeId={id} />
    </>
  );
};

export default FloatingEdge;