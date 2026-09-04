import {
  PiBriefcase,
  PiCheckCircle,
  PiClock,
  PiWarningCircle,
  PiWarning,
} from "react-icons/pi";

export const getProjectCards = (projectCount = {}) => [
  {
    title: "Total Projects",
    count: projectCount.total_projects || 0,
    icon: <PiBriefcase />,
    iconColor: "#3858C8",
    backgroundColor: "#E8EDFF",
  },
  {
    title: "Completed",
    count: projectCount.completed || 0,
    icon: <PiCheckCircle />,
    iconColor: "#15AA60",
    backgroundColor: "#E3F7ED",
  },
   {
    title: "Pending",
    count: projectCount.pending || 0,
    icon: <PiWarningCircle />,
    iconColor: "#E74C3C",
    backgroundColor: "#FFE9E7",
  },
  {
    title: "In Progress",
    count: projectCount.in_progress || 0,
    icon: <PiClock />,
    iconColor: "#FF8B2C",
    backgroundColor: "#FFF1E5",
  },
  {
    title: "High Priority",
    count: projectCount.high_priority || 0,
    icon: <PiWarning />,
    iconColor: "#D92D20",
    backgroundColor: "#FFE9E7",
  },
];