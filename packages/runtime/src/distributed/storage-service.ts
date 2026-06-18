import * as fs from 'fs';
import * as path from 'path';

export class ObjectStorageService {
  private mockDir: string;

  constructor() {
    // Save locally to .s3_mock in the root of the workspace
    this.mockDir = path.resolve('.s3_mock');
    this.ensureDir(this.mockDir);
  }

  // Upload asset to simulated bucket
  public async uploadAsset(bucket: string, key: string, data: Buffer | string): Promise<string> {
    const bucketDir = path.join(this.mockDir, bucket);
    this.ensureDir(bucketDir);

    const filePath = path.join(bucketDir, key);
    // Ensure nested directories inside the bucket are created
    this.ensureDir(path.dirname(filePath));

    fs.writeFileSync(filePath, data);
    
    const s3Url = `s3://${bucket}/${key}`;
    console.log(`[ObjectStorageService] Uploaded asset to: ${s3Url} (Size: ${data.length} bytes)`);
    return s3Url;
  }

  // Download asset from simulated bucket
  public async downloadAsset(bucket: string, key: string): Promise<Buffer> {
    const filePath = path.join(this.mockDir, bucket, key);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Asset not found in storage: ${bucket}/${key}`);
    }
    return fs.readFileSync(filePath);
  }

  // Check if asset exists
  public async exists(bucket: string, key: string): Promise<boolean> {
    const filePath = path.join(this.mockDir, bucket, key);
    return fs.existsSync(filePath);
  }

  // List all files in a bucket
  public async listAssets(bucket: string): Promise<string[]> {
    const bucketDir = path.join(this.mockDir, bucket);
    if (!fs.existsSync(bucketDir)) {
      return [];
    }
    return this.walkDir(bucketDir).map(p => path.relative(bucketDir, p).replace(/\\/g, '/'));
  }

  // Get physical local file path for testing or Unreal Engine imports
  public getLocalPath(bucket: string, key: string): string {
    return path.join(this.mockDir, bucket, key).replace(/\\/g, '/');
  }

  private ensureDir(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private walkDir(dir: string): string[] {
    let results: string[] = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat && stat.isDirectory()) {
        results = results.concat(this.walkDir(filePath));
      } else {
        results.push(filePath);
      }
    });
    return results;
  }
}
