import { Outlet, NavLink } from "react-router-dom";

import { useAuth } from '@/context/useAuth';

const ProfileLayout = () => {
  const { userInfo } = useAuth();

  return (
    <div className="grid grid-cols-12 gap-5 my-5">
      {/* Left Menu - 3 columns */}
      <div className="col-span-12 md:col-span-3">
        <div className="card-custom h-full p-3! md:p-4!">
          <div className="hidden md:flex items-center gap-3 p-2 mb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-gray-500">Tài khoản của</p>
              <h3 className="font-bold text-gray-800 truncate" title={userInfo?.name}>
                {userInfo?.name || 'Khách'}
              </h3>
            </div>
          </div>
          <div className="flex flex-row md:flex-col gap-2 overflow-x-auto no-scrollbar whitespace-nowrap">
            <NavLink
              to="/profile"
              end
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition-colors body-text ${isActive ? "bg-purple-50 text-purple-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`
              }
            >
              Hồ sơ cá nhân
            </NavLink>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition-colors body-text ${isActive ? "bg-purple-50 text-purple-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`
              }
            >
              Đơn hàng của tôi
            </NavLink>
          </div>
        </div>
      </div>

      {/* Right Content - 9 columns */}
      <div className="col-span-12 md:col-span-9">
        <div className="card-custom min-h-[400px] h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
