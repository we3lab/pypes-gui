import * as z from 'zod';
import { Context } from "vm";


export const optimizeNodeInputZ = z.object({
    network_id: z.string(),
    node_id: z.string(),
    optimization_parameters: z.any(),
    // design_parameters: z.union([z.any(), z.null()]),
  });

export const optimizeNodeOutputZ = z.object({
    data: z.any(),
    response_code: z.string(),
  });

type InputZ = z.infer<typeof optimizeNodeInputZ>;
type OutputZ = z.infer<typeof optimizeNodeOutputZ>;


export const optimizeNodeHandler = async (input: InputZ, ctx:Context): Promise<OutputZ> => {
  const token = ctx.session?.user?.token;

  console.log(JSON.stringify(input.optimization_parameters))
  if(input.network_id == "" || input.node_id == ""){
    console.log("one of the inputs is empty")
    return {data: {}, response_code: ""}
  } else {
    const res = await fetch(`${process.env.BACKEND_API}/network/${input.network_id}/node/${input.node_id}/optimize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
        body: JSON.stringify({optimization_parameters: input.optimization_parameters}),
    });
  
    if (!res.ok) {
      throw new Error('Error during optimization of node in backend');
    }
    const data = await res.json();
    console.log(data)
    return {data: data, response_code: res.status.toString()}
  }
  }

export default optimizeNodeHandler;