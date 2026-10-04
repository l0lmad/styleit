/**
 * Normalises a phone number into the international format WhatsApp expects,
 * which is digits only, no "+", and no leading trunk zero.
 *
 * Examples:
 *   "0201097979619"  -> "201097979619"  (leading 0 + country code already present)
 *   "01097979619"    -> "201097979619"  (local trunk prefix)
 *   "00201097979619" -> "201097979619"
 *   "+201097979619"  -> "201097979619"
 *   "0223456789"     -> "20223456789"   (Cairo landline)
 */
export function toWhatsAppNumber(raw?: string | null): string {
  if (!raw) return '';

  let digits = (String(raw).match(/\d/g) || []).join('');
  if (!digits) return '';

  if (digits.startsWith('00')) digits = digits.slice(2);

  if (digits.startsWith('0')) {
    // "0" followed by "20" already carries the country code, so only drop the zero.
    if (digits.startsWith('020')) digits = digits.slice(1);
    // Otherwise "0" is the local trunk prefix and turns into the "20" country code.
    else digits = `20${digits.slice(1)}`;
  }

  return digits;
}

export function isValidWhatsAppNumber(raw?: string | null): boolean {
  const digits = toWhatsAppNumber(raw);
  return digits.length >= 8 && digits.length <= 15;
}

export function whatsappLink(raw: string | null | undefined, message?: string): string {
  const digits = toWhatsAppNumber(raw);
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}