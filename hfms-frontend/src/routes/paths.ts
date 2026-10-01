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

    ANALYTICS_WASTAGE: "/admin/analytics/wastage",
    ANALYTICS_COST: "/admin/analytics/cost",
    FEEDBACK_TRENDS: "/admin/feedback/trends",

    SURPLUS_LOG: "/admin/surplus/log",
    SURPLUS_DAY_SCHOLARS: "/admin/surplus/day-scholars",
    SURPLUS_NGO: "/admin/surplus/ngo",
  },

  STUDENT: {
    ROOT: "/student",
    HOME: "/student/home",
    VOTE: "/student/vote",
    VOTE_CONFIRMATION: "/student/confirmation",
    QR: "/student/qr",
    IMPACT: "/student/impact",
    FEEDBACK: "/student/feedback",
    FEEDBACK_NEW: "/student/feedback/new",
    NOTIFICATIONS: "/student/notifications",
    SURPLUS: "/student/surplus",
  },
} as const;