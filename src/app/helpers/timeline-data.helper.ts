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
      "A MS Dynamics 365 project for Singapore Public Utility Base.",
      "Led the team from the PCFs side.",
      "Cooperated in project architecture (ERD, Use Case Diagrams, etc.)",
      "Conducted research on PCF usage and introduced it to the team.",
      "Distributed tasks between fellow team members.",
      "Technologies: .NET Plugins, React, TypeScript, PCF",
    ],
  },
  {
    title: "Software Engineer",
    range: "05/2021 to 05/2022",
    company: "QualitApps Europe",
    points: [
      "A multi-language large scale leave management system for a European multi-organization.",
      "Worked close to the clients.",
      "Worked with Azure DevOps including CI/CD.",
      "Implemented a real-time notification system using SignalR.",
      "Implemented a background report generation module using SyncFusion and Hangfire.",
      "Had a thorough knowledge about the whole project.",
      "Contributed to project architecture (ERD, Use Case Diagrams).",
      "Technologies: .NET, Angular",
    ],
  },
  {
    title: "Chief Technology Officer",
    range: "06/2020 to 03/2021",
    company: "Shield Technologies",
    points: [
      "A courier service mobile application with a distributed system.",
      "A dating web app with a subscription system.",
      "Researched and introduced GitHub to the organization.",
      "Formed teams and trained team leads.",
      "Worked close to the clients.",
      "Technologies: .NET, Flutter, React, PHP, Java",
    ],
  },
];

export default timelineData;
