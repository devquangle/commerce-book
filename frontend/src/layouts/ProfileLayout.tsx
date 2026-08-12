import { Outlet } from "react-router-dom";



import ProfileMenu from "./ProfileMenu";

const ProfileLayout = () => {
  return (
    <div className="grid grid-cols-12 gap-5 my-5">
      {/* Left Menu - 3 columns */}
      <div className="col-span-12 md:col-span-3">
        <ProfileMenu />
      </div>

      {/* Right Content - 9 columns */}
      <div className="col-span-12 md:col-span-9">
        <div className="card-custom min-h-100 h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
