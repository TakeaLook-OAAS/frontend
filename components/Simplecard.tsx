type SimpleCardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
};

export default function SimpleCard({
  title,
  value,
  subtitle,
  icon,
}: SimpleCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 text-gray-500">
        <p className="text-sm">{title}</p>
        <div className="text-blue-600">{icon}</div>
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
}