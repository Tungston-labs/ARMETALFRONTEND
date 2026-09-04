import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  PageWrapper,
  CardsGrid,
  Card,
  CardHeader,
  CardTitle,
  CardText,
  CardFooter,
  Tag,
  CardTitleSection,
  StatusTag,
} from "./Project.Styles";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import cardBg from "../../assets/shift.svg";
import AddProjectModal from "../../Components/Project/modal/ProjectModal";
import FieldShiftIcon from "../../assets/projecticon.svg";
import TagIcon from "../../assets/downicon.svg";
import { getProjects } from "../../Redux/fieldShiftSlice";
import Loader from "../../Components/Loader/Loader";
import EmployeeTitle from "../../Components/Employee/Headers/EmployeeTitle";
import NoEmployeeFound from "../../Components/No found/Noemployeefound";

const statusColors = {
  in_progress: "#d97a0a",
  completed: "#1e8c4a",
  pending: "#c0392b",
};

const statusLightColors = {
  in_progress: "#fff4e0",
  completed: "#e6f9ee",
  pending: "#fdecea",
};

const statusLabels = {
  in_progress: "In Progress",
  completed: "Completed",
  pending: "Pending",
};

const Project = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { projects = [], isLoading = false } = useSelector(
    (state) => state.projects || {}
  );

  useEffect(() => {
    dispatch(getProjects({ search: searchTerm }));
  }, [dispatch, searchTerm]);

  const handleSaveProject = (data) => {
    setIsModalOpen(false);
    dispatch(getProjects());
  };

  return (
    <>
      <PageWrapper>
        <EmployeeTitle
          iconSrc={FieldShiftIcon}
          title="Project"
          subtitle="Manage all projects within the organization"
          buttonText="Add Project"
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          onAddClick={() => setIsModalOpen(true)}
          showDropdown={false}
          showBackArrow={false}
          showTabs={false}
          searchPlaceholder="Search Project Name"
          showReportButton={false}
        />

        <CardsGrid>
          {isLoading ? (
            <Loader />
          ) : projects.length > 0 ? (
            projects.map((project) => (
              <Card
                key={project.id}
                style={{ backgroundImage: `url(${cardBg})`, cursor: "pointer" }}
                onClick={() =>
                  navigate(`/project-department/${project.id}`, {
                    state: { projectName: project.name },
                  })
                }
              >
                <CardHeader>
                  <CardTitleSection>
                    <CardTitle>{project.name}</CardTitle>
                  </CardTitleSection>
                  <HiOutlineDotsHorizontal className="menu-icon" />
                </CardHeader>

                <CardText>
                  <span>Total employees</span>
                  <span className="employee-count">
                    {project.employees?.length || 0}
                  </span>
                </CardText>

                <CardFooter>
                  <Tag>
                    <img src={TagIcon} alt="Tag icon" />
                    {project.punch_type || "N/A"}
                  </Tag>
                  <StatusTag
                    $color={statusColors[project.status]}
                    $lightbg={statusLightColors[project.status]}
                  >
                    {statusLabels[project.status] || project.status || "N/A"}
                  </StatusTag>
                </CardFooter>
              </Card>
            ))
          ) : null}
        </CardsGrid>

        {!isLoading && projects.length === 0 && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <NoEmployeeFound searchTerm={searchTerm} label="No Projects Found" />
          </div>
        )}

        <AddProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProject}
        />
      </PageWrapper>
    </>
  );
};

export default Project;