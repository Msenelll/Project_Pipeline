import { BaseNode, NodeMetadata, ExecutionContext, NodeExecutionResult, DataPacket } from '@aether-forge/sdk';

export class ElevenLabsNode extends BaseNode {
  public metadata: NodeMetadata = {
    id: 'ElevenLabsNode',
    name: 'ElevenLabsNode',
    displayName: 'ElevenLabs TTS',
    description: 'Generates speech audio from text using ElevenLabs API.',
    category: 'Audio',
    version: '1.0.0',
    author: 'Aether Forge',
    tags: ['audio', 'voice', 'elevenlabs', 'tts'],
    inputs: [
      {
        id: 'text',
        name: 'Text In',
        type: 'String',
        required: true
      }
    ],
    outputs: [
      {
        id: 'audio',
        name: 'Audio Out',
        type: 'Audio',
        required: true
      }
    ],
    settings: [
      {
        key: 'voiceId',
        label: 'Voice ID',
        type: 'text',
        defaultValue: '21m00Tcm4TlvDq8ikWAM', // Rachel voice
        required: false
      }
    ]
  };

  public async execute(context: ExecutionContext): Promise<NodeExecutionResult> {
    const start = Date.now();
    const textPacket = context.variables.get('text') as DataPacket;
    const textContent = textPacket ? textPacket.payload : '';
    const voiceId = context.variables.get('voiceId') || this.metadata.settings[0].defaultValue;

    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      context.logger.warn('ELEVENLABS_API_KEY not found in environment. Falling back to Mock Simulation Mode.');
      
      context.reportProgress(30, 'Mock: Queuing voice request...');
      await new Promise(resolve => setTimeout(resolve, 300));
      context.reportProgress(90, 'Mock: Rendering audio file...');

      const simulatedAudio = {
        audioId: 'audio_mock_44182',
        format: 'mp3',
        fileSize: 24500,
        downloadUrl: 'https://api.elevenlabs.io/v1/assets/audio_mock_44182.mp3',
        sampleText: textContent
      };

      const outputPacket = this.createPacket('Audio', simulatedAudio);
      return this.successResult({ audio: outputPacket }, Date.now() - start);
    }

    try {
      context.logger.info(`Sending Text-to-Speech request to ElevenLabs API...`);
      context.reportProgress(20, 'Connecting to ElevenLabs...');

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text: textContent,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ElevenLabs API responded with status ${response.status}: ${errorText}`);
      }

      context.reportProgress(80, 'Processing audio stream...');
      const arrayBuffer = await response.arrayBuffer();
      const base64Data = Buffer.from(arrayBuffer).toString('base64');
      context.logger.info(`Audio compiled successfully. Size: ${base64Data.length} characters (base64)`);

      const outputPayload = {
        audioId: `audio_${Date.now()}`,
        format: 'mp3',
        fileSize: arrayBuffer.byteLength,
        base64Data: base64Data
      };

      const outputPacket = this.createPacket('Audio', outputPayload);
      return this.successResult({ audio: outputPacket }, Date.now() - start);
    } catch (err: any) {
      context.logger.error(`ElevenLabs execution error: ${err.message}`, err);
      return this.errorResult(err.message, Date.now() - start, 'ELEVENLABS_API_ERROR');
    }
  }
}
