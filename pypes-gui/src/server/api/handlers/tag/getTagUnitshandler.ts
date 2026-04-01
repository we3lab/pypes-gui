import * as z from 'zod';
import { Context } from "vm";


export const getTagUnitsInputZ = z.object({
    network_id: z.string(),
    node_id: z.string(),
  });

export const getTagUnitsOutputZ = z.object({
    data: z.any(),
    response_code: z.string(),
  });

type InputZ = z.infer<typeof getTagUnitsInputZ>;
type OutputZ = z.infer<typeof getTagUnitsOutputZ>;


export const getTagUnitsHandler = async (input: InputZ, ctx:Context): Promise<OutputZ> => {
  const token = ctx.session?.user?.token;
  if(input.network_id == "" || input.node_id == ""){
    return {data: "", response_code: "400"}
  }
  console.log("input", input)
  const url = `${process.env.BACKEND_API}/network/${input.network_id}/${input.node_id}/get_tag_units`
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to get tag units');
  }
  const data = await res.json();
  return {data: data, response_code: res.status.toString()}
  }

export default getTagUnitsHandler;

