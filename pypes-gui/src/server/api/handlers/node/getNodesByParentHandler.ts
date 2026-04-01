import * as z from 'zod';
import { Context } from "vm";


export const getNodesByParentInputZ = z.object({
    network_id: z.string(),
    parent_id: z.string(),
  });

export const getNodesByParentOutputZ = z.object({
    data: z.string(),
    response_code: z.string(),
  });

type InputZ = z.infer<typeof getNodesByParentInputZ>;
type OutputZ = z.infer<typeof getNodesByParentOutputZ>;


export const getNodesByParentHandler = async (input: InputZ, ctx:Context): Promise<OutputZ> => {
  const token = ctx.session?.user?.token;
  if(input.parent_id === "world"){
    input.parent_id = "ParentNetwork"
  }
  if(input.network_id == ""){
    console.log("one of the inputs is empty")
    return {data: "", response_code: ""}
  } else {
    const res = await fetch(`${process.env.BACKEND_API}/network/${input.network_id}/node/parent/${input.parent_id}/get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      throw new Error('Nodes could not be retrieved from backend');
    }
    const data = await res.json();
    return {data: JSON.stringify(data), response_code: res.status.toString()}
  }
  }

export default getNodesByParentHandler;