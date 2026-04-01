import * as z from 'zod';
import { Context } from "vm";

export const resetNetworkInputZ = z.object({
    network_id: z.string(),
    });

export const resetNetworkOutputZ = z.object({
    data: z.string(),
    response_code: z.string(),
  });

type InputZ = z.infer<typeof resetNetworkInputZ>;
type OutputZ = z.infer<typeof resetNetworkOutputZ>;


export const resetNetworkHandler = async (input: InputZ, ctx:Context): Promise<OutputZ> => {
  const token = ctx.session?.user?.token;
  const url = `${process.env.BACKEND_API}/network/${input.network_id}/reset`
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  });

  if (!res.ok) {
    throw new Error('Failed to reset network');
  }
  const data = await res.json();
  return {data: JSON.stringify(data), response_code: res.status.toString()}
  }

export default resetNetworkHandler;