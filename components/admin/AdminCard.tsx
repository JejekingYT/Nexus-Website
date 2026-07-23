interface Props {
  title: string;
  children: React.ReactNode;
}

export default function AdminCard({
  title,
  children,
}: Props) {

  return (
    <div
      className="
      bg-white/5
      border
      border-white/10
      rounded-2xl
      p-5
      md:p-6
      transition-all
      duration-300
      hover:border-purple-500
      "
    >

      <h2
        className="
        text-lg
        md:text-xl
        font-bold
        mb-5
        "
      >
        {title}
      </h2>


      <div className="overflow-x-auto">
        {children}
      </div>


    </div>
  );
}