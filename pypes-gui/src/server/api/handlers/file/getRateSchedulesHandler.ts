import * as z from 'zod';
import { Context } from "vm";


export const getRateSchedulesInputZ = z.object({
  });

export const getRateSchedulesOutputZ = z.object({
    data: z.array(z.object({
      id: z.string(),
      name: z.string(),
      type: z.string(),
    })),
    response_code: z.string(),
});

type InputZ = z.infer<typeof getRateSchedulesInputZ>;
type OutputZ = z.infer<typeof getRateSchedulesOutputZ>;


export const getRateSchedulesHandler = async (input: InputZ, ctx:Context): Promise<OutputZ> => {
  const token = ctx.session?.user?.token;
  const url = `${process.env.BACKEND_API}/list/rate-schedules`
  
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });

    if (!res.ok) {
      throw new Error('Failed to get Rate Schedules');
    }
    const data = await res.json();
    return {data: data, response_code: res.status.toString()}
    };


export default getRateSchedulesHandler;