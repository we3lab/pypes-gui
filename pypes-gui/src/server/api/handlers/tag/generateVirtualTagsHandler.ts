import * as z from "zod";
import { Context } from "vm";


export const generateVirtualTagInputZ = z.object({
  network_id: z.string(),
});

export const generateVirtualTagOutputZ = z.object({
  status: z.string(),
});

type InputZ = z.infer<typeof generateVirtualTagInputZ>;
type OutputZ = z.infer<typeof generateVirtualTagOutputZ>;

export const generateVirtualTagHandler = async (
  input: InputZ,
  ctx: Context
): Promise<OutputZ> => {
  const token = ctx.session?.user?.token;
  const url = `${process.env.BACKEND_API}/network/${input.network_id}/virtual-tag/generate`;

  const responseObject: OutputZ = {
    status: "failed",
  };

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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

export default generateVirtualTagHandler;

