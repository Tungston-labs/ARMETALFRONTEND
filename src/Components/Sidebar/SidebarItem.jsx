import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  MenuItem,
  MenuButton,
  LeftContent,
  Icon,
  Label,
  Arrow,
  SubMenu,
  SubMenuItem,
} from "./Sidebar.styles";

import { GoChevronUp } from "react-icons/go";

const SidebarItem = ({ item, collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const hasChildren =
    item.children && item.children.length > 0;

  /* =====================================================
     CHECK ACTIVE CHILD
  ===================================================== */

  const isChildActive =
    hasChildren &&
    item.children.some((child) =>
      location.pathname === child.path ||
      location.pathname.startsWith(`${child.path}/`)
    );

  /* =====================================================
     CHECK ACTIVE MAIN MODULE
  ===================================================== */

  const isMainActive =
    !hasChildren &&
    (
      location.pathname === item.path ||
      location.pathname.startsWith(`${item.path}/`)
    );

  /* =====================================================
     OPEN CHILD MENU AUTOMATICALLY
  ===================================================== */

  const [open, setOpen] = useState(isChildActive);

  useEffect(() => {
    if (isChildActive) {
      setOpen(true);
    }
  }, [isChildActive]);

  /* =====================================================
     FINAL ACTIVE STATE
  ===================================================== */

  const isActive = hasChildren
    ? isChildActive
    : isMainActive;

  /* =====================================================
     CLICK HANDLER
  ===================================================== */

  const handleClick = () => {
    if (hasChildren) {
      setOpen((prev) => !prev);
    } else {
      navigate(item.path);
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <MenuItem>
      <MenuButton
        onClick={handleClick}
        $active={isActive}
      >
        <LeftContent>
          <Icon>{item.icon}</Icon>

          <Label $collapsed={collapsed}>
            {item.title}
          </Label>
        </LeftContent>

        {hasChildren && !collapsed && (
          <Arrow $open={open}>
            <GoChevronUp />
          </Arrow>
        )}
      </MenuButton>

      {hasChildren && !collapsed && (
        <SubMenu $open={open}>
          {item.children.map((child) => {
            const isActiveChild =
              location.pathname === child.path ||
              location.pathname.startsWith(`${child.path}/`);

            return (
              <SubMenuItem
                key={child.path}
                $active={isActiveChild}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(child.path);
                }}
              >
                {child.title}
              </SubMenuItem>
            );
          })}
        </SubMenu>
      )}
    </MenuItem>
  );
};

export default SidebarItem;