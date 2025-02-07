import * as z from "zod";
import { Context } from "vm";

export const getAllNodesAndConnectionsInputZ = z.object({
  network_id: z.string(),
  
});

export const getAllNodesAndConnectionsOutputZ = z.object({
  data: z.any(),
  response_code: z.string(),
});

type GetAllNodesAndConnectionsInputZ = z.infer<
  typeof getAllNodesAndConnectionsInputZ
>;
type GetAllNodesAndConnectionsOutputZ = z.infer<
  typeof getAllNodesAndConnectionsOutputZ
>;

export const GetAllNodesAndConnectionsHandler = async (
  input: GetAllNodesAndConnectionsInputZ,
  ctx: Context
): Promise<GetAllNodesAndConnectionsOutputZ> => {
  const token = ctx.session?.user?.token;
  if (input.network_id == "" || input.network_id == undefined) {
    return { data: [], response_code: "400" };
  }
  const url = `${process.env.BACKEND_API}/network/${input.network_id}/node/all_nodes and_connections/get`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to get all nodes and connections from network.");
    }
    const data = await res.json();
    return { data: data, response_code: res.status.toString() };
  }catch (error) {
    console.error(error);
    return { data: [], response_code: "500" };
  }
};

export default GetAllNodesAndConnectionsHandler;
