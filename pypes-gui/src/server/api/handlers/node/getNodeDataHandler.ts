import * as z from 'zod';
import { Context } from "vm";

export const getDataInputZ = z.object({
    network_id: z.string(),
    node_id: z.string(),
  });

export const getDataOutputZ = z.object({
    data: z.string(),
    response_code: z.string(),
  });

type InputZ = z.infer<typeof getDataInputZ>;
type OutputZ = z.infer<typeof getDataOutputZ>;

const getNodeDataHandler = async (input: InputZ,ctx: Context): Promise<OutputZ> => {
    // const network_id = process.env.NETWORK_ID
    const url = `${process.env.BACKEND_API}/network/${input.network_id}/node/get/${input.node_id}`;
    console.log("url: ", url);
    const token = ctx.session?.user?.token;
    if(input.network_id == "" || input.node_id == ""){
        return { data: "", response_code: ""};
    }
    try {
        const res = await fetch(url, {
          method: "GET",
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
    
      return { data: "", response_code: ""};
}

export default getNodeDataHandler;