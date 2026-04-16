import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor() {
    this.region = process.env.AWS_S3_REGION || 'us-east-1';
    this.bucketName = process.env.AWS_S3_BUCKET_NAME || '';

    if (!this.bucketName) {
      console.warn('AWS_S3_BUCKET_NAME is not defined in environment variables. S3 uploads will fail.');
    }

    this.s3Client = new S3Client({
      region: this.region,
      // The AWS SDK automatically picks up AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY from the environment
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!this.bucketName) {
      throw new InternalServerErrorException('S3 bucket name is not configured.');
    }

    const uniqueSuffix = uuidv4() + extname(file.originalname);
    const key = `uploads/${uniqueSuffix}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        // ACL: 'public-read', // Not needed if the bucket policy is set to public-read for the whole bucket
      });

      await this.s3Client.send(command);

      // Return the public S3 URL
      return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw new InternalServerErrorException('Failed to upload file to S3');
    }
  }
}
