type Course = {
    name: string;
    description: string;
};

type Category = {
    title: string;
    courses: Course[];
};

const categories: Category[] = [
    {
      title: 'Cyber Security',
      courses: [
        { name: 'COMP6843: Web Application Security & Testing (Extended)', description: 'Lorem ipsum dolor sit amet,' },
        { name: 'COMP6845: Digital Forensics (Extended)', description: 'Lorem ipsum dolor sit amet,' },
        { name: 'COMP6447: System and Software Security Assessment', description: 'Lorem ipsum dolor sit amet,' },
        { name: 'COMP6448: Cloud Security Fundamentals', description: 'Study of techniques for secure communication.' },
        { name: 'COMP6841: Security Engineering & Cyber Security (Extended)', description: 'Lorem ipsum dolor sit amet,' },
      ]
    },
    {
      title: 'Systems and Architecture',
      courses: [
        { name: 'COMP3891: Operating Systems (Extended)', description: 'Lorem ipsum dolor sit amet,' },
        { name: 'COMP3331: Computer Networks & Applications', description: 'Lorem ipsum dolor sit amet,' },
        { name: 'COMP2041: Software Construction: Techniques and Tools', description: 'Lorem ipsum dolor sit amet, .'},
        { name: 'COMP1521: Computer Systems Fundamentals', description: 'Lorem ipsum dolor sit amet, .'},
      ]
    },
    {
      title: 'Software Development',
      courses: [
        { name: 'COMP4128: Programming Challenges', description: 'Lorem ipsum dolor sit amet, .' },
        { name: 'COMP3821: Algorithms and Programming Techniques (Extended)', description: 'Lorem ipsum dolor sit amet, .' },
        { name: 'COMP3311: Database Systems', description: 'Lorem ipsum dolor sit amet,' },
        { name: 'COMP2511: Object-Oriented Design & Programming', description: 'Lorem ipsum dolor sit amet,' },
        { name: 'COMP6991: Solving Modern Programming Problems with Rust', description: 'Lorem ipsum dolor sit amet,' },
        { name: 'COMP2521: Data Structures and Algorithms', description: 'Lorem ipsum dolor sit amet, .' },
      ]
    },
];

export default categories;