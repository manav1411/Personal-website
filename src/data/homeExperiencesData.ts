type Experience = {
    title: string;
    year: string;
    details: string[];
  };
  
  const experiences: Experience[] = [
    {
      title: 'Trimmer – Contract Development',
      year: '2024',
      details: [
        'Helped build an MVP google-calendar integrated tool to improve task management and scheduling.',
        'I worked on the frontend and backend, using Supabase, Next.js, and Tailwind to build the applicaiton.',
      ],
    },
    {
      title: 'GreenCollar – Software Engineer Internship',
      year: '2023',
      details: [
        'I developed a tool that automates imagery acquisition, by interfacing with external APIs.',
        'My Python and React application reduced the data collection process by up to 40%.',
      ],
    },
  ];

export default experiences;