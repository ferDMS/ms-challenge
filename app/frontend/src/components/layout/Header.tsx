"use client";

import {
  Avatar,
  MenuButton,
  Menu,
  MenuItem,
  tokens,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
} from "@fluentui/react-components";
import {
  Settings24Regular,
  QuestionCircle24Regular,
  Person24Regular,
} from "@fluentui/react-icons";
import Image from "next/image";

export interface HeaderProps {
  productName?: string;
  username?: string;
  notificationCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  productName = "WorkAble",
  username = "John Doe",
}) => {
  return (
    <header
      style={{
        backgroundColor: tokens.colorNeutralBackground1,
        borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "48px",
      }}
    >
      {/* Left section - Logo and branding */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <Image
          src="/microsoft/mslogo.webp"
          alt="Microsoft Logo"
          width={112}
          height={24}
          priority
        />
        <ToolbarDivider vertical />
        <span style={{ marginLeft: 10, fontWeight: 600 }}>{productName}</span>
      </div>

      {/* Right section - Actions and Profile */}
      <Toolbar>
        <ToolbarButton icon={<QuestionCircle24Regular />} aria-label="Help" />
        <ToolbarButton icon={<Settings24Regular />} aria-label="Settings" />
        <ToolbarDivider vertical />

        <MenuButton
          appearance="subtle"
          icon={
            <Avatar
              name={username}
              size={28}
              image={{ src: "johndoe.png", alt: username }}
              icon={<Person24Regular />}
            />
          }
        >
          <Menu>
            <MenuItem>{username}</MenuItem>
            <MenuItem>Settings</MenuItem>
          </Menu>
        </MenuButton>
      </Toolbar>
    </header>
  );
};

export default Header;
