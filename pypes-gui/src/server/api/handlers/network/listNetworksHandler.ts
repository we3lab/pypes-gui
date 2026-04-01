import { Context } from "vm";
import * as z from "zod";

export const listNetworksInputZ = z.object({});
export const listNetworksOutputZ = z.object({
  availableNetworks: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: z.string(),
      status: z.string(),
      creation_time: z.string(),
      last_modification_time: z.string(),
    })
  ),
});

type ListNetworksInputZ = z.infer<typeof listNetworksInputZ>;
type ListNetworksOutputZ = z.infer<typeof listNetworksOutputZ>;

const listNetworksHandler = async (
  input: ListNetworksInputZ,
  ctx: Context
): Promise<ListNetworksOutputZ> => {
  const url = `${process.env.BACKEND_API}/network/list/metadata`;

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
      availableNetworks: data,
    };
  } catch (e) {
    console.log("Error: ", e);
  }

  return {
    availableNetworks: [
      {
        id: "",
        name: "",
        type: "",
        status: "",
        creation_time: "",
        last_modification_time: "",
      },
    ],
  };
};

export default listNetworksHandler;
