import { Context } from "vm";
import * as z from "zod";

export const removeNodeInputZ = z.object({
  networkId: z.string(),
  node_id: z.string(),
  parent_id: z.string(),
});

export const removeNodeOutputZ = z.object({
  data: z.string(),
  response_code: z.string(),
});

type RemoveNodeInputZ = z.infer<typeof removeNodeInputZ>;
type RemoveNodeOutputZ = z.infer<typeof removeNodeOutputZ>;

const removeNodeHandler = async (
  input: RemoveNodeInputZ,
  ctx: Context
): Promise<RemoveNodeOutputZ> => {
  const url = `${process.env.BACKEND_API}/network/${input.networkId}/node/remove/${
    input.parent_id === "world" ? "ParentNetwork" : input.parent_id
  }/${input.node_id}`;
  
  const token = ctx.session?.user?.token;
  console.log("Fetching:", url);

  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
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

export default removeNodeHandler;
