// 📦 Types — shared interfaces across the entire app

export interface User {
  _id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  userRole: "student" | "recruiter";
  userProfile: {
    userBio?: string;
    userSkills?: string[];
    userResume?: string;
    userResumeName?: string;
    userProfilePic?: string;
    userCompany?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  _id: string;
  companyName: string;
  companyDescription?: string;
  companyWebsite?: string;
  companyLogo?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  _id: string;
  title: string;
  description: string;
  requirements: string[];
  salary: number;
  location: string;
  jobType: string;
  numberOfPositions: number;
  company: Company;
  createdBy: string;
  applications: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  _id: string;
  job: Job;
  applicant: User;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}

// ─── Auth ────────────────────────────────────────────────
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  role: "student" | "recruiter" | null;
}

// ─── API Response wrappers ───────────────────────────────
export interface ApiResponse<T> {
  message: string;
  success: boolean;
  data?: T;
}

// ─── UI State ────────────────────────────────────────────
export interface UiState {
  sidebarOpen: boolean;
  searchQuery: string;
  jobFilters: {
    location: string;
    jobType: string;
    salaryMin: number;
  };
}
