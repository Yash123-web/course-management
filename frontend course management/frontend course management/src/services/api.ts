import { Course, CourseInstance, CreateCourseData, CreateInstanceData } from '../types/course';

const API_BASE = 'http://localhost:8080/api';

// Mock data for demonstration - replace with actual API calls
const mockCourses: Course[] = [
  {
    id: 'CS101',
    title: 'Introduction to Computer Programming',
    description: 'This course provides a basic introduction to Computer Programming using Python. Students will learn fundamental programming concepts, data structures, and problem-solving techniques.',
    prerequisites: []
  },
  {
    id: 'CS201',
    title: 'Data Structures and Algorithms',
    description: 'Advanced programming concepts including data structures, algorithms, and complexity analysis. Students will implement various data structures and learn algorithmic problem-solving.',
    prerequisites: ['CS101']
  },
  {
    id: 'CS301',
    title: 'Database Systems',
    description: 'Introduction to database design, SQL, and database management systems. Covers relational database theory, normalization, and practical database implementation.',
    prerequisites: ['CS101', 'CS201']
  },
  {
    id: 'MATH101',
    title: 'Calculus I',
    description: 'Introduction to differential and integral calculus. Covers limits, derivatives, and basic integration techniques with applications.',
    prerequisites: []
  },
  {
    id: 'MATH201',
    title: 'Linear Algebra',
    description: 'Vector spaces, matrices, linear transformations, and eigenvalues. Essential mathematical foundation for computer science and engineering.',
    prerequisites: ['MATH101']
  }
];

const mockInstances: CourseInstance[] = [
  { id: '1', courseId: 'CS101', year: 2024, semester: 1 },
  { id: '2', courseId: 'CS201', year: 2024, semester: 1 },
  { id: '3', courseId: 'CS101', year: 2024, semester: 2 },
  { id: '4', courseId: 'CS301', year: 2025, semester: 1 },
  { id: '5', courseId: 'MATH101', year: 2024, semester: 1 },
  { id: '6', courseId: 'MATH201', year: 2024, semester: 2 },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const courseApi = {
  async getAllCourses(): Promise<Course[]> {
    await delay(500);
    return [...mockCourses];
  },

  async getCourse(id: string): Promise<Course | null> {
    await delay(300);
    return mockCourses.find(course => course.id === id) || null;
  },

  async createCourse(data: CreateCourseData): Promise<Course> {
    await delay(800);
    
    // Validate prerequisites exist
    const invalidPrereqs = data.prerequisites.filter(
      prereq => !mockCourses.find(course => course.id === prereq)
    );
    
    if (invalidPrereqs.length > 0) {
      throw new Error(`Invalid prerequisites: ${invalidPrereqs.join(', ')}. These courses do not exist in the system.`);
    }

    // Check if course ID already exists
    if (mockCourses.find(course => course.id === data.id)) {
      throw new Error(`Course with ID ${data.id} already exists. Please choose a different course ID.`);
    }

    const newCourse: Course = { ...data };
    mockCourses.push(newCourse);
    return newCourse;
  },

  async deleteCourse(id: string): Promise<void> {
    await delay(500);
    
    // Check if course is a prerequisite for other courses
    const dependentCourses = mockCourses.filter(course => 
      course.prerequisites.includes(id)
    );
    
    if (dependentCourses.length > 0) {
      throw new Error(`Cannot delete course ${id}. It is a prerequisite for the following courses: ${dependentCourses.map(c => c.id).join(', ')}. Please remove this course as a prerequisite from these courses first.`);
    }

    const index = mockCourses.findIndex(course => course.id === id);
    if (index === -1) {
      throw new Error(`Course with ID ${id} not found`);
    }
    
    mockCourses.splice(index, 1);
  }
};

export const instanceApi = {
  async getAllInstances(): Promise<CourseInstance[]> {
    await delay(500);
    return mockInstances.map(instance => ({
      ...instance,
      course: mockCourses.find(course => course.id === instance.courseId)
    }));
  },

  async getInstancesByYearAndSemester(year: number, semester: number): Promise<CourseInstance[]> {
    await delay(400);
    return mockInstances
      .filter(instance => instance.year === year && instance.semester === semester)
      .map(instance => ({
        ...instance,
        course: mockCourses.find(course => course.id === instance.courseId)
      }));
  },

  async getInstance(year: number, semester: number, courseId: string): Promise<CourseInstance | null> {
    await delay(300);
    const instance = mockInstances.find(
      inst => inst.year === year && inst.semester === semester && inst.courseId === courseId
    );
    
    if (!instance) return null;
    
    return {
      ...instance,
      course: mockCourses.find(course => course.id === instance.courseId)
    };
  },

  async createInstance(data: CreateInstanceData): Promise<CourseInstance> {
    await delay(600);
    
    // Check if course exists
    const course = mockCourses.find(course => course.id === data.courseId);
    if (!course) {
      throw new Error(`Course with ID ${data.courseId} does not exist. Please select a valid course.`);
    }

    // Check if instance already exists
    const existingInstance = mockInstances.find(
      inst => inst.courseId === data.courseId && inst.year === data.year && inst.semester === data.semester
    );
    
    if (existingInstance) {
      throw new Error(`Course instance already exists for ${data.courseId} in ${data.year} semester ${data.semester}. Each course can only be scheduled once per semester.`);
    }

    const newInstance: CourseInstance = {
      id: Date.now().toString(),
      ...data,
      course
    };
    
    mockInstances.push(newInstance);
    return newInstance;
  },

  async deleteInstance(year: number, semester: number, courseId: string): Promise<void> {
    await delay(500);
    
    const index = mockInstances.findIndex(
      inst => inst.year === year && inst.semester === semester && inst.courseId === courseId
    );
    
    if (index === -1) {
      throw new Error(`Instance not found for course ${courseId} in ${year} semester ${semester}`);
    }
    
    mockInstances.splice(index, 1);
  }
};