import * as z from 'zod';
import { Context } from "vm";


export const saveSCADASetupInputZ = z.object({
    setups: z.array(z.object({
        network_id: z.string(),
        facility_id: z.string(),
        data_source_id: z.string(),
    })),
  });

export const saveSCADASetupOutputZ = z.object({
    data: z.any(),
    response_code: z.string(),
  });

type InputZ = z.infer<typeof saveSCADASetupInputZ>;
type OutputZ = z.infer<typeof saveSCADASetupOutputZ>;


export const saveSCADASetupHandler = async (input: InputZ, ctx:Context): Promise<OutputZ> => {
  const token = ctx.session?.user?.token;
  const url = `${process.env.BACKEND_API}/save/scada_setup`
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input.setups),
  });

  if (!res.ok) {
    throw new Error('Failed to save Data Stream');
  }
  const data = await res.json();
  return {data: data, response_code: res.status.toString()}
  }

export default saveSCADASetupHandler;

