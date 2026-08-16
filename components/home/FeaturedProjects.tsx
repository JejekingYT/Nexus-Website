const projects = [

  {
    name: "Roblox Projects",
    description:
      "Explore the Roblox games and experiences created by the Nexus team.",
    type: "Game Development",
    icon: "🎮",
  },

  {
    name: "PC Games",
    description:
      "Upcoming PC games including horror and multiplayer experiences.",
    type: "Game Development",
    icon: "🖥️",
  },

  {
    name: "Minecraft Mods",
    description:
      "Custom Minecraft mods, items, bosses, and new experiences.",
    type: "Modding",
    icon: "⛏️",
  },

];



export default function FeaturedProjects() {


  return (

    <section className="
      py-24
      px-6
    ">


      <div className="
        max-w-6xl
        mx-auto
      ">




        <div className="
          text-center
          mb-14
        ">


          <h2 className="
            text-4xl
            md:text-5xl
            font-extrabold
            text-white
          ">

            Featured{" "}

            <span className="
              bg-linear-to-r
              from-purple-400
              to-blue-400
              bg-clip-text
              text-transparent
            ">
              Projects
            </span>

          </h2>




          <p className="
            mt-4
            text-gray-400
            text-lg
          ">
            Discover what we are building.
          </p>


        </div>







        <div className="
          grid
          md:grid-cols-3
          gap-8
        ">


          {projects.map((project) => (


            <div

              key={project.name}

              className="
                glass
                card-hover
                p-8
              "

            >



              <div className="
                w-16
                h-16
                rounded-2xl
                bg-white/5
                border
                border-white/10
                flex
                items-center
                justify-center
                text-4xl
              ">
                {project.icon}
              </div>





              <p className="
                mt-6
                text-purple-400
                text-sm
                font-medium
              ">
                {project.type}
              </p>





              <h3 className="
                mt-3
                text-2xl
                font-bold
                text-white
              ">
                {project.name}
              </h3>





              <p className="
                mt-4
                text-gray-400
                leading-relaxed
              ">
                {project.description}
              </p>






              <button

                className="
                  mt-7
                  px-6
                  py-3
                  rounded-xl
                  bg-linear-to-r
                  from-purple-600
                  to-blue-600
                  text-white
                  font-bold
                  hover:scale-105
                  transition
                "

              >
                Learn More

              </button>



            </div>


          ))}


        </div>



      </div>


    </section>

  );

}