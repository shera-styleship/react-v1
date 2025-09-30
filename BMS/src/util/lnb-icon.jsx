import pencil from "./../assets/icon/ico_pencil.svg";

/* off */
import project from "./../assets/icon/ico_project.svg";
import myProject from "./../assets/icon/ico_myProject.svg";
import schedule from "./../assets/icon/ico_schedule.svg";
import knowledge from "./../assets/icon/ico_knowledge.svg";
import hr from "./../assets/icon/ico_hr.svg";
import setting from "./../assets/icon/ico_setting.svg";

/* on */
import projectOn from "./../assets/icon/ico_project_on.svg";
import myProjectOn from "./../assets/icon/ico_myProject_on.svg";
import scheduleOn from "./../assets/icon/ico_schedule_on.svg";
import knowledgeOn from "./../assets/icon/ico_knowledge_on.svg";
import hrOn from "./../assets/icon/ico_hr_on.svg";
import settingOn from "./../assets/icon/ico_setting_on.svg";

export function getLnbIconImage(lnbIcon, active = false) {
  switch (lnbIcon) {
    case "pencil":
      return active ? pencil : pencil;
    case "project":
      return active ? projectOn : project;
    case "myProject":
      return active ? myProjectOn : myProject;
    case "schedule":
      return active ? scheduleOn : schedule;
    case "knowledge":
      return active ? knowledgeOn : knowledge;
    case "hr":
      return active ? hrOn : hr;
    case "setting":
      return active ? settingOn : setting;
    default:
      return null;
  }
}
