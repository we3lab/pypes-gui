import * as z from 'zod';
import { Context } from "vm";


export const updatePositionInputZ = z.object({
    network_id: z.string(),
    node_id: z.string(),
    position: z.object({
        x: z.number(),
        y: z.number(),
    }),
  });

export const updatePositionOutputZ = z.object({
    data: z.string(),
    response_code: z.string(),
  });

type InputZ = z.infer<typeof updatePositionInputZ>;
type OutputZ = z.infer<typeof updatePositionOutputZ>;


export const updatePositionHandler = async (input: InputZ, ctx:Context): Promise<OutputZ> => {
  const token = ctx.session?.user?.token;
    const res = await fetch(`${process.env.BACKEND_API}/network/${input.network_id}/node/${input.node_id}/position`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input.position),
    });
  
    if (!res.ok) {
      throw new Error('Update position failed');
    }
    const data = await res.json();
  
    return {data: JSON.stringify(data), response_code: res.status.toString()}
  }

export default updatePositionHandler;