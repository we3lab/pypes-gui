import * as z from 'zod';
import { Context } from "vm";


export const getAllTagsFromNodeInputZ = z.object({
    network_id: z.string(),
    node_id: z.string(),
  });

export const getAllTagsFromNodeOutputZ = z.object({
    data: z.string(),
    response_code: z.string(),
  });

type InputZ = z.infer<typeof getAllTagsFromNodeInputZ>;
type OutputZ = z.infer<typeof getAllTagsFromNodeOutputZ>;


export const getAllTagsFromNodeHandler = async (input: InputZ, ctx:Context): Promise<OutputZ> => {
  const token = ctx.session?.user?.token;
  const url = `${process.env.BACKEND_API}/network/${input.network_id}/${input.node_id}/tag/get-all`
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  });

  if (!res.ok) {
    throw new Error('Failed to get Tags');
  }
  const data = await res.json();
  return {data: JSON.stringify(data), response_code: res.status.toString()}
  }

export default getAllTagsFromNodeHandler;