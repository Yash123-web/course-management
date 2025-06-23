export interface Course {
  id: string;
  title: string;
  description: string;
  prerequisites: string[];
}

export interface CourseInstance {
  id: string;
  courseId: string;
  year: number;
  semester: number;
  course?: Course;
}

export interface CreateCourseData {
  id: string;
  title: string;
  description: string;
  prerequisites: string[];
}

export interface CreateInstanceData {
  courseId: string;
  year: number;
  semester: number;
}