import * as z from 'zod';
import { Context } from "vm";


export const saveDataStreamInputZ = z.object({
    data_type: z.string(),
    metadata: z.object({
        client_id:z.string(),
        client_secret:z.string(),
        refresh_token:z.string(),
        allowed_senders:z.array(z.string()),
        data_stream_name:z.string(),
        }),
  });

export const saveDataStreamOutputZ = z.object({
    data: z.any(),
    response_code: z.string(),
  });

type InputZ = z.infer<typeof saveDataStreamInputZ>;
type OutputZ = z.infer<typeof saveDataStreamOutputZ>;


export const saveDataStreamHandler = async (input: InputZ, ctx:Context): Promise<OutputZ> => {
  const token = ctx.session?.user?.token;
  const url = `${process.env.BACKEND_API}/save/stream`
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error('Failed to save Data Stream');
  }
  const data = await res.json();
  return {data: data, response_code: res.status.toString()}
  }

export default saveDataStreamHandler;

