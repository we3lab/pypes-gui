import * as z from "zod";
import { Context } from "vm";

export const getTagInfoInputZ = z.object({
  network_id: z.string(),
  tag_id: z.string(),
});

export const getTagInfoOutputZ = z.object({
  data: z.any(),
  response_code: z.string(),
});

type GetTagInfoInputZ = z.infer<
  typeof getTagInfoInputZ
>;
type GetTagInfoOutputZ = z.infer<
  typeof getTagInfoOutputZ
>;

export const getTagInfoHandler = async (
  input: GetTagInfoInputZ,
  ctx: Context
): Promise<GetTagInfoOutputZ> => {
  const token = ctx.session?.user?.token;
  if (input.network_id == "") {
    return { data: {}, response_code: "400" };
  }
  const url = `${process.env.BACKEND_API}/network/${input.network_id}/tag/get/${input.tag_id}`;
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

export default getTagInfoHandler;
