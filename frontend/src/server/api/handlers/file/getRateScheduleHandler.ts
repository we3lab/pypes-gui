import * as z from 'zod';
import { Context } from "vm";


export const getRateScheduleInputZ = z.object({
    file_id: z.string(),
  });

export const getRateScheduleOutputZ = z.object({
    data: z.any(),
    response_code: z.string(),
  });

type InputZ = z.infer<typeof getRateScheduleInputZ>;
type OutputZ = z.infer<typeof getRateScheduleOutputZ>;


export const getRateScheduleHandler = async (input: InputZ, ctx:Context): Promise<OutputZ> => {
  const token = ctx.session?.user?.token;
  if(input.file_id == "" ){
    return {data: "", response_code: "400"}
  }
  const url = `${process.env.BACKEND_API}/get/rate-schedule/${input.file_id}`
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to get rate schedule');
  }
  const data = await res.json();
  return {data: data, response_code: res.status.toString()}
  }

export default getRateScheduleHandler;

