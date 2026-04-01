import * as z from "zod";
import { Context } from "vm";

export const getAllNetworkTagsInputZ = z.object({
  network_id: z.string(),
  
});

export const getAllNetworkTagsOutputZ = z.object({
  data: z.any(),
  response_code: z.string(),
});

type GetAllNetworkTagsInputZ = z.infer<
  typeof getAllNetworkTagsInputZ
>;
type GetAllNetworkTagsOutputZ = z.infer<
  typeof getAllNetworkTagsOutputZ
>;

export const getAllNetworkTagsHandler = async (
  input: GetAllNetworkTagsInputZ,
  ctx: Context
): Promise<GetAllNetworkTagsOutputZ> => {
  const token = ctx.session?.user?.token;
  if (input.network_id == "") {
    return { data: {}, response_code: "400" };
  }
  const url = `${process.env.BACKEND_API}/network/${input.network_id}/get_all_tags`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to get all tags from network.");
  }
  const data = await res.json();
  return { data: data, response_code: res.status.toString() };
};

export default getAllNetworkTagsHandler;
