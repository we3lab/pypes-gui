import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

class PythonBridge {
  private static venvPath = path.join(process.cwd(), '.pypes_venv');
  private static pythonExe = os.platform() === 'win32' 
    ? path.join(PythonBridge.venvPath, 'Scripts', 'python.exe')
    : path.join(PythonBridge.venvPath, 'bin', 'python3');

  /**
   * Ensures the virtual environment exists and has the required dependencies.
   */
  public static ensureEnvironment() {
    if (!fs.existsSync(PythonBridge.venvPath)) {
      console.log('Creating private Python virtual environment...');
      execSync(`python3 -m venv "${PythonBridge.venvPath}"`);
      
      console.log('Installing dependencies (numpy<2, pype-schema)...');
      // Using --quiet to reduce logs, but ensuring compatibility
      execSync(`"${PythonBridge.pythonExe}" -m pip install --quiet "numpy<2" "pype-schema"`);
      console.log('Private environment ready.');
    }
  }

  /**
   * Executes a python script using the isolated environment's binary.
   */
  public static execute(scriptPath: string) {
    PythonBridge.ensureEnvironment();
    return execSync(`"${PythonBridge.pythonExe}" "${scriptPath}"`, { encoding: 'utf8' });
  }
}

export default PythonBridge;
