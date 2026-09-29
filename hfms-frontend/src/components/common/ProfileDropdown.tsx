import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  BookOpen,
  HelpCircle,
  LogOut,
  Camera,
  Trash2,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";

import Avatar from "./Avatar";
import ConfirmDialog from "./ConfirmDialog";
import { useAuthStore } from "../../store/authStore";
import { useLogout } from "../../hooks/useLogout";
import {
  getAvatar,
  setAvatar,
  removeAvatar,
  fileToResizedDataUrl,
} from "../../utils/avatarStore";

interface Props {
  variant?: "admin" | "student";
}

export default function ProfileDropdown({ variant = "admin" }: Props) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { showConfirm, requestLogout, confirmLogout, cancelLogout } = useLogout();

  const [open, setOpen] = useState(false);
  const [avatar, setAvatarState] = useState<string | null>(() =>
    getAvatar(user?.username || "")
  );

  const ref = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // Sync avatar when user changes
  useEffect(() => {
    setAvatarState(getAvatar(user?.username || ""));
  }, [user?.username]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.username) return;

    try {
      const dataUrl = await fileToResizedDataUrl(file);
      setAvatar(user.username, dataUrl);
      setAvatarState(dataUrl);
      toast.success("Profile picture updated");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    if (!user?.username) return;
    removeAvatar(user.username);
    setAvatarState(null);
    toast.success("Profile picture removed");
  };

  const menuItems = {
    admin: [
      {
        group: [
          { icon: User, label: "Profile", action: () => navigate("/admin/profile") },
          { icon: Settings, label: "Settings", action: () => navigate("/admin/settings") },
        ],
      },
      {
        group: [
          { icon: BookOpen, label: "Guide", action: () => window.open("#", "_blank") },
          { icon: HelpCircle, label: "Help Center", action: () => window.open("#", "_blank") },
        ],
      },
    ],
    student: [
      {
        group: [
          { icon: User, label: "Profile", action: () => navigate("/student/profile") },
          { icon: Settings, label: "Settings", action: () => navigate("/student/settings") },
        ],
      },
      {
        group: [
          { icon: BookOpen, label: "Guide", action: () => window.open("#", "_blank") },
          { icon: HelpCircle, label: "Help Center", action: () => window.open("#", "_blank") },
        ],
      },
    ],
  }[variant];

  return (
    <>
      <div className="relative" ref={ref}>
        {/* Trigger button */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 p-1 pr-1.5 rounded-lg hover:bg-slate-100 transition"
        >
          <Avatar username={user?.username} dataUrl={avatar} size={30} />
          <ChevronDown
            size={12}
            className={`text-slate-500 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
            {/* Header: avatar + user info + change pic */}
            <div className="px-4 py-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <Avatar username={user?.username} dataUrl={avatar} size={44} />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    title="Change photo"
                  >
                    <Camera size={16} />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {user?.username}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{user?.role}</p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 text-teal hover:underline font-medium"
                >
                  <Camera size={12} /> Upload photo
                </button>
                {avatar && (
                  <>
                    <span className="text-slate-300">·</span>
                    <button
                      onClick={handleRemove}
                      className="flex items-center gap-1 text-red-500 hover:underline font-medium"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Menu groups */}
            {menuItems.map((section, idx) => (
              <div
                key={idx}
                className="py-1 border-b border-slate-100 last:border-b-0"
              >
                {section.group.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setOpen(false);
                      item.action();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                  >
                    <item.icon size={16} className="text-slate-500" />
                    {item.label}
                  </button>
                ))}
              </div>
            ))}

            {/* Logout — triggers confirm dialog */}
            <div className="py-1">
              <button
                onClick={() => {
                  setOpen(false);
                  requestLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm dialog — now INSIDE ProfileDropdown */}
      <ConfirmDialog
        open={showConfirm}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmText="Yes, Logout"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </>
  );
}