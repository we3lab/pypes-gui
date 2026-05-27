import { Context } from "vm";
import * as z from "zod";
import ELK, { ElkNode } from "elkjs/lib/elk.bundled.js";

export const uploadNetworksInputZ = z.object({
  network_file: z.record(z.string(), z.unknown()),
  network_name: z.string(),
});

export const uploadNetworksOutputZ = z.object({
  is_success: z.boolean(),
  network_id: z.string(),
});

type uploadNetworksInputZ = z.infer<typeof uploadNetworksInputZ>;
type uploadNetworksOutputZ = z.infer<typeof uploadNetworksOutputZ>;

const nodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.record(z.string(), z.any()),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
});

const edgeSchema = z.object({
  id: z.string(),
  type: z.string(),
  source: z.string(),
  target: z.string(),
});

const networkSchema = z.object({
  initialNodes: z.array(nodeSchema),
  initialEdges: z.array(edgeSchema),
});

const allNetworksSchema = z.record(z.string(), networkSchema);

type allNetworksSchema = z.infer<typeof allNetworksSchema>;
type nodeSchema = z.infer<typeof nodeSchema>;
type edgeSchema = z.infer<typeof edgeSchema>;

const getLayoutedElementsElk = async (
  nodes: nodeSchema[],
  edges: edgeSchema[]
) => {
  const nodeSize = { width: 150, height: 50 };
  // https://eclipse.dev/elk/reference.html --> options
  const elkOptions = {
    "elk.algorithm": "mrtree",
    "elk.layered.spacing.nodeNodeBetweenLayers": "150",
    "elk.spacing.nodeNode": "220",
    "elk.direction": "RIGHT",
    "elk.padding": "50",
  };

  const elk = new ELK();
  const elkNodes = nodes.map((node) => ({
    ...nodeSize,
    ...node,
    x: node.position.x,
    y: node.position.y,
  }));
  const elkEdges = edges.map((edge) => ({
    sources: [edge.source],
    targets: [edge.target],
    ...edge,
  }));
  const elkGraph = {
    id: "root",
    layoutOptions: elkOptions,
    children: elkNodes,
    edges: elkEdges,
  };

  const layoutedGraph = await elk.layout(elkGraph);
  if (!layoutedGraph.children)
    throw new Error("layoutedGraph.children is undefined");

  return {
    nodes: layoutedGraph.children.map((node) => ({
      ...node,
      position: { x: node.x, y: node.y },
    })),
    edges: layoutedGraph.edges,
  };
};

const uploadNetworkHandler = async (
  input: uploadNetworksInputZ,
  ctx: Context
): Promise<uploadNetworksOutputZ> => {
  const validation_url = `${process.env.BACKEND_API}/network/validate`;
  const upload_url = `${process.env.BACKEND_API}/network/upload`;
  const token = ctx.session?.user?.token;
  const responseObject: uploadNetworksOutputZ = {
    is_success: false,
    network_id: "",
  };

  try {
    const validateResponse = await fetch(validation_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input.network_file),
    });

    if (!validateResponse.ok) {
      throw new Error("Network response was not ok");
    }

    const responseData = await validateResponse.json();
    const rawPositionData = allNetworksSchema.parse(responseData);

    const finalPositionData: Record<string, ElkNode[]> = {};

    for (const [key, value] of Object.entries(rawPositionData)) {
      const { nodes: layoutedNodes } = await getLayoutedElementsElk(
        value.initialNodes,
        value.initialEdges
      );
      finalPositionData[key] = layoutedNodes;
    }

    const uploadResponse = await fetch(upload_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        position_data: finalPositionData,
        network: input.network_file,
        network_name: input.network_name,
      }),
    });
    const parsedResponse = await uploadResponse.json();
    responseObject.network_id = parsedResponse.network_id;
    responseObject.is_success = uploadResponse.ok;
  } catch (e) {
    console.log("Error: ", e);
    responseObject.is_success = false;
  }

  return responseObject;
};

export default uploadNetworkHandler;
