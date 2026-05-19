import { useState } from 'react';

function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder = '••••••••',
  required = true,
  minLength,
  autoComplete,
}) {
  const [show, setShow] = useState(false);

  return (
    <div>
      {label && (
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-stone-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          className="input pr-11"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-stone-500 hover:text-brand-700"
          tabIndex={-1}
        >
          {show ? 'Hide' : 'Show'}
        </button>
      </div>
    </div>
  );
}

export default PasswordInput;
