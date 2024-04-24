import { ScreeningQuestion } from "./ScreeningQuestions";
import { TechSkill } from "./TechSkills";

export interface JobVacancy {
  id: number;
  title: string;
  jobDescription: string;
  skills: TechSkill[];
  education: string;
  yearsOfExperience: string;
  language: string;
  screeningQuestions: ScreeningQuestion[]
}
