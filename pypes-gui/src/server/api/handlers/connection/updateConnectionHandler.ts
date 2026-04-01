import { Context } from "vm";
import * as z from "zod";

export const updateConnectionInputZ = z.object({
  networkId: z.string(),
  connection_id: z.string(),
  newConnection: z.object({
    id: z.string(),
    type: z.string(),
    source: z.string(),
    destination: z.string(),
    contents: z.string(),
    tags: z.any(),
    bidirectional: z.boolean(),
    // parent: z.string(),
    exit_point: z.string(),
    entry_point: z.string(),
  }),
  
});

export const updateConnectionOutputZ = z.object({
  data: z.string(),
  response_code: z.string(),
});

type UpdateConnectionInputZ = z.infer<typeof updateConnectionInputZ>;
type UpdateConnectionOutputZ = z.infer<typeof updateConnectionOutputZ>;

const updateConnectionHandler = async (
  input: UpdateConnectionInputZ,
  ctx: Context
): Promise<UpdateConnectionOutputZ> => {
  const url = `${process.env.BACKEND_API}/network/${input.networkId}/connection/${input.connection_id}/update`;
  console.log("Fetching:", url);
  console.log("Input: ", input);
  const token = ctx.session?.user?.token;
  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input.newConnection),
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await res.json();
    return {
      data: JSON.stringify(data),
      response_code: JSON.stringify(res.status),
    };
  } catch (e) {
    console.log("Error: ", e);
  }

  return { data: "", response_code: "" };
};

export default updateConnectionHandler;
