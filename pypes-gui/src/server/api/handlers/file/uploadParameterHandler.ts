import { Context } from "vm";
import * as z from "zod";

export const uploadParamsInputZ = z.object({
  network_id: z.string(),
  param_data: z.any(),
});

export const uploadParamsOutputZ = z.object({
  status: z.string(),
});

type uploadParamsInputZ = z.infer<typeof uploadParamsInputZ>;
type uploadParamsOutputZ = z.infer<typeof uploadParamsOutputZ>;

export const uploadParamHandler = async (
  input: uploadParamsInputZ,
  ctx: Context
): Promise<uploadParamsOutputZ> => {
  const token = ctx.session?.user?.token;
  const url = `${process.env.BACKEND_API}/parameters/${input.network_id}/upload`;

  const responseObject: uploadParamsOutputZ = {
    status: "failed",
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input.param_data),
    });
    if (!res.ok) {
      throw new Error();
    }

    const data = await res.json();
    responseObject.status = data.status;
  } catch {
    console.log(
      `Failed to generate virtual tags for network: ${input.network_id}`
    );
  }

  return responseObject;
};

export default uploadParamHandler;
