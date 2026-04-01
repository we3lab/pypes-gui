import { Context } from "vm";
import * as z from "zod";

export const previewFileInputZ = z.object({
  fileId: z.string(),
  page_cout: z.number(),
});
export const previewFileOutputZ = z.object({
  data: z.array(z.any()),
  rows_per_page: z.number(),
  total_pages: z.number(),
  total_rows: z.number(),
});

type PreviewFileInputZ = z.infer<typeof previewFileInputZ>;
type PreviewFileOutputZ = z.infer<typeof previewFileOutputZ>;

const previewFileHandler = async (
  input: PreviewFileInputZ,
  ctx: Context
): Promise<PreviewFileOutputZ> => {
  const url = `${process.env.BACKEND_API}/content/file/${input.fileId}?page=${input.page_cout}`;
  if(input.fileId === "") {
    return {
      data: [],
      rows_per_page: 0,
      total_pages: 0,
      total_rows: 0,
    };
  }

  console.log("Fetching:", url); //d
  const token = ctx.session?.user?.token;

  try {
    const res = await fetch(url, {
      method: "GET",
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
      data: data.data,
      rows_per_page: data.rows_per_page,
      total_pages: data.total_pages,
      total_rows: data.total_rows,
    };
  } catch (e) {
    console.log("Error: ", e);
  }

  return {
    data: [],
    rows_per_page: 0,
    total_pages: 0,
    total_rows: 0,
  };
};

export default previewFileHandler;
