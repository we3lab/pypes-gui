import * as z from 'zod';
import { Context } from "vm";


export const getNetworkInputZ = z.object({
    network_id: z.string(),
  });

export const getNetworkOutputZ = z.object({
    data: z.string(),
    response_code: z.string(),
  });

type InputZ = z.infer<typeof getNetworkInputZ>;
type OutputZ = z.infer<typeof getNetworkOutputZ>;


export const getNetworkHandler = async (input: InputZ, ctx:Context): Promise<OutputZ> => {
  const token = ctx.session?.user?.token;
  if(input.network_id == ""){
    console.log("Network ID is empty")
    return {data: "", response_code: ""}
  } else {
    const res = await fetch(`${process.env.BACKEND_API}/network/${input.network_id}/get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      throw new Error('Network could not be retrieved from backend');
    }
    const data = await res.json();
  
    return {data: JSON.stringify(data), response_code: res.status.toString()}
  }
  }

export default getNetworkHandler;