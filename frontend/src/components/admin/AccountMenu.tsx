import React from "react";
import { adminAccountMenu } from "./admin-account-menu";
import { AccountMenuDropdown } from "../common/AccountMenuDropdown";

export const AccountMenu: React.FC = () => {
  return (
    <AccountMenuDropdown
      menuItems={adminAccountMenu}
      defaultRoleName="Quản trị viên"
      defaultEmail="admin@commercebook.com"
      defaultUserName="admin"
    />
  );
};

