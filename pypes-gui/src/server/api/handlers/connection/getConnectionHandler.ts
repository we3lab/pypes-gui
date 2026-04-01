import * as z from 'zod';
import { Context } from "vm";


export const getConnInputZ = z.object({
    network_id: z.string(),
    connection_id: z.string(),
  });

export const getConnOutputZ = z.object({
    data: z.string(),
    response_code: z.string(),
  });

type InputZ = z.infer<typeof getConnInputZ>;
type OutputZ = z.infer<typeof getConnOutputZ>;


export const getConnHandler = async (input: InputZ, ctx:Context): Promise<OutputZ> => {
  const token = ctx.session?.user?.token;
  if(input.connection_id==="" || input.network_id===""){
    return {data: "", response_code: ""}
  }
    const res = await fetch(`${process.env.BACKEND_API}/network/${input.network_id}/connection/get/${input.connection_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      throw new Error('Connection could not be retrieved from backend');
    }
    const data = await res.json();
  
    return {data: JSON.stringify(data), response_code: res.status.toString()}
  }

export default getConnHandler;