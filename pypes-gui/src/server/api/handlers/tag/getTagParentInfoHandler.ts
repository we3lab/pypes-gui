import * as z from "zod";
import { Context } from "vm";

export const getTagParentInfoInputZ = z.object({
  network_id: z.string(),
  resource_id: z.string(),
});

export const getTagParentInfoOutputZ = z.object({
  data: z.any(),
  response_code: z.string(),
});

type GetTagParentInfoInputZ = z.infer<
  typeof getTagParentInfoInputZ
>;
type GetTagParentInfoOutputZ = z.infer<
  typeof getTagParentInfoOutputZ
>;

export const getTagParentInfoHandler = async (
  input: GetTagParentInfoInputZ,
  ctx: Context
): Promise<GetTagParentInfoOutputZ> => {
  const token = ctx.session?.user?.token;
  if (input.network_id == "") {
    return { data: {}, response_code: "400" };
  }
  const url = `${process.env.BACKEND_API}/network/${input.network_id}/tag/get_parent_info/${input.resource_id}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to get info from tag.");
  }
  const data = await res.json();
  return { data: data, response_code: res.status.toString() };
};

export default getTagParentInfoHandler;
