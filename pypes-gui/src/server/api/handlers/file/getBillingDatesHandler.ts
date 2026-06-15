import * as z from 'zod';
import { Context } from "vm";


export const getBillingDatesInputZ = z.object({
    network_id: z.string(),
  });

export const getBillingDatesOutputZ = z.object({
    data: z.object({
        start_dt: z.any(),
        end_dt: z.any(),
    }),
    response_code: z.string(),
});

type InputZ = z.infer<typeof getBillingDatesInputZ>;
type OutputZ = z.infer<typeof getBillingDatesOutputZ>;


export const getBillingDatesHandler = async (input: InputZ, ctx:Context): Promise<OutputZ> => {
  const token = ctx.session?.user?.token;
  const url = `${process.env.BACKEND_API}/list/billing-dates/${input.network_id}`
  if(input.network_id == "") {
    return {data: {start_dt: "", end_dt:""}, response_code: "400"}
  } else {
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
    }};


export default getBillingDatesHandler;