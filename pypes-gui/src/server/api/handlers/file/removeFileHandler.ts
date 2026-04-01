import { Context } from "vm";
import * as z from "zod";

export const removeFileInputZ = z.object({
  fileId: z.string(),
});
export const removeFileOutputZ = z.object({
  data: z.any(),
});

type RemoveFileInputZ = z.infer<typeof removeFileInputZ>;
type RemoveFileOutputZ = z.infer<typeof removeFileOutputZ>;

const previewFileHandler = async (
  input: RemoveFileInputZ,
  ctx: Context
): Promise<RemoveFileOutputZ> => {
  const url = `${process.env.BACKEND_API}/delete/file/${input.fileId}`;

  console.log("Fetching:", url); //d
  const token = ctx.session?.user?.token;

  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      //body: JSON.stringify(input),
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await res.json();
    return {
      data: data,
    };
  } catch (e) {
    console.log("Error: ", e);
  }

  return {
    data: "",
  };
};

export default previewFileHandler;
