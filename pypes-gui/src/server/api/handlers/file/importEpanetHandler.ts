import * as z from 'zod';
import { Context } from "../../trpc";
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { v4 as uuidv4 } from 'uuid';

export const importEpanetInputZ = z.object({
  fileContent: z.string(),
});

export const importEpanetOutputZ = z.object({
  data: z.any(),
});

const importEpanetHandler = async (input: z.infer<typeof importEpanetInputZ>, ctx: Context) => {
  const tempDir = os.tmpdir();
  const inpFile = path.join(tempDir, `${uuidv4()}.inp`);
  const outFile = path.join(tempDir, `${uuidv4()}.json`);

  try {
    fs.writeFileSync(inpFile, input.fileContent);

    // Using python3 to call epyt2pypes. 
    // We assume pype_schema is installed in the environment.
    const pythonCode = `
from pype_schema.epyt_utils import epyt2pypes
import json
import sys
import os

try:
    # epyt2pypes(inp_file, out_file, add_nodes=False, use_name_as_id=False, content_placeholder="DrinkingWater")
    # We use use_name_as_id=True as it's often preferred for human readability if names are unique
    epyt2pypes("${inpFile}", "${outFile}", use_name_as_id=True)
    if os.path.exists("${outFile}"):
        print(json.dumps({"status": "success"}))
    else:
        print(json.dumps({"status": "error", "message": "Output file was not created"}))
        sys.exit(1)
except Exception as e:
    print(json.dumps({"status": "error", "message": str(e)}))
    sys.exit(1)
`;
    
    // Execute the python command
    execSync(`python3 -c '${pythonCode}'`);

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
    } catch (cleanupError) {
        console.warn("Failed to cleanup temporary files:", cleanupError);
    }
  }
};

export default importEpanetHandler;
