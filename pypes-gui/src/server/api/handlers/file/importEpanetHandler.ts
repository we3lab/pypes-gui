import * as z from 'zod';
import { Context } from "../../trpc";
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { v4 as uuidv4 } from 'uuid';
import PythonBridge from "../../../utils/python-bridge";

export const importEpanetInputZ = z.object({
  fileContent: z.string(),
});

export const importEpanetOutputZ = z.object({
  data: z.any(),
});

const importEpanetHandler = async (input: z.infer<typeof importEpanetInputZ>, ctx: Context) => {
  const tempDir = os.tmpdir();
  const scriptId = uuidv4();
  const inpFile = path.join(tempDir, `${scriptId}.inp`);
  const outFile = path.join(tempDir, `${scriptId}.json`);
  const pyFile = path.join(tempDir, `${scriptId}.py`);

  try {
    fs.writeFileSync(inpFile, input.fileContent);

    // Create a robust python script in a temp file
    const pythonCode = `
try:
    from pype_schema.epyt_utils import epyt2pypes
    import json
    import sys
    import os

    inp_path = r"${inpFile}"
    out_path = r"${outFile}"
    
    # epyt2pypes(inp_file, out_file, add_nodes=False, use_name_as_id=False, content_placeholder="DrinkingWater")
    epyt2pypes(inp_path, out_path, use_name_as_id=True)
    
    if os.path.exists(out_path):
        print(json.dumps({"status": "success"}))
    else:
        print(json.dumps({"status": "error", "message": "Output file was not created"}))
        sys.exit(1)
except Exception as e:
    import json
    import sys
    print(json.dumps({"status": "error", "message": str(e)}))
    sys.exit(1)
`;
    
    fs.writeFileSync(pyFile, pythonCode);
    
    // Execute using the private bridge
    PythonBridge.execute(pyFile);

    if (!fs.existsSync(outFile)) {
        throw new Error("Conversion failed: Output JSON file not found.");
    }

    const resultJson = fs.readFileSync(outFile, 'utf8');
    const parsedResult = JSON.parse(resultJson);

    return { data: parsedResult };
  } catch (error: any) {
    console.error("Error in importEpanetHandler:", error);
    throw new Error(`Failed to import EPANET file: ${error.message}`);
  } finally {
    // Cleanup temporary files
    try {
        if (fs.existsSync(inpFile)) fs.unlinkSync(inpFile);
        if (fs.existsSync(outFile)) fs.unlinkSync(outFile);
        if (fs.existsSync(pyFile)) fs.unlinkSync(pyFile);
    } catch (cleanupError) {
        console.warn("Failed to cleanup temporary files:", cleanupError);
    }
  }
};

export default importEpanetHandler;
