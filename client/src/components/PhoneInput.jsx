import { COUNTRY_CODES, sanitizePhoneInput } from '../utils/phoneValidation.js';

function PhoneInput({
  countryCode,
  onCountryCodeChange,
  phone,
  onPhoneChange,
  error,
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-stone-700">Phone number</label>
      <div className="flex gap-2">
        <select
          value={countryCode}
          onChange={(e) => onCountryCodeChange(e.target.value)}
          className="input w-[110px] shrink-0 text-sm"
          aria-label="Country code"
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code}
            </option>
          ))}
        </select>
        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={10}
          className={`input flex-1 ${error ? 'border-red-400 ring-red-100' : ''}`}
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => onPhoneChange(sanitizePhoneInput(e.target.value))}
          required
        />
      </div>
      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : (
        <p className="mt-1 text-xs text-stone-500">10-digit mobile number (digits only)</p>
      )}
    </div>
  );
}

export default PhoneInput;
