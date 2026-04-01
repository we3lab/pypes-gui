import { Context } from "vm";
import * as z from "zod";

export const uploadRateScheduleInputZ = z.object({
  networkId: z.string(),
  data: z.any(),
});

export const uploadRateScheduleOutputZ = z.object({
  data: z.string(),
});

type UploadRateScheduleInputZ = z.infer<typeof uploadRateScheduleInputZ>;
type UploadRateScheduleOutputZ = z.infer<typeof uploadRateScheduleOutputZ>;

const uploadRateScheduleHandler = async (
  input: UploadRateScheduleInputZ,
  ctx: Context
): Promise<UploadRateScheduleOutputZ> => {
  const url = `${process.env.BACKEND_API}/upload/rate-schedule?network_id=${input.networkId}`;

  console.log("Fetching:", url); //d
  const token = ctx.session?.user?.token;
  console.log("INPUT DATA: ", input.data);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(input.data),
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

export default uploadRateScheduleHandler;
