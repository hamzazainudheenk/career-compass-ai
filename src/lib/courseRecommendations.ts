// Mock course recommendations database
// In production, this would come from an API

interface Course {
  title: string;
  provider: string;
  duration: string;
  rating: number;
  url: string;
  level: "Beginner" | "Intermediate" | "Advanced";
}

const courseDatabase: Record<string, Course[]> = {
  "GraphQL": [
    {
      title: "GraphQL with React: The Complete Developers Guide",
      provider: "Udemy",
      duration: "13 hours",
      rating: 4.7,
      url: "https://www.udemy.com/course/graphql-with-react-course/",
      level: "Intermediate",
    },
    {
      title: "GraphQL Fundamentals",
      provider: "Coursera",
      duration: "4 weeks",
      rating: 4.5,
      url: "https://www.coursera.org/learn/graphql",
      level: "Beginner",
    },
  ],
  "AWS": [
    {
      title: "AWS Certified Solutions Architect",
      provider: "AWS Training",
      duration: "40 hours",
      rating: 4.8,
      url: "https://aws.amazon.com/training/",
      level: "Intermediate",
    },
    {
      title: "Ultimate AWS Certified Developer Associate",
      provider: "Udemy",
      duration: "32 hours",
      rating: 4.7,
      url: "https://www.udemy.com/course/aws-certified-developer-associate/",
      level: "Intermediate",
    },
  ],
  "Docker": [
    {
      title: "Docker Mastery: with Kubernetes + Swarm",
      provider: "Udemy",
      duration: "20 hours",
      rating: 4.7,
      url: "https://www.udemy.com/course/docker-mastery/",
      level: "Beginner",
    },
    {
      title: "Docker for Developers",
      provider: "LinkedIn Learning",
      duration: "3 hours",
      rating: 4.5,
      url: "https://www.linkedin.com/learning/docker-for-developers",
      level: "Beginner",
    },
  ],
  "CI/CD": [
    {
      title: "DevOps CI/CD with Jenkins, GitLab & GitHub Actions",
      provider: "Udemy",
      duration: "15 hours",
      rating: 4.6,
      url: "https://www.udemy.com/course/devops-ci-cd/",
      level: "Intermediate",
    },
    {
      title: "GitHub Actions: The Complete Guide",
      provider: "Udemy",
      duration: "10 hours",
      rating: 4.8,
      url: "https://www.udemy.com/course/github-actions/",
      level: "Beginner",
    },
  ],
  "Kubernetes": [
    {
      title: "Kubernetes for the Absolute Beginners",
      provider: "Udemy",
      duration: "6 hours",
      rating: 4.6,
      url: "https://www.udemy.com/course/learn-kubernetes/",
      level: "Beginner",
    },
    {
      title: "Certified Kubernetes Administrator (CKA)",
      provider: "Linux Foundation",
      duration: "30 hours",
      rating: 4.8,
      url: "https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/",
      level: "Advanced",
    },
  ],
  "Python": [
    {
      title: "100 Days of Code: Python Pro Bootcamp",
      provider: "Udemy",
      duration: "60 hours",
      rating: 4.7,
      url: "https://www.udemy.com/course/100-days-of-code/",
      level: "Beginner",
    },
  ],
  "Machine Learning": [
    {
      title: "Machine Learning Specialization",
      provider: "Coursera",
      duration: "3 months",
      rating: 4.9,
      url: "https://www.coursera.org/specializations/machine-learning",
      level: "Intermediate",
    },
  ],
  "Node.js": [
    {
      title: "The Complete Node.js Developer Course",
      provider: "Udemy",
      duration: "35 hours",
      rating: 4.6,
      url: "https://www.udemy.com/course/the-complete-nodejs-developer-course/",
      level: "Beginner",
    },
  ],
  "TypeScript": [
    {
      title: "Understanding TypeScript",
      provider: "Udemy",
      duration: "15 hours",
      rating: 4.7,
      url: "https://www.udemy.com/course/understanding-typescript/",
      level: "Beginner",
    },
  ],
  "React": [
    {
      title: "React - The Complete Guide",
      provider: "Udemy",
      duration: "48 hours",
      rating: 4.7,
      url: "https://www.udemy.com/course/react-the-complete-guide/",
      level: "Beginner",
    },
  ],
};

// Default course for skills not in the database
const getDefaultCourse = (skill: string): Course => ({
  title: `Learn ${skill}: Complete Guide`,
  provider: "Udemy",
  duration: "10+ hours",
  rating: 4.5,
  url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(skill)}`,
  level: "Beginner",
});

export const getCoursesForSkill = (skill: string): Course[] => {
  const courses = courseDatabase[skill];
  if (courses && courses.length > 0) {
    return courses;
  }
  return [getDefaultCourse(skill)];
};

export const getTopCourseForSkill = (skill: string): Course => {
  const courses = getCoursesForSkill(skill);
  return courses[0];
};
