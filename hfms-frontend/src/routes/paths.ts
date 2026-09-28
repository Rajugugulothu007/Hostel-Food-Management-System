export const ROUTES = {
  LOGIN: "/login",
  SIGNUP: "/signup",

  ADMIN: {
    ROOT: "/admin",
    DASHBOARD: "/admin/dashboard",

    STUDENTS: "/admin/students",
    STUDENT_NEW: "/admin/students/new",
    STUDENT_EDIT: (id: number) => `/admin/students/${id}/edit`,

    MENU: "/admin/menu",
    MENU_NEW: "/admin/menu/new",
    MENU_EDIT: (id: string) => `/admin/menu/${id}/edit`,

    VOTING: "/admin/voting",
    ATTENDANCE: "/admin/attendance",
  },

  STUDENT: {
    ROOT: "/student",
    HOME: "/student/home",
    VOTE: "/student/vote",
    QR: "/student/qr",
    IMPACT: "/student/impact",
  },
} as const;