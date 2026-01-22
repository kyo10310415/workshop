import path from 'path';
import fs from 'fs/promises';

export interface StorageService {
  saveFile(file: Express.Multer.File): Promise<string>;
  getFilePath(filename: string): string;
  deleteFile(filename: string): Promise<void>;
}

class LocalStorageService implements StorageService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(__dirname, '../../uploads');
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    const filename = `${Date.now()}-${file.originalname}`;
    const filepath = path.join(this.uploadDir, filename);
    await fs.writeFile(filepath, file.buffer);
    return filename;
  }

  getFilePath(filename: string): string {
    return path.join(this.uploadDir, filename);
  }

  async deleteFile(filename: string): Promise<void> {
    const filepath = this.getFilePath(filename);
    try {
      await fs.unlink(filepath);
    } catch (error) {
      console.error('Delete file error:', error);
    }
  }
}

export const storageService = new LocalStorageService();
