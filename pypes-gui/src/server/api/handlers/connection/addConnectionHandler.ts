import { Context } from "vm";
import * as z from "zod";

export const addConnectionInputZ = z.object({
  networkId: z.string(),
  newConnection: z.object({
    id: z.string(),
    type: z.string(),
    source: z.string(),
    destination: z.string(),
    contents: z.string(),
    tags: z.any(),
    bidirectional: z.boolean(),
    exit_point: z.string(),
    entry_point: z.string(),
  }),
});

export const addConnectionOutputZ = z.object({
  data: z.string(),
  response_code: z.string(),
});

type AddConnectionInputZ = z.infer<typeof addConnectionInputZ>;
type AddConnectionOutputZ = z.infer<typeof addConnectionOutputZ>;

const addConnectionHandler = async (
  input: AddConnectionInputZ,
  ctx: Context
): Promise<AddConnectionOutputZ> => {
  const url = `${process.env.BACKEND_API}/network/${input.networkId}/connection/add`;
  console.log("Fetching:", url); //d
  const token = ctx.session?.user?.token;

  try {
    const res = await fetch(url, {
      method: "POST",
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

export default addConnectionHandler;
