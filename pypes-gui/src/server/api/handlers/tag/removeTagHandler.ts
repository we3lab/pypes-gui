import * as z from 'zod';
import { Context } from "vm";


export const removeTagInputZ = z.object({
    network_id: z.string(),
    resource_id: z.string(),
    tag_id: z.string(),
  });

export const removeTagOutputZ = z.object({
    data: z.string(),
    response_code: z.string(),
  });

type InputZ = z.infer<typeof removeTagInputZ>;
type OutputZ = z.infer<typeof removeTagOutputZ>;


export const removeTagHandler = async (input: InputZ, ctx:Context): Promise<OutputZ> => {
  const token = ctx.session?.user?.token;
  const url = `${process.env.BACKEND_API}/network/${input.network_id}/tag/remove/${input.resource_id}/${input.tag_id}`
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  });

  if (!res.ok) {
    throw new Error('Faile to remove Tag');
  }
  const data = await res.json();
  return {data: JSON.stringify(data), response_code: res.status.toString()}
  }

export default removeTagHandler;