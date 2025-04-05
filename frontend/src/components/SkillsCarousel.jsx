import React from 'react';
import Marquee from 'react-fast-marquee';

const skills = [
  { title: "Video Editing", image: "/skills/videoediting.png" },
  { title: "Graphic Design", image: "/skills/graphicdesign.png" },
  { title: "UI/UX Design", image: "/skills/uiux.png" },
  { title: "Tutoring", image: "/skills/tutoring.png" },
  { title: "Web Development", image: "/skills/webdev.png" },
  { title: "Content Writing", image: "/skills/contentwriting.png" },
  { title: "Resume Review", image: "/skills/resumereview.png" },
];

const SkillsCarousel = () => {
  const loopedSkills = [...skills, ...skills];

  return (
    <section className="py-24 bg-white dark:bg-gray-900 w-full">
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white flex justify-center items-center gap-2">
        Explore Peer Skills
      </h2>
      
      <Marquee pauseOnHover speed={50} gradient={false}>
        {loopedSkills.map((skill, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 m-4 flex flex-col items-center w-[250px] h-[320px] justify-between transition-transform duration-300 transform hover:scale-105"
          >
<img
  src={skill.image}
  alt={skill.title}
  className="w-[180px] h-[180px] object-contain rounded-xl outline-none border-none"
/>


            <h3 className="mt-6 text-xl font-semibold text-center text-gray-800 dark:text-white">
              {skill.title}
            </h3>
          </div>
        ))}
      </Marquee>
    </section>
  );
};

export default SkillsCarousel;
