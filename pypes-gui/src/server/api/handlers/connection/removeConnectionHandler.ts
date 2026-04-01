import { Context } from "vm";
import * as z from "zod";

export const removeConnectionInputZ = z.object({
  networkId: z.string(),
  connection_id: z.string(),
});

export const removeConnectionOutputZ = z.object({
  data: z.string(),
  response_code: z.string(),
});

type RemoveConnectionInputZ = z.infer<typeof removeConnectionInputZ>;
type RemoveConnectionOutputZ = z.infer<typeof removeConnectionOutputZ>;

const removeConnectionHandler = async (
  input: RemoveConnectionInputZ,
  ctx: Context
): Promise<RemoveConnectionOutputZ> => {
  const url = `${process.env.BACKEND_API}/network/${input.networkId}/connection/${input.connection_id}/remove`;
  const token = ctx.session?.user?.token;
  console.log("Fetching:", url);

  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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

export default removeConnectionHandler;
