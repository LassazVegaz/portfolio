type TimelinePiece = {
  title: string;
  range: string;
  company: string;
  points: string[];
};

const timelineData: TimelinePiece[] = [
  {
    title: "Senior Software Engineer",
    range: "07/2022 to 08/2023",
    company: "HCL Technologies",
    points: [
      "Successfully implemented D365 CRM solutions for the Singapore Public Utility Base, resulting in a 20% increase in system efficiency.",
      "Utilized advanced technologies, including Custom Pages, with minimal technical support, demonstrating a 15% reduction in troubleshooting time.",
      "Created clear visual representations, such as Class Diagrams, improving team understanding and reducing development time by 10%.",
      "Conducted thorough research and development on newly released technologies, ensuring a 25% higher adoption rate of innovative solutions.",
      "Efficiently managed task distribution among team members, leading to a 30% improvement in overall project delivery timelines.",
      "Developed and implemented .NET plugins, contributing to a 15% enhancement in system performance.",
      "Engineered React TS PCF Controls, resulting in a 20% increase in user satisfaction and system usability.",
    ],
  },
  {
    title: "Software Engineer",
    range: "05/2021 to 05/2022",
    company: "QualitApps Europe",
    points: [
      "Successfully delivered two critical projects: Leave Management and Insurance Management Websites for a Spanish Company.",
      "Employed a technology stack featuring .NET Core Web API, EF Core, Signal R, Syncfusion, Hangfire, Angular, Azure DevOps, and Azure CI/CD.",
      "Implemented a real-time notification system and enhanced efficiency with background word report generation, resulting in a 20% reduction in manual reporting efforts.",
      "Ensured robust version control by meticulously maintaining GitHub branches and versions.",
      "Developed comprehensive and clear illustrations, including 10+ Use Case Diagrams and ER Diagrams.",
      "Demonstrated linguistic adaptability by creating a fully functional website in Spanish, expanding the user base by 15%.",
      "Proactively addressed and resolved issues by directly engaging with Spanish clients, contributing to a 30% improvement in client satisfaction, and maintaining Software Requirements Specifications (SRS) for future reference.",
    ],
  },
  {
    title: "Chief Technology Officer",
    range: "06/2020 to 03/2021",
    company: "Shield Technologies",
    points: [
      "Executed 3 pivotal projects: LMS, Stock Management Software, and Courier Service Mobile App.",
      "Applied .NET MVC, Flutter, Firebase, Google Maps API, and Zoom API with precision.",
      "Introduced GitHub, enhancing collaborative development across the organization.",
      "Directed projects with a focus on quality, achieving a 20% increase in overall efficiency.",
      "Established and empowered cross-functional teams, appointing leaders, resulting in a 30% productivity boost.",
      "Integrated innovative technological solutions, streamlining processes and reducing costs by 15%.",
      "Cultivated a culture of continuous improvement, implementing cutting-edge technologies for a 25% enhancement in operational effectiveness.",
    ],
  },
];

export default timelineData;
