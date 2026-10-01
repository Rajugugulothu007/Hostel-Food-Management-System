const KEY_PREFIX = "hfms_avatar_";

export function getAvatar(username: string): string | null {
  if (!username) return null;
  return localStorage.getItem(KEY_PREFIX + username);
}

export function setAvatar(username: string, dataUrl: string) {
  if (!username) return;
  localStorage.setItem(KEY_PREFIX + username, dataUrl);
}

export function removeAvatar(username: string) {
  if (!username) return;
  localStorage.removeItem(KEY_PREFIX + username);
}

/**
 * Convert a File to a base64 data URL. Resizes to max 256x256 to keep
 * localStorage size small.
 */
export async function fileToResizedDataUrl(file: File, maxSize = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please select an image file"));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to process image"));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = () => reject(new Error("Invalid image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}