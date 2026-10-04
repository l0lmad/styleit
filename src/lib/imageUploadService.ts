import { IMAGE_HOST_API_KEY, hasImageHostKey } from './imageHostConfig';

const MAX_DIMENSION = 1600;
const WEBP_QUALITY = 0.82;
const JPEG_QUALITY = 0.85;

export function isBase64Image(url?: string): boolean {
  return !!url && url.startsWith('data:');
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => (blob ? resolve(blob) : reject(new Error('تعذر ضغط الصورة'))),
      type,
      quality
    );
  });
}

async function loadBitmap(file: File): Promise<{ source: CanvasImageSource; width: number; height: number; release: () => void }> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file);
      return { source: bitmap, width: bitmap.width, height: bitmap.height, release: () => bitmap.close() };
    } catch {
      // fall through to <img> decoding
    }
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = 'async';
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('تعذر قراءة الصورة'));
      img.src = objectUrl;
    });
    if (!img.width || !img.height) throw new Error('تعذر قراءة أبعاد الصورة');
    return { source: img, width: img.width, height: img.height, release: () => {} };
  } catch (err) {
    URL.revokeObjectURL(objectUrl);
    throw err;
  } finally {
    setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
  }
}

export async function compressImageFile(file: File): Promise<Blob> {
  const { source, width, height, release } = await loadBitmap(file);

  const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
  const targetWidth = Math.max(1, Math.round(width * scale));
  const targetHeight = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    release();
    throw new Error('تعذر تجهيز الصورة');
  }

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.drawImage(source, 0, 0, targetWidth, targetHeight);
  release();

  const webp = await canvasToBlob(canvas, 'image/webp', WEBP_QUALITY);
  if (webp.type === 'image/webp') return webp;

  return canvasToBlob(canvas, 'image/jpeg', JPEG_QUALITY);
}

function buildFileName(file: File): string {
  const dotIndex = file.name.lastIndexOf('.');
  const raw = dotIndex > 0 ? file.name.slice(0, dotIndex) : file.name;
  const cleaned = raw
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 40);
  return `${cleaned || 'image'}-${Date.now()}`;
}

interface ImgbbResponse {
  success?: boolean;
  status?: number;
  error?: { message?: string };
  data?: { url?: string; display_url?: string; delete_url?: string; delete_token?: string };
}

export async function uploadProductImage(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  if (!hasImageHostKey()) {
    throw new Error('مفتاح ImgBB مش متظبط — شوف src/lib/imageHostConfig.ts');
  }

  const blob = await compressImageFile(file);
  const extension = blob.type === 'image/webp' ? 'webp' : 'jpg';

  const form = new FormData();
  form.append('image', blob, `${buildFileName(file)}.${extension}`);

  const url = await new Promise<string>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('POST', `https://api.imgbb.com/1/upload?key=${IMAGE_HOST_API_KEY.trim()}`);
    request.responseType = 'json';

    if (request.upload && onProgress) {
      request.upload.onprogress = event => {
        if (event.lengthComputable) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      };
    }

    request.onload = () => {
      const payload = request.response as ImgbbResponse | null;
      if (request.status >= 200 && request.status < 300 && payload?.success && payload.data?.url) {
        resolve(payload.data.url);
        return;
      }
      const detail = payload?.error?.message || `HTTP ${request.status}`;
      reject(new Error(detail));
    };

    request.onerror = () => reject(new Error('فشل الاتصال بـ ImgBB — اتأكد من الإنترنت'));
    request.ontimeout = () => reject(new Error('انتهت مهلة الاتصال'));
    request.timeout = 120000;

    request.send(form);
  });

  onProgress?.(100);
  return url;
}