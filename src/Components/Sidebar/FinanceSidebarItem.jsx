import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GoChevronUp } from "react-icons/go";

import {
  MenuItem,
  MenuButton,
  LeftContent,
  Icon,
  Label,
  Arrow,
  SubMenu,
  SubMenuItem,
} from "./FinanceSidebar.styles";

const matchPath = (currentPath, targetPath) => {
  if (!currentPath || !targetPath) return false;
  const curr = currentPath.toLowerCase().replace(/\/+$/, "");
  const targ = targetPath.toLowerCase().replace(/\/+$/, "");
  if (!curr || !targ) return false;
  return curr === targ || curr.startsWith(`${targ}/`);
};

const FinanceSidebarItem = ({ item, onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const hasChildren = item.children && item.children.length > 0;

  const isChildActive =
    hasChildren &&
    item.children.some((child) => matchPath(location.pathname, child.path));

  const isMainActive =
    !hasChildren &&
    (item.path === "/"
      ? location.pathname === "/"
      : matchPath(location.pathname, item.path));

  const [open, setOpen] = useState(isChildActive);

  useEffect(() => {
    if (isChildActive) {
      setOpen(true);
    }
  }, [isChildActive]);

  const isActive = hasChildren ? isChildActive : isMainActive;

  const handleClick = () => {
    if (hasChildren) {
      setOpen((prev) => !prev);
    } else {
      if (onNavigate) onNavigate();
      navigate(item.path);
    }
  };

  const handleChildClick = (e, path) => {
    e.stopPropagation();
    if (onNavigate) onNavigate();
    navigate(path);
  };

  return (
    <MenuItem>
      <MenuButton onClick={handleClick} $active={isActive}>
        <LeftContent>
          <Icon>{item.icon}</Icon>
          <Label>{item.title}</Label>
        </LeftContent>

        {hasChildren && (
          <Arrow $open={open}>
            <GoChevronUp />
          </Arrow>
        )}
      </MenuButton>

      {hasChildren && (
        <SubMenu $open={open}>
          {item.children.map((child) => {
            const isActiveChild = matchPath(location.pathname, child.path);

            return (
              <SubMenuItem
                key={child.path}
                $active={isActiveChild}
                onClick={(e) => handleChildClick(e, child.path)}
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

export default FinanceSidebarItem;
