import { Context } from "vm";
import * as z from "zod";

export const createNetworksInputZ = z.object({
  input_data: z.object({
    name_by_user: z.string(),
    type: z.string(),
    status: z.string(),
  }),
  template_id: z.string().optional(),
});
export const createNetworksOutputZ = z.object({
  status: z.string(),
  network_id: z.string(),
});

type CreateNetworksInputZ = z.infer<typeof createNetworksInputZ>;
type CreateNetworksOutputZ = z.infer<typeof createNetworksOutputZ>;

const createNetworkHandler = async (
  input: CreateNetworksInputZ,
  ctx: Context
): Promise<CreateNetworksOutputZ> => {
  const url = `${process.env.BACKEND_API}/network/create?template_id=${input.template_id}`;
  console.log("NetworkInput:", input);
  console.log("Fetching:", url); //d
  const token = ctx.session?.user?.token;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input.input_data),
    });
    
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await res.json();
    return data;
  } catch (e) {
    console.log("Error: ", e);
  }

  return {
    status: "error",
    network_id: "",
  };
};

export default createNetworkHandler;
