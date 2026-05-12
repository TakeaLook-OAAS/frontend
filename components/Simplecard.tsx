type SimpleCardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  className?: string;
};

export default function SimpleCard({
  title,
  value,
  subtitle,
  icon,
  className = "p-6",
}: SimpleCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="flex items-center gap-2 text-gray-800">
        <p className="text-xs">{title}</p>
        <div className="text-blue-600">{icon}</div>
      </div>
      <p className="text-base font-bold mt-2 text-gray-800">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
}