import React from "react";
import { accountMenu } from "./account-menu";
import { AccountMenuDropdown } from "../common/AccountMenuDropdown";

export const AccountMenu: React.FC = () => {
  return (
    <AccountMenuDropdown
      menuItems={accountMenu}
      defaultRoleName="Người dùng"
      defaultEmail="user@commercebook.com"
      defaultUserName="user"
    />
  );
};

