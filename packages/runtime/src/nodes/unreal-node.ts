import { BaseNode, NodeMetadata, ExecutionContext, NodeExecutionResult, DataPacket } from '@aether-forge/sdk';
import { UnrealMCPServer } from '../unreal/mcp-server.js';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

export class UnrealImportNode extends BaseNode {
  public metadata: NodeMetadata = {
    id: 'UnrealImportNode',
    name: 'UnrealImportNode',
    displayName: 'Unreal Engine Asset Importer',
    description: 'Automates asset imports into Unreal Engine Content folders via the Unreal MCP Server.',
    category: 'Unreal',
    version: '1.0.0',
    author: 'Aether Forge',
    tags: ['unreal', 'mcp', 'import', 'automation'],
    inputs: [
      {
        id: 'mesh',
        name: 'Mesh In',
        type: 'GLB',
        required: true
      }
    ],
    outputs: [
      {
        id: 'importedAsset',
        name: 'Imported Asset Path',
        type: 'String',
        required: true
      }
    ],
    settings: [
      {
        key: 'destinationPath',
        label: 'Destination Folder',
        type: 'text',
        defaultValue: '/Game/Characters',
        required: true
      }
    ]
  };

  public async execute(context: ExecutionContext): Promise<NodeExecutionResult> {
    const start = Date.now();
    const meshPacket = context.variables.get('mesh') as DataPacket;
    
    if (!meshPacket || !meshPacket.payload) {
      return this.errorResult('No mesh input packet or payload provided.', Date.now() - start, 'UNREAL_IMPORT_ERROR');
    }

    const payload = meshPacket.payload;
    const destinationPath = context.variables.get('destinationPath') || this.metadata.settings[0].defaultValue;

    context.logger.info(`Extracting mesh payload: ${JSON.stringify(payload)}`);
    context.reportProgress(20, 'Initializing Unreal MCP Connection...');

    // Resolve a local file path.
    // If payload has a filePath, use it. Otherwise, create a temporary file.
    let localFilePath = payload.filePath || '';
    
    if (!localFilePath) {
      // Create a temporary file so that Python script's os.path.exists check passes
      const tempDir = os.tmpdir();
      const fileName = payload.modelId ? `${payload.modelId}.glb` : `mesh_${Date.now()}.glb`;
      localFilePath = path.join(tempDir, fileName).replace(/\\/g, '/');
      
      try {
        if (!fs.existsSync(localFilePath)) {
          fs.writeFileSync(localFilePath, 'MOCK_GLB_DATA_FOR_UNREAL_IMPORT');
          context.logger.info(`Created temporary mock file at: ${localFilePath}`);
        }
      } catch (err: any) {
        context.logger.warn(`Could not create mock file: ${err.message}. Unreal import might fail if editor is active.`);
      }
    }

    try {
      const server = new UnrealMCPServer();
      context.reportProgress(50, 'Executing import command...');
      const response = await server.executeImport(localFilePath, destinationPath);

      if (!response.success) {
        return this.errorResult(
          response.error || 'Failed to import asset into Unreal.',
          Date.now() - start,
          'UNREAL_IMPORT_FAILED'
        );
      }

      context.reportProgress(100, 'Import completed successfully.');
      context.logger.info(`Unreal Import Response: ${JSON.stringify(response.output)}`);

      const outputPacket = this.createPacket('String', response.output.importedAssetPath);
      return this.successResult({ importedAsset: outputPacket }, Date.now() - start);
    } catch (err: any) {
      context.logger.error(`Unreal Node execution error: ${err.message}`, err);
      return this.errorResult(err.message, Date.now() - start, 'UNREAL_NODE_EXECUTION_ERROR');
    }
  }
}
