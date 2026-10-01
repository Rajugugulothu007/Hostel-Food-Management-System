interface Props {
  username?: string;
  dataUrl?: string | null;
  size?: number;
  className?: string;
}

export default function Avatar({
  username,
  dataUrl,
  size = 32,
  className = "",
}: Props) {
  const initial = username?.[0]?.toUpperCase() || "?";

  if (dataUrl) {
    return (
      <img
        src={dataUrl}
        alt={username}
        style={{ width: size, height: size }}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      className={`rounded-full bg-gradient-to-br from-teal to-cyan-500 flex items-center justify-center text-white font-bold ${className}`}
    >
      {initial}
    </div>
  );
}