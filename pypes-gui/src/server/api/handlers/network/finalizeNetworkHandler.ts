import { Context } from "vm";
import * as z from "zod";

export const finalizeNetworkInputZ = z.object({
  networkId: z.string(),
});

export const finalizeNetworkOutputZ = z.object({
  data: z.any(),
});

type FinalizeNetworkInputZ = z.infer<typeof finalizeNetworkInputZ>;
type FinalizeNetworkOutputZ = z.infer<typeof finalizeNetworkOutputZ>;

const finalizeNetworkHandler = async (
  input: FinalizeNetworkInputZ,
  ctx: Context
): Promise<FinalizeNetworkOutputZ> => {
  const url = `${process.env.BACKEND_API}/prefect/start/merge/finalize/complete_flow?network_id=${input.networkId}`;

  console.log("Fetching:", url); //d
  const token = ctx.session?.user?.token;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

     //d

    const data = await res.json();
    console.log("reponse: ",data);
    return {data: data};
  } catch (e) {
    console.log("Error: ", e);
  }

  return {
    data: "",
  };
};

export default finalizeNetworkHandler;
