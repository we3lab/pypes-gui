import * as z from 'zod';
import { Context } from "vm";


export const removeDataStreamInputZ = z.object({
    stream_id: z.string(),
});

export const removeDataStreamOutputZ = z.object({
    data: z.any(),
    response_code: z.string(),
  });

type InputZ = z.infer<typeof removeDataStreamInputZ>;
type OutputZ = z.infer<typeof removeDataStreamOutputZ>;


export const removeDataStreamHandler = async (input: InputZ, ctx:Context): Promise<OutputZ> => {
  const token = ctx.session?.user?.token;
  const url = `${process.env.BACKEND_API}/delete/stream/${input.stream_id}`
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to delete Stream');
  }
  const data = await res.json();
  return {data: data, response_code: res.status.toString()}
  }

export default removeDataStreamHandler;

