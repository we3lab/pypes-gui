import * as z from "zod";
import { Context } from "vm";

export const getSCADATemplateHeadersInputZ = z.object({
  network_id: z.string(),
});

export const getSCADATemplateHeadersOutputZ = z.object({
  data: z.any(),
  response_code: z.string(),
});

type GetSCADATemplateHeadersInputZ = z.infer<
  typeof getSCADATemplateHeadersInputZ
>;
type GetSCADATemplateHeadersOutputZ = z.infer<
  typeof getSCADATemplateHeadersOutputZ
>;

export const getSCADATemplateHeadersHandler = async (
  input: GetSCADATemplateHeadersInputZ,
  ctx: Context
): Promise<GetSCADATemplateHeadersOutputZ> => {
  const token = ctx.session?.user?.token;
  if (input.network_id == "") {
    return { data: {}, response_code: "400" };
  }
  const url = `${process.env.BACKEND_API}/generate_scada_template/${input.network_id}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to get headers.");
  }
  const data = await res.json();
  return { data: data, response_code: res.status.toString() };
};

export default getSCADATemplateHeadersHandler;
