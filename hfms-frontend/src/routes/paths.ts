export const ROUTES = {
  LOGIN: "/login",
  SIGNUP: "/signup",

  ADMIN: {
    ROOT: "/admin",
    DASHBOARD: "/admin/dashboard",
    STUDENTS: "/admin/students",
    MENU: "/admin/menu",
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