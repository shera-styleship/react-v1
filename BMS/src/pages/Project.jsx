import ProjectList from "../components/project/ProjectList";
import ProjectView from "../components/project/ProjectView";

const Project = () => {
  return (
    <>
      <div className="Project">
        <div className="project-wrap">
          <div>
            <ProjectList />
          </div>
          <div>
            <ProjectView />
          </div>
        </div>
      </div>
    </>
  );
};

export default Project;
