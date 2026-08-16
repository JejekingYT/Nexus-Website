interface Props {
  title: string;
  value: string | number;
  icon: string;
}

export default function StatCard({
  title,
  value,
  icon,
}: Props) {

  return (
    <div
      className="
      bg-white/5
      border
      border-white/10
      rounded-2xl
      p-6
      transition-all
      duration-300
      hover:border-purple-500
      hover:-translate-y-1
      hover:shadow-lg
      hover:shadow-purple-500/10
      "
    >

      <div className="text-4xl">
        {icon}
      </div>


      <p className="text-gray-400 mt-4">
        {title}
      </p>


      <h2 className="
        text-3xl
        md:text-4xl
        font-extrabold
        mt-2
      ">
        {value}
      </h2>


    </div>
  );
}