import { NavLink } from "react-router-dom";
import { useAuth } from '@/context/useAuth';
import { PROFILE_MENU } from './profile-menu';

const ProfileMenu = () => {
  const { userInfo } = useAuth();

  return (
    <div className="card-custom h-full">
      <div className="hidden md:flex items-center py-2 gap-3  mb-4 border-b border-gray-100 dark:border-zinc-800">
        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div className="overflow-hidden">
          <p className="text-xs text-gray-500 dark:text-zinc-400">Tài khoản của</p>
          <h3 className="font-bold text-gray-800 dark:text-white truncate" title={userInfo?.name}>
            {userInfo?.name || 'Khách'}
          </h3>
        </div>
      </div>
      <div className="flex flex-row md:flex-col gap-2 overflow-x-auto no-scrollbar whitespace-nowrap">
        {PROFILE_MENU.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `block p-2 rounded-lg transition-colors body-text ${isActive ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 font-medium" : "text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50"}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default ProfileMenu;