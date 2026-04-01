import * as z from "zod";
import { Context } from "vm";

export const getSimilarInputZ = z.object({
  network_id: z.string(),
  connection_id: z.string(),
});

export const getSimilarOutputZ = z.object({
  data: z.any(),
  response_code: z.string(),
});

type GetSimilarInputZ = z.infer<
  typeof getSimilarInputZ
>;
type GetSimilarOutputZ = z.infer<
  typeof getSimilarOutputZ
>;

export const getSimilarConnHandler = async (
  input: GetSimilarInputZ,
  ctx: Context
): Promise<GetSimilarOutputZ> => {
  const token = ctx.session?.user?.token;
  if (input.network_id == "") {
    return { data: {}, response_code: "400" };
  }
  const url = `${process.env.BACKEND_API}/network/${input.network_id}/connection/${input.connection_id}/get_similar`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to get similar connections.");
  }
  const data = await res.json();
  return { data: data, response_code: res.status.toString() };
};

export default getSimilarConnHandler;
