import React from "react";
import { shopAccountMenu } from "./shop-account-menu";
import { AccountMenuDropdown } from "../common/AccountMenuDropdown";

export const AccountMenu: React.FC = () => {
  return (
    <AccountMenuDropdown
      menuItems={shopAccountMenu}
      defaultRoleName="Chủ cửa hàng"
      defaultEmail="shop@commercebook.com"
      defaultUserName="shop"
    />
  );
};
