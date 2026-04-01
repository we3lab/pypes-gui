import * as z from 'zod';
import { Context } from "vm";


export const deleteNetworkInputZ = z.object({
    network_id: z.string(),
    finalized: z.boolean(),
  });

export const deleteNetworkOutputZ = z.object({
    data: z.any(),
    response_code: z.string(),
  });

type InputZ = z.infer<typeof deleteNetworkInputZ>;
type OutputZ = z.infer<typeof deleteNetworkOutputZ>;


export const deleteNetworkHandler = async (input: InputZ, ctx:Context): Promise<OutputZ> => {
  const token = ctx.session?.user?.token;
  if(input.network_id == ""){
    return {data: "Network ID is empty", response_code: "400"}
  }
  const url = `${process.env.BACKEND_API}/network/${input.network_id}/${input.finalized}/delete`
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to delete network');
  }
  const data = await res.json();
  return {data: data, response_code: res.status.toString()}
  }

export default deleteNetworkHandler;