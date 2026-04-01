import * as z from 'zod';
import { Context } from "vm";


export const restoreNetworkInputZ = z.object({
    network_id: z.string(),
    file_id: z.string(),
  });

export const restoreNetworkOutputZ = z.object({
    data: z.any(),
    response_code: z.string(),
  });

type InputZ = z.infer<typeof restoreNetworkInputZ>;
type OutputZ = z.infer<typeof restoreNetworkOutputZ>;


export const restoreNetworkHandler = async (input: InputZ, ctx:Context): Promise<OutputZ> => {
  const token = ctx.session?.user?.token;
  if(input.network_id == ""){
    return {data: "Network ID is empty", response_code: "400"}
  }
  const url = `${process.env.BACKEND_API}/network/${input.network_id}/${input.file_id}/restore-checkpoint`
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to restore network');
  }
  const data = await res.json();
  return {data: data, response_code: res.status.toString()}
  }

export default restoreNetworkHandler;

