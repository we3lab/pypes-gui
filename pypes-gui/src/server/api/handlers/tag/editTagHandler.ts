import * as z from "zod";
import { Context } from "vm";

export const editTagInputZ = z.object({
  network_id: z.string(),
  resource_id: z.string(),
  data: z.any(),

});

export const editTagOutputZ = z.object({
  data: z.any(),
  response_code: z.string(),
});

type EditTagInputZ = z.infer<
  typeof editTagInputZ
>;
type EditTagOutputZ = z.infer<
  typeof editTagOutputZ
>;

export const editTagHandler = async (
  input: EditTagInputZ,
  ctx: Context
): Promise<EditTagOutputZ> => {
  const token = ctx.session?.user?.token;
  if (input.network_id == "") {
    return { data: {}, response_code: "400" };
  }
  const url = `${process.env.BACKEND_API}/network/${input.network_id}/tag/edit/${input.resource_id}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input.data),

  });

  // if (!res.ok) {
  //   throw new Error("Failed to update tag.");
  // }
  const data = await res.json();
  return { data: data, response_code: res.status.toString() };
};

export default editTagHandler;
