import * as z from 'zod';
import { Context } from "vm";


export const saveCheckpointInputZ = z.object({
    network_id: z.string(),
  });

export const saveCheckpointOutputZ = z.object({
    data: z.any(),
    response_code: z.string(),
  });

type InputZ = z.infer<typeof saveCheckpointInputZ>;
type OutputZ = z.infer<typeof saveCheckpointOutputZ>;


export const saveCheckpointHandler = async (input: InputZ, ctx:Context): Promise<OutputZ> => {
  const token = ctx.session?.user?.token;
  if(input.network_id == ""){
    return {data: "Network ID is empty", response_code: "400"}
  }
  const url = `${process.env.BACKEND_API}/network/${input.network_id}/save-checkpoint`
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to save checkpoint');
  }
  const data = await res.json();
  return {data: data, response_code: res.status.toString()}
  }

export default saveCheckpointHandler;

