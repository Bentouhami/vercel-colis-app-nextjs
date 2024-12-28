// Path: src/utils/qrUtils.ts
import QRCode from 'qrcode';
import cloudinary from '@/config/cloudinary';



/**
 * Generate a QR code from an object and return it as a Base64 data URL.
 * @param data Object to encode in the QR code.
 * @returns Base64 data URL of the QR code.
 */
export async function generateQrCode(data: object): Promise<string> {
    try {
        const dataString = JSON.stringify(data);
        return await QRCode.toDataURL(dataString);
    } catch (error) {
        console.error('Error generating QR Code:', error);
        throw new Error('Failed to generate QR Code');
    }
}

/**
 * Upload a Base64 image to Cloudinary and return the secure URL.
 * @param base64Image Base64 string of the image.
 * @param publicId Public ID for Cloudinary.
 * @param folder Folder in Cloudinary to store the image.
 * @returns Secure URL of the uploaded image.
 */
export async function uploadToCloudinary(
    base64Image: string,
    publicId: string,
    folder: string
): Promise<string> {
    try {
        const uploadResult = await cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`, {
            public_id: `${folder}/${publicId}`,
            folder,
            overwrite: true,
        });

        return uploadResult.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw new Error('Failed to upload image to Cloudinary');
    }
}

export async function generateAndUploadQRCode(data: object, trackingNumber: string, folder: string): Promise<string> {
    console.log("log ====> data in generateAndUploadQRCode function called in path: src/utils/qrUtils.ts is : ", data);

    const qrCodeDataUrl = await generateQrCode(data);
    const base64Image = qrCodeDataUrl.split(',')[1];
    return await uploadToCloudinary(base64Image, trackingNumber, folder);
}

