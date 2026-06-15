import * as z from 'zod';
import { Context } from "vm";


export const getAllTagsFromConnInputZ = z.object({
    network_id: z.string(),
    connection_id: z.string(),
  });

export const getAllTagsFromConnOutputZ = z.object({
    data: z.string(),
    response_code: z.string(),
  });

type InputZ = z.infer<typeof getAllTagsFromConnInputZ>;
type OutputZ = z.infer<typeof getAllTagsFromConnOutputZ>;


export const getAllTagsFromConnHandler = async (input: InputZ, ctx:Context): Promise<OutputZ> => {
  const token = ctx.session?.user?.token;
  if(input.connection_id == "" || input.network_id == ""){
    return {data: "", response_code: "400"}
  }
  const url = `${process.env.BACKEND_API}/network/${input.network_id}/${input.connection_id}/tag/get-all`
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  });

  if (!res.ok) {
    throw new Error('Failed to get Tags from connection');
  }
  const data = await res.json();
  return {data: JSON.stringify(data), response_code: res.status.toString()}
  }

export default getAllTagsFromConnHandler;