export const COUNTRY_CODES = [
  { code: '+91', label: 'India (+91)' },
  { code: '+1', label: 'US (+1)' },
  { code: '+44', label: 'UK (+44)' },
  { code: '+971', label: 'UAE (+971)' },
];

export const sanitizePhoneInput = (value) => value.replace(/\D/g, '').slice(0, 10);

export const validatePhone = (phone) => {
  const digits = sanitizePhoneInput(phone);
  if (digits.length !== 10) {
    return 'Phone number must be exactly 10 digits';
  }
  return null;
};
