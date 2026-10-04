/**
 * Image hosting config.
 *
 * NOTE: this app is a static client-side bundle with no backend, so this key
 * is visible in the shipped JavaScript. Treat it as a low-value secret and
 * regenerate it from imgbb.com if it ever leaks.
 */
export const IMAGE_HOST_API_KEY = '27952c9b3e89bb564106ca265149a44f';

export function hasImageHostKey(): boolean {
  const key = IMAGE_HOST_API_KEY.trim();
  return key.length > 10 && key !== 'PASTE_YOUR_IMGBB_API_KEY_HERE';
}