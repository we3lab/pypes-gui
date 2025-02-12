import * as z from "zod";
import { Context } from "vm";

export const getFileLinkInputZ = z.object({
  file_id: z.string(),
  file_name: z.string(),
});

export const getFileLinkOutputZ = z.object({
  data: z.any(),
  response_code: z.string(),
});

type GetFileLinkInputZ = z.infer<
  typeof getFileLinkInputZ
>;
type GetFileLinkOutputZ = z.infer<
  typeof getFileLinkOutputZ
>;

export const getFileLinkHandler = async (
  input: GetFileLinkInputZ,
  ctx: Context
): Promise<GetFileLinkOutputZ> => {
  const token = ctx.session?.user?.token;
  if (input.file_id == "") {
    return { data: {}, response_code: "400" };
  }
  const url = `${process.env.BACKEND_API}/generate_presigned_url/${input.file_id}/${input.file_name}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to get file link.");
  }
  const data = await res.json();
  return { data: data, response_code: res.status.toString() };
};

export default getFileLinkHandler;
