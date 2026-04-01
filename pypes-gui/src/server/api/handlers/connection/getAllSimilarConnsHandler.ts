import * as z from "zod";
import { Context } from "vm";

export const getAllSimilarInputZ = z.object({
  network_id: z.string(),
});

export const getAllSimilarOutputZ = z.object({
  data: z.any(),
  response_code: z.string(),
});

type GetAllSimilarInputZ = z.infer<
  typeof getAllSimilarInputZ
>;
type GetAllSimilarOutputZ = z.infer<
  typeof getAllSimilarOutputZ
>;

export const getAllSimilarConnHandler = async (
  input: GetAllSimilarInputZ,
  ctx: Context
): Promise<GetAllSimilarOutputZ> => {
  const token = ctx.session?.user?.token;
  if (input.network_id == "") {
    return { data: [], response_code: "400" };
  }
  const url = `${process.env.BACKEND_API}/network/${input.network_id}/connection/get_all_similar`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to get all similar connections.");
  }
  const data = await res.json();
  return { data: data, response_code: res.status.toString() };
};

export default getAllSimilarConnHandler;
