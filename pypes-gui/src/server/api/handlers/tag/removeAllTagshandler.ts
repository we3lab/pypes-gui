import { Context } from "vm";
import * as z from "zod";

export const removeAllTagsInputZ = z.object({
  networkId: z.string(),
});

export const removeAllTagsOutputZ = z.object({
  data: z.any(),
  response_code: z.any(),
});

type RemoveAllTagsInputZ = z.infer<typeof removeAllTagsInputZ>;
type RemoveAllTagsOutputZ = z.infer<typeof removeAllTagsOutputZ>;

const removeAllTagsHandler = async (
  input: RemoveAllTagsInputZ,
  ctx: Context
): Promise<RemoveAllTagsOutputZ> => {
  const url = `${process.env.BACKEND_API}/network/${input.networkId}/remove_all_tags`;
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
      throw new Error("Failed to delete all tags");
    }

    const data = await res.json();
    return {
      data: data,
      response_code: res.status,
    };
  } catch (e) {
    console.log("Error: ", e);
  }

  return { data: "", response_code: "" };
};

export default removeAllTagsHandler;
