/* ==========================================
   EduBridge - Mock Data & LocalStorage Engine
   ========================================== */

const STORAGE_KEYS = {
  USERS: 'edubridge_users',
  RESOURCES: 'edubridge_resources',
  ASSIGNMENTS: 'edubridge_assignments',
  SUBMISSIONS: 'edubridge_submissions',
  DEPARTMENTS: 'edubridge_departments',
  SUBJECTS: 'edubridge_subjects',
  NOTIFICATIONS: 'edubridge_notifications',
  CURRENT_USER: 'edubridge_current_user'
};

// Initial Mock Seed Data
const DEFAULT_USERS = [
  { id: 'usr_1', name: 'Aarav Sharma', email: 'aarav.student@college.edu', role: 'student', department: 'Computer Science', semester: 'Sem 5', avatar: 'AS', status: 'active' },
  { id: 'usr_2', name: 'Ananya Verma', email: 'ananya.student@college.edu', role: 'student', department: 'Computer Science', semester: 'Sem 5', avatar: 'AV', status: 'active' },
  { id: 'usr_3', name: 'Rohan Gupta', email: 'rohan.student@college.edu', role: 'student', department: 'Information Technology', semester: 'Sem 3', avatar: 'RG', status: 'active' },
  { id: 'usr_4', name: 'Priya Patel', email: 'priya.student@college.edu', role: 'student', department: 'Computer Science', semester: 'Sem 5', avatar: 'PP', status: 'active' },
  { id: 'usr_5', name: 'Kabir Mehta', email: 'kabir.student@college.edu', role: 'student', department: 'Applications (BCA)', semester: 'Sem 1', avatar: 'KM', status: 'active' },

  { id: 'usr_10', name: 'Dr. Suresh Kumar', email: 'suresh.teacher@college.edu', role: 'teacher', department: 'Computer Science', semester: '', avatar: 'SK', status: 'active' },
  { id: 'usr_11', name: 'Prof. Meenakshi Rai', email: 'meenakshi.teacher@college.edu', role: 'teacher', roleTitle: 'Associate Professor', department: 'Applications (BCA)', semester: '', avatar: 'MR', status: 'active' },
  { id: 'usr_12', name: 'Prof. Vikram Malhotra', email: 'vikram.teacher@college.edu', role: 'teacher', roleTitle: 'Assistant Professor', department: 'Information Technology', semester: '', avatar: 'VM', status: 'active' },

  { id: 'usr_99', name: 'System Admin', email: 'admin@college.edu', role: 'admin', department: 'Central IT', semester: '', avatar: 'SA', status: 'active' }
];

const DEFAULT_DEPARTMENTS = ['Computer Science', 'Applications (BCA)', 'Information Technology', 'Software Engineering'];

const DEFAULT_SUBJECTS = [
  { id: 'sub_1', code: 'CS501', name: 'Python Programming', department: 'Computer Science', semester: 'Sem 5', teacher: 'Dr. Suresh Kumar' },
  { id: 'sub_2', code: 'CS502', name: 'Web Technology', department: 'Computer Science', semester: 'Sem 5', teacher: 'Prof. Meenakshi Rai' },
  { id: 'sub_3', code: 'CS503', name: 'Software Engineering', department: 'Computer Science', semester: 'Sem 5', teacher: 'Prof. Vikram Malhotra' },
  { id: 'sub_4', code: 'IT301', name: 'Database Management Systems', department: 'Information Technology', semester: 'Sem 3', teacher: 'Dr. Suresh Kumar' },
  { id: 'sub_5', code: 'BCA101', name: 'Computer Fundamentals & C', department: 'Applications (BCA)', semester: 'Sem 1', teacher: 'Prof. Meenakshi Rai' }
];

const DEFAULT_RESOURCES = [
  {
    id: 'res_1',
    title: 'Python Object-Oriented Programming Complete Notes',
    description: 'Comprehensive notes covering classes, inheritance, polymorphism, and decorators with code samples.',
    department: 'Computer Science',
    semester: 'Sem 5',
    subject: 'Python Programming',
    type: 'Notes',
    fileType: 'pdf',
    fileName: 'Python_OOP_Complete_Notes.pdf',
    fileSize: '3.4 MB',
    teacher: 'Dr. Suresh Kumar',
    uploadDate: '2026-09-15',
    status: 'Approved'
  },
  {
    id: 'res_2',
    title: 'Web Technology Semester V Previous Year Question Paper (2025)',
    description: 'Official university question paper for Web Tech including HTML5, CSS3, DOM manipulation, and PHP.',
    department: 'Computer Science',
    semester: 'Sem 5',
    subject: 'Web Technology',
    type: 'Question Papers',
    fileType: 'pdf',
    fileName: 'WebTech_QP_2025_Final.pdf',
    fileSize: '1.8 MB',
    teacher: 'Prof. Meenakshi Rai',
    uploadDate: '2026-09-18',
    status: 'Approved'
  },
  {
    id: 'res_3',
    title: 'Software Development Life Cycle & Agile Methodology Slides',
    description: 'Lecture slides explaining Waterfall, Agile, Scrum ceremonies, and UML diagram specifications.',
    department: 'Computer Science',
    semester: 'Sem 5',
    subject: 'Software Engineering',
    type: 'Study Materials',
    fileType: 'docx',
    fileName: 'Agile_SDLC_Lecture_Slides.docx',
    fileSize: '4.2 MB',
    teacher: 'Prof. Vikram Malhotra',
    uploadDate: '2026-09-20',
    status: 'Approved'
  },
  {
    id: 'res_4',
    title: 'Relational Algebra & Normalization (1NF to 5NF) Guide',
    description: 'Step by step examples resolving database normalization dependencies and ER diagram mapping.',
    department: 'Information Technology',
    semester: 'Sem 3',
    subject: 'Database Management Systems',
    type: 'Notes',
    fileType: 'pdf',
    fileName: 'DBMS_Normalization_Guide.pdf',
    fileSize: '2.9 MB',
    teacher: 'Dr. Suresh Kumar',
    uploadDate: '2026-09-22',
    status: 'Approved'
  },
  {
    id: 'res_5',
    title: 'C Language Arrays, Pointers, and Memory Allocation Handbook',
    description: 'Beginner-friendly study material on dynamic memory management (malloc, calloc, free).',
    department: 'Applications (BCA)',
    semester: 'Sem 1',
    subject: 'Computer Fundamentals & C',
    type: 'Study Materials',
    fileType: 'pdf',
    fileName: 'C_Pointers_Memory_Handbook.pdf',
    fileSize: '2.1 MB',
    teacher: 'Prof. Meenakshi Rai',
    uploadDate: '2026-09-24',
    status: 'Approved'
  },
  {
    id: 'res_6',
    title: 'Python Data Structures & Algorithm Complexity Cheat Sheet',
    description: 'Quick reference sheet for Big-O notation, lists, dictionaries, stacks, queues, and binary search.',
    department: 'Computer Science',
    semester: 'Sem 5',
    subject: 'Python Programming',
    type: 'Study Materials',
    fileType: 'pdf',
    fileName: 'Python_DSA_Cheatsheet.pdf',
    fileSize: '1.2 MB',
    teacher: 'Dr. Suresh Kumar',
    uploadDate: '2026-09-25',
    status: 'Approved'
  },
  {
    id: 'res_7',
    title: 'SQL Query Optimization & Indexing Lab Manual',
    description: 'Hands-on lab exercises for creating B-Tree indexes, analyzing query execution plans, and joins.',
    department: 'Information Technology',
    semester: 'Sem 3',
    subject: 'Database Management Systems',
    type: 'Notes',
    fileType: 'pdf',
    fileName: 'SQL_Lab_Manual_2026.pdf',
    fileSize: '3.1 MB',
    teacher: 'Dr. Suresh Kumar',
    uploadDate: '2026-09-26',
    status: 'Approved'
  },
  {
    id: 'res_8',
    title: 'Software Engineering Model Question Paper 2026',
    description: 'Sample practice paper with solutions for mid-semester exam prep.',
    department: 'Computer Science',
    semester: 'Sem 5',
    subject: 'Software Engineering',
    type: 'Question Papers',
    fileType: 'pdf',
    fileName: 'SE_Model_Paper_2026.pdf',
    fileSize: '1.5 MB',
    teacher: 'Prof. Vikram Malhotra',
    uploadDate: '2026-09-27',
    status: 'Pending'
  },
  {
    id: 'res_9',
    title: 'CSS Flexbox and Grid Layout Mastery Notes',
    description: 'Practical code snippets and visual diagrams demonstrating responsive web layouts.',
    department: 'Computer Science',
    semester: 'Sem 5',
    subject: 'Web Technology',
    type: 'Notes',
    fileType: 'pdf',
    fileName: 'CSS_Flex_Grid_Guide.pdf',
    fileSize: '2.4 MB',
    teacher: 'Prof. Meenakshi Rai',
    uploadDate: '2026-09-28',
    status: 'Approved'
  },
  {
    id: 'res_10',
    title: 'PHP & MySQL Form Handling Security Handout',
    description: 'Best practices preventing SQL injection and XSS through parameterized queries and input sanitization.',
    department: 'Computer Science',
    semester: 'Sem 5',
    subject: 'Web Technology',
    type: 'Notes',
    fileType: 'pdf',
    fileName: 'PHP_Security_BestPractices.pdf',
    fileSize: '2.0 MB',
    teacher: 'Prof. Meenakshi Rai',
    uploadDate: '2026-09-29',
    status: 'Pending'
  }
];

const DEFAULT_ASSIGNMENTS = [
  {
    id: 'asg_1',
    title: 'Assignment 1: Mini Web Application using Vanilla JavaScript',
    description: 'Build a responsive single page mini app featuring dynamic DOM filtering, event handling, and custom CSS styling.',
    department: 'Computer Science',
    semester: 'Sem 5',
    subject: 'Web Technology',
    teacher: 'Prof. Meenakshi Rai',
    postedDate: '2026-09-20',
    deadline: '2026-10-10',
    maxMarks: 50,
    attachment: 'WebTech_Assignment_1_Spec.pdf',
    status: 'Active'
  },
  {
    id: 'asg_2',
    title: 'Assignment 2: Python Data Processing Script with File I/O',
    description: 'Write a Python script that reads CSV dataset files, cleans missing values, and generates statistical summary outputs.',
    department: 'Computer Science',
    semester: 'Sem 5',
    subject: 'Python Programming',
    teacher: 'Dr. Suresh Kumar',
    postedDate: '2026-09-22',
    deadline: '2026-10-05',
    maxMarks: 40,
    attachment: 'Python_Data_Processing_Task.pdf',
    status: 'Active'
  },
  {
    id: 'asg_3',
    title: 'Assignment 3: SRS Document & UML Use Case Diagrams',
    description: 'Prepare a complete Software Requirement Specification document for a College Library Portal including Use Case diagrams.',
    department: 'Computer Science',
    semester: 'Sem 5',
    subject: 'Software Engineering',
    teacher: 'Prof. Vikram Malhotra',
    postedDate: '2026-09-18',
    deadline: '2026-09-29',
    maxMarks: 50,
    attachment: 'SRS_Template_Guide.pdf',
    status: 'Completed'
  },
  {
    id: 'asg_4',
    title: 'Assignment 1: Relational Schema & Normalization Exercises',
    description: 'Convert given unnormalized tables into 3NF schema diagrams and write corresponding SQL DDL queries.',
    department: 'Information Technology',
    semester: 'Sem 3',
    subject: 'Database Management Systems',
    teacher: 'Dr. Suresh Kumar',
    postedDate: '2026-09-15',
    deadline: '2026-10-02',
    maxMarks: 30,
    attachment: 'DBMS_Normalization_Task.pdf',
    status: 'Active'
  },
  {
    id: 'asg_5',
    title: 'Assignment 1: C Programming Control Flow & Array Logic',
    description: 'Solve 5 programming problems utilizing nested loops, 2D arrays, and recursion.',
    department: 'Applications (BCA)',
    semester: 'Sem 1',
    subject: 'Computer Fundamentals & C',
    teacher: 'Prof. Meenakshi Rai',
    postedDate: '2026-09-25',
    deadline: '2026-10-15',
    maxMarks: 50,
    attachment: 'C_Basics_Homework.pdf',
    status: 'Active'
  },
  {
    id: 'asg_6',
    title: 'Assignment 2: Object Oriented Python Bank Account Class',
    description: 'Implement a BankAccount class hierarchy with methods for deposit, withdrawal, interest calculation, and exception handling.',
    department: 'Computer Science',
    semester: 'Sem 5',
    subject: 'Python Programming',
    teacher: 'Dr. Suresh Kumar',
    postedDate: '2026-09-28',
    deadline: '2026-10-18',
    maxMarks: 40,
    attachment: 'Python_OOP_Bank_Task.pdf',
    status: 'Active'
  }
];

const DEFAULT_SUBMISSIONS = [
  {
    id: 'subm_1',
    assignmentId: 'asg_1',
    assignmentTitle: 'Assignment 1: Mini Web Application using Vanilla JavaScript',
    studentId: 'usr_1',
    studentName: 'Aarav Sharma',
    subject: 'Web Technology',
    submittedDate: '2026-09-28 14:30',
    fileName: 'Aarav_Sharma_WebTech_App.zip',
    fileType: 'zip',
    comments: 'Included CSS animations and dynamic search implementation.',
    status: 'Graded',
    gradeMarks: 48,
    maxMarks: 50,
    feedback: 'Excellent work! Great UI component structure and clean Javascript modularization.',
    evalDate: '2026-09-29'
  },
  {
    id: 'subm_2',
    assignmentId: 'asg_2',
    assignmentTitle: 'Assignment 2: Python Data Processing Script with File I/O',
    studentId: 'usr_1',
    studentName: 'Aarav Sharma',
    subject: 'Python Programming',
    submittedDate: '2026-09-29 11:15',
    fileName: 'Aarav_Python_Data_Processor.py',
    fileType: 'py',
    comments: 'Tested with sample CSV dataset provided.',
    status: 'Submitted',
    gradeMarks: null,
    maxMarks: 40,
    feedback: '',
    evalDate: ''
  },
  {
    id: 'subm_3',
    assignmentId: 'asg_3',
    assignmentTitle: 'Assignment 3: SRS Document & UML Use Case Diagrams',
    studentId: 'usr_1',
    studentName: 'Aarav Sharma',
    subject: 'Software Engineering',
    submittedDate: '2026-09-25 18:00',
    fileName: 'Aarav_Library_SRS_Document.pdf',
    fileType: 'pdf',
    comments: 'Attached high-res Use Case & Activity diagrams.',
    status: 'Graded',
    gradeMarks: 45,
    maxMarks: 50,
    feedback: 'Comprehensive SRS document. Well documented functional requirements.',
    evalDate: '2026-09-27'
  },
  {
    id: 'subm_4',
    assignmentId: 'asg_1',
    assignmentTitle: 'Assignment 1: Mini Web Application using Vanilla JavaScript',
    studentId: 'usr_2',
    studentName: 'Ananya Verma',
    subject: 'Web Technology',
    submittedDate: '2026-09-29 16:45',
    fileName: 'Ananya_Verma_JS_Project.pdf',
    fileType: 'pdf',
    comments: 'Submitted source code listings and screenshot walkthrough.',
    status: 'Submitted',
    gradeMarks: null,
    maxMarks: 50,
    feedback: '',
    evalDate: ''
  },
  {
    id: 'subm_5',
    assignmentId: 'asg_4',
    assignmentTitle: 'Assignment 1: Relational Schema & Normalization Exercises',
    studentId: 'usr_3',
    studentName: 'Rohan Gupta',
    subject: 'Database Management Systems',
    submittedDate: '2026-09-27 10:20',
    fileName: 'Rohan_DBMS_Assignment1.docx',
    fileType: 'docx',
    comments: 'Resolved all 5 normalization case studies.',
    status: 'Graded',
    gradeMarks: 27,
    maxMarks: 30,
    feedback: 'Very accurate schema decomposition and neat ER diagram.',
    evalDate: '2026-09-28'
  }
];

const DEFAULT_NOTIFICATIONS = [
  { id: 'notif_1', title: 'New Note Uploaded', text: 'Prof. Meenakshi Rai uploaded "CSS Flexbox and Grid Layout Notes"', time: '10 mins ago', read: false },
  { id: 'notif_2', title: 'Grade Published', text: 'Your submission for Assignment 1 (Web Tech) has been graded: 48/50', time: '1 hour ago', read: false },
  { id: 'notif_3', title: 'Assignment Reminder', text: 'Python Data Processing Script assignment deadline is in 5 days', time: '1 day ago', read: true }
];

// Initialize LocalStorage Data Store
function initStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RESOURCES)) {
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(DEFAULT_RESOURCES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS)) {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(DEFAULT_ASSIGNMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(DEFAULT_SUBMISSIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DEPARTMENTS)) {
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(DEFAULT_DEPARTMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SUBJECTS)) {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(DEFAULT_SUBJECTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(DEFAULT_NOTIFICATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    // Default logged in demo user: Aarav Sharma (Student)
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS[0]));
  }
}

// Data Access API Service Layer
window.EduBridgeData = {
  init: initStorage,
  
  // Current Session User
  getCurrentUser: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null'),
  setCurrentUser: (user) => localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user)),

  // Users
  getUsers: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'),
  addUser: (user) => {
    const users = EduBridgeData.getUsers();
    user.id = 'usr_' + Date.now();
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return user;
  },
  updateUserStatus: (id, status) => {
    const users = EduBridgeData.getUsers();
    const u = users.find(x => x.id === id);
    if (u) {
      u.status = status;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
  },
  deleteUser: (id) => {
    let users = EduBridgeData.getUsers();
    users = users.filter(x => x.id !== id);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  // Resources
  getResources: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.RESOURCES) || '[]'),
  addResource: (res) => {
    const list = EduBridgeData.getResources();
    res.id = 'res_' + Date.now();
    res.uploadDate = new Date().toISOString().split('T')[0];
    res.status = res.status || 'Pending';
    list.unshift(res);
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(list));
    return res;
  },
  updateResourceStatus: (id, status) => {
    const list = EduBridgeData.getResources();
    const item = list.find(x => x.id === id);
    if (item) {
      item.status = status;
      localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(list));
    }
  },
  deleteResource: (id) => {
    let list = EduBridgeData.getResources();
    list = list.filter(x => x.id !== id);
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(list));
  },

  // Assignments
  getAssignments: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS) || '[]'),
  addAssignment: (asg) => {
    const list = EduBridgeData.getAssignments();
    asg.id = 'asg_' + Date.now();
    asg.postedDate = new Date().toISOString().split('T')[0];
    asg.status = 'Active';
    list.unshift(asg);
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(list));
    return asg;
  },
  deleteAssignment: (id) => {
    let list = EduBridgeData.getAssignments();
    list = list.filter(x => x.id !== id);
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(list));
  },

  // Submissions & Grading
  getSubmissions: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBMISSIONS) || '[]'),
  addSubmission: (subm) => {
    const list = EduBridgeData.getSubmissions();
    subm.id = 'subm_' + Date.now();
    const d = new Date();
    subm.submittedDate = `${d.toISOString().split('T')[0]} ${d.toTimeString().split(' ')[0].substring(0, 5)}`;
    subm.status = 'Submitted';
    subm.gradeMarks = null;
    list.unshift(subm);
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(list));
    return subm;
  },
  saveGrade: (submissionId, gradeMarks, feedback) => {
    const list = EduBridgeData.getSubmissions();
    const subm = list.find(x => x.id === submissionId);
    if (subm) {
      subm.gradeMarks = parseInt(gradeMarks, 10);
      subm.feedback = feedback;
      subm.status = 'Graded';
      subm.evalDate = new Date().toISOString().split('T')[0];
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(list));
    }
  },

  // Departments & Subjects
  getDepartments: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.DEPARTMENTS) || '[]'),
  getSubjects: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBJECTS) || '[]'),
  addSubject: (subj) => {
    const list = EduBridgeData.getSubjects();
    subj.id = 'sub_' + Date.now();
    list.push(subj);
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(list));
    return subj;
  },
  deleteSubject: (id) => {
    let list = EduBridgeData.getSubjects();
    list = list.filter(x => x.id !== id);
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(list));
  },

  // Notifications
  getNotifications: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]'),
  markNotificationsRead: () => {
    const list = EduBridgeData.getNotifications();
    list.forEach(n => n.read = true);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  }
};

// Auto initialize on load
EduBridgeData.init();
