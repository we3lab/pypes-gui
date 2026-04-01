import * as z from 'zod';
import { Context } from "vm";


export const getAllStreamsInputZ = z.object({});

export const getAllStreamsOutputZ = z.object({
    data: z.any(),
    response_code: z.string(),
  });

type InputZ = z.infer<typeof getAllStreamsInputZ>;
type OutputZ = z.infer<typeof getAllStreamsOutputZ>;


export const getAllStreamsHandler = async (input: InputZ, ctx:Context): Promise<OutputZ> => {
  const token = ctx.session?.user?.token;
  const url = `${process.env.BACKEND_API}/get/all/stream`
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to get all Streams');
  }
  const data = await res.json();
  return {data: data, response_code: res.status.toString()}
  }

export default getAllStreamsHandler;

