import * as z from 'zod';
import { Context } from "vm";

export const getTemplatesOutputZ = z.object({
    data: z.string(),
    response_code: z.string(),
  });

type OutputZ = z.infer<typeof getTemplatesOutputZ>;


export const getTemplatesHandler = async (ctx:Context): Promise<OutputZ> => {
  const token = ctx.session?.user?.token;
  const url = `${process.env.BACKEND_API}/network/list/templates`
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  });

  if (!res.ok) {
    throw new Error('Failed to get Templates');
  }
  const data = await res.json();
  return {data: JSON.stringify(data), response_code: res.status.toString()}
  }

export default getTemplatesHandler;