type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className = "brand-logo" }: BrandMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      focusable="false"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 8h12v17l7 4v6l-7 4v17H10V8Z" fill="currentColor" />
      <path d="M54 8H42v17l-7 4v6l7 4v17h12V8Z" fill="currentColor" />
      <rect className="brand-mark-node" x="27" y="27" width="10" height="10" rx="2" />
    </svg>
  );
}
