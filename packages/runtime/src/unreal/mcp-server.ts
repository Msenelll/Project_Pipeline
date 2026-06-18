import { exec } from 'child_process';
import * as net from 'net';
import * as path from 'path';

export interface UnrealMCPToolRequest {
  tool: string;
  arguments: Record<string, any>;
}

export interface UnrealMCPToolResponse {
  success: boolean;
  output: any;
  error?: string;
}

export class UnrealMCPServer {
  private uePort = 30000; // Default Unreal Python TCP Command Port
  private ueHost = '127.0.0.1';

  // Run the Unreal Engine import command
  public async executeImport(filePath: string, destinationPath: string): Promise<UnrealMCPToolResponse> {
    console.log(`[UnrealMCPServer] Received import tool call for: ${filePath} -> ${destinationPath}`);

    // Check if Unreal Engine Command Port is listening
    const isUeConnected = await this.testConnection();

    if (!isUeConnected) {
      console.warn(`[UnrealMCPServer] Unreal Editor TCP Command Port (${this.ueHost}:${this.uePort}) is not reachable.`);
      console.log(`[UnrealMCPServer] Falling back to Simulation Mode (Command logging & Mock response).`);
      
      // Simulating command line call that would be sent to Unreal
      const scriptPath = path.resolve('packages/runtime/src/unreal/import-helper.py');
      const simulatedCommand = `py "${scriptPath}" --file "${filePath}" --dest "${destinationPath}"`;
      
      console.log(`[UnrealMCPServer] [SIMULATION] Command to send: ${simulatedCommand}`);
      
      const cleanName = path.basename(filePath, path.extname(filePath));
      const simulatedAssetPath = `${destinationPath}/SM_${cleanName.charAt(0).toUpperCase() + cleanName.slice(1)}`;

      return {
        success: true,
        output: {
          message: "Import simulated successfully (Simulation Mode active)",
          importedAssetPath: simulatedAssetPath,
          pythonCommand: simulatedCommand
        }
      };
    }

    // If Unreal Engine TCP Port is active, send Python import command directly!
    try {
      const scriptPath = path.resolve('packages/runtime/src/unreal/import-helper.py').replace(/\\/g, '/');
      const pythonCommand = `import sys; sys.argv = ['--file', '${filePath}', '--dest', '${destinationPath}']; exec(open('${scriptPath}').read())\n`;

      console.log(`[UnrealMCPServer] Sending Python script payload to Unreal Engine TCP Port...`);
      const responseText = await this.sendTCPCommand(pythonCommand);

      const success = !responseText.includes("Failed") && !responseText.includes("Error");
      return {
        success,
        output: {
          rawOutput: responseText,
          importedAssetPath: `${destinationPath}/SM_${path.basename(filePath, path.extname(filePath))}`
        }
      };
    } catch (err: any) {
      return {
        success: false,
        output: null,
        error: `Failed to execute import in Unreal: ${err.message}`
      };
    }
  }

  // Helper: Test TCP connection to port 30000
  private testConnection(): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(1000);

      socket.on('connect', () => {
        socket.destroy();
        resolve(true);
      });

      socket.on('error', () => {
        resolve(false);
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve(false);
      });

      socket.connect(this.uePort, this.ueHost);
    });
  }

  // Helper: Send string command over TCP and receive response
  private sendTCPCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const socket = new net.Socket();
      let responseData = '';

      socket.connect(this.uePort, this.ueHost, () => {
        socket.write(command);
      });

      socket.on('data', (data) => {
        responseData += data.toString();
        // Unreal Python port closes connection after responding usually
        socket.end();
      });

      socket.on('end', () => {
        resolve(responseData);
      });

      socket.on('error', (err) => {
        reject(err);
      });
    });
  }
}
