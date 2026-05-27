import * as z from "zod";
import { Context } from "vm";

const VirtualTag = z.object({
  tags: z.array(z.string()).optional(),
  type: z.string().optional(),
  units: z.string().optional(),
  contents: z.string().optional(),
  parent_id: z.string().optional(),
  operations: z.string().optional(),
});

const VirtualTags = z.record(z.string(), VirtualTag);

export const updateVirtualTagInputZ = z.object({
  network_id: z.string(),
  virtual_tag_data: z.record(z.string(), VirtualTags),
});

export const updateVirtualTagOutputZ = z.object({
  status: z.string(),
});

type InputZ = z.infer<typeof updateVirtualTagInputZ>;
type OutputZ = z.infer<typeof updateVirtualTagOutputZ>;

export const updateVirtualTagHandler = async (
  input: InputZ,
  ctx: Context
): Promise<OutputZ> => {
  const token = ctx.session?.user?.token;
  const url = `${process.env.BACKEND_API}/network/${input.network_id}/virtual-tag/update`;

  const responseObject: OutputZ = {
    status: "failed",
  };

  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input.virtual_tag_data),
    });
    if (!res.ok) {
      throw new Error();
    }

    const data = await res.json();
    responseObject.status = data.status;
  } catch {
    console.log(
      `Failed to update virtual tags for network: ${input.network_id} and data: ${input.virtual_tag_data}`
    );
  }

  return responseObject;
};

export default updateVirtualTagHandler;
