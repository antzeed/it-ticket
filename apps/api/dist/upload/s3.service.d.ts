export declare class S3Service {
    private readonly s3Client;
    private readonly bucketName;
    private readonly region;
    constructor();
    uploadFile(file: Express.Multer.File): Promise<string>;
}
