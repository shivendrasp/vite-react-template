// import { useEffect } from "react";
import { useMouseEnter } from "../../hooks/useMouseEnter";
import { motion } from "motion/react";

const candidates = [
  {
    image:
      "https://images.unsplash.com/photo-1778392099969-e1799d7dd4ea?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    desc:
      "Frontend developer passionate about creating seamless user experiences and modern interfaces with React and Tailwind CSS.",
    skills: [
      "React", "JavaScript", "TypeScript", "Tailwind CSS", "HTML", "CSS",
      "Redux", "Figma", "Responsive Design", "Next.js"
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1576110598658-096ae24cdb97?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    desc:
      "Data scientist exploring machine learning algorithms, predictive analytics, and big data solutions for complex challenges.",
    skills: [
      "Python", "Pandas", "NumPy", "TensorFlow", "Data Analysis", "Machine Learning",
      "Scikit-learn", "Jupyter", "SQL", "Deep Learning"
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1657225704825-0932c7242b93?q=80&w=927&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    desc:
      "Mobile app developer specializing in high-performance cross-platform apps, focusing on intuitive design and usability.",
    skills: [
      "Flutter", "Dart", "UI/UX", "Firebase", "REST APIs",
      "Android", "iOS", "Provider", "Bloc", "Redux", "Figma"
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1631563129265-82c94bd797cf?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    desc:
      "DevOps engineer automating infrastructure deployments, monitoring systems, and ensuring continuous integration pipelines run smoothly.",
    skills: [
      "AWS", "Docker", "Kubernetes", "CI/CD", "Terraform",
      "Ansible", "Linux", "Jenkins", "Prometheus", "Grafana", "Helm"
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1778546978871-c7705e7386d8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    desc:
      "Backend developer architecting scalable APIs and server-side logic for robust web applications and cloud platforms.",
    skills: [
      "Node.js", "Express", "MongoDB", "SQL", "API Design",
      "PostgreSQL", "Microservices", "Redis", "Auth", "Docker", "TypeScript"
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1572725372849-c2106fe3db35?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    desc:
      "Full-stack engineer building maintainable applications, bridging the gap between frontend and backend with modern web technologies.",
    skills: [
      "JavaScript", "TypeScript", "React", "Node.js", "GraphQL",
      "Next.js", "MongoDB", "Redux", "REST", "Testing", "Git", "Jest"
    ],
  },
];

const Candidates = () => {
  // useEffect(() => {
  // let scrollTimeOut = setTimeout(() => {
  //   window.scrollTo({
  //     top: document.body.scrollHeight,
  //     behavior: 'smooth'
  //   });
  // }, 2000) 
  // return () => clearTimeout(scrollTimeOut);
  // }, [])

  return (
    <section className="w-full min-h-screen bg-[#babaff] grid grid-cols-2 gap-2 p-4">
      {candidates.map((candidate, id) => (
        <ProfileCard
          key={id}
          image={candidate.image}
          desc={candidate.desc}
          skills={candidate.skills}
          offset={id * 0.1}
        />
      ))}
    </section>
  );
};

const ProfileCard = ({ image, desc, skills, offset }) => {
  return (
    <motion.div
      initial={{ y: 42, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut", delay: offset + 1 }}
      className="w-full bg-[#ebebff] flex flex-col items-start rounded-xl overflow-hidden cursor-default"
    >
      <div className="w-full h-60 flex items-center justify-center overflow-hidden bg-pink-400">
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={image}
            alt="pp"
            className="w-full h-full object-cover"
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        </div>
      </div>
      <div className="flex flex-col items-start p-2 mt-1">
        <p className="text-[blue] text-[14px] font-medium">
          {desc.length > 80 ? desc.slice(0, 80) + "..." : desc}
        </p>

        <div className="flex flex-wrap gap-0.5 mt-4">
          {skills.map((skill, id) => {
            return <Skill skill={skill} key={id} delay={id * 0.04} />;
          })}
        </div>
      </div>
    </motion.div>
  );
};

const Skill = (props) => {
  const [ref, mouseIn] = useMouseEnter();

  return (
    <motion.div
      initial={{ scale: 0, filter: "blur(16px)", y: 4 }}
      animate={{ scale: 1, filter: "blur(0px)", y: 0 }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
        delay: props.delay + 1.8,
      }}
      className="px-1.5 h-[20px] inline-flex items-center justify-center rounded-full text-[12px] cursor-default"
      style={{ background: mouseIn ? "black" : "blue" }}
      ref={ref}
    >
      {props.skill}
    </motion.div>
  );
};
export default Candidates;
