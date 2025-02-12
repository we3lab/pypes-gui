import { Context } from "vm";
import * as z from "zod";

export const uploadFilesInputZ = z.object({
  networkId: z.string(),
  facility_id: z.string(),
  data_type: z.string(),
  csv_file: z.any(),
});

export const uploadFilesOutputZ = z.object({
  data: z.string(),
});

type UploadFilesInputZ = z.infer<typeof uploadFilesInputZ>;
type UploadFilesOutputZ = z.infer<typeof uploadFilesOutputZ>;

const uploadFilesHandler = async (
  input: UploadFilesInputZ,
  ctx: Context
): Promise<UploadFilesOutputZ> => {
  const url = `${process.env.BACKEND_API}/upload/file?network_id=${input.networkId}&facility_id=${input.facility_id}&data_type=${input.data_type}`;

  console.log("Fetching:", url); //d
  const token = ctx.session?.user?.token;

  const formData = new FormData();
  formData.append("csv_file", input.csv_file);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },

      body: formData,
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await res.json();
    return {
      data: JSON.stringify(data),
    };
  } catch (e) {
    console.log("Error: ", e);
  }

  return { data: "" };
};

export default uploadFilesHandler;
