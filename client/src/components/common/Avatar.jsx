import { useState } from 'react';

const VARIANTS = {
  admin: 'avatar-admin',
  talent: 'avatar-talent',
};

const SIZES = {
  sm:  { container: 'w-8 h-8',  text: 'text-[12px]' },
  md:  { container: 'w-9 h-9',  text: 'text-[13px]' },
  lg:  { container: 'w-10 h-10', text: 'text-[14px]' },
};

const Avatar = ({ name = '', src, size = 'sm', variant = 'talent', className = '' }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const initials = name?.[0]?.toUpperCase() ?? (variant === 'admin' ? 'A' : 'T');
  const showImage = src && !imgFailed;
  const { container, text } = SIZES[size] || SIZES.sm;

  return (
    <div
      className={`${container} rounded-full ${VARIANTS[variant] || VARIANTS.talent} flex items-center justify-center ${text} font-bold text-white shrink-0 ${className}`}
    >
      {showImage ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full rounded-full object-cover"
          onError={() => setImgFailed(true)}
        />
      ) : (
        initials
      )}
    </div>
  );
};

export default Avatar;
