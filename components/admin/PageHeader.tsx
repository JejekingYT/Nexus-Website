interface Props {
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  action,
}: Props) {
  return (
    <div
      className="
      flex
      flex-col
      md:flex-row
      md:items-center
      md:justify-between
      gap-6
      mb-10
      "
    >

      <div>

        <h1
          className="
          text-4xl
          md:text-5xl
          font-extrabold
          "
        >
          {title}
        </h1>


        {description && (

          <p className="text-gray-400 mt-3">
            {description}
          </p>

        )}

      </div>



      {action && (

        <div className="w-full md:w-auto">

          {action}

        </div>

      )}


    </div>
  );
}