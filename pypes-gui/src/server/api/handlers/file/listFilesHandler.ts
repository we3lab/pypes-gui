import { Context } from "vm";
import * as z from "zod";

export const listFilesInputZ = z.object({
  networkId: z.string(),
});

export const listFilesOutputZ = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: z.string(),
    })
  ),
});

type ListFilesInputZ = z.infer<typeof listFilesInputZ>;
type ListFilesOutputZ = z.infer<typeof listFilesOutputZ>;

const listFilesHandler = async (
  input: ListFilesInputZ,
  ctx: Context
): Promise<ListFilesOutputZ> => {
  const url = `${process.env.BACKEND_API}/list/files/metadata?network_id=${input.networkId}`;
  if(input.networkId ===""){
    return { data: [{id: "", name: "", type: ""}] };
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
      data: data,
    };
  } catch (e) {
    console.log("Error: ", e);
  }

  return { data: [{id: "", name: "", type: ""}] };
};

export default listFilesHandler;
