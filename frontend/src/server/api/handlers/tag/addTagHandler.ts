import * as z from 'zod';
import { Context } from "vm";


export const addTagInputZ = z.object({
    network_id: z.string(),
    resource_id: z.string(),
    tag_data: z.object({
        id: z.string(),
        units: z.string(),
        type: z.string(),
        source_unit_id: z.union([z.string(), z.null(), z.number()]),
        dest_unit_id: z.union([z.string(), z.null(), z.number()]),
        totalized: z.boolean(),
        contents: z.string(),
    }),
  });

export const addTagOutputZ = z.object({
    data: z.string(),
    response_code: z.string(),
  });

type InputZ = z.infer<typeof addTagInputZ>;
type OutputZ = z.infer<typeof addTagOutputZ>;


export const addTagHandler = async (input: InputZ, ctx:Context): Promise<OutputZ> => {
  const token = ctx.session?.user?.token;
  console.log("input", input);
  const url = `${process.env.BACKEND_API}/network/${input.network_id}/tag/add/${input.resource_id}`
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input.tag_data),
  });

  if (!res.ok) {
    throw new Error('Failed to add Tag');
  }
  const data = await res.json();
  return {data: JSON.stringify(data), response_code: res.status.toString()}
  }

export default addTagHandler;