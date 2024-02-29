export class CreateJobVacanyDto {
  title: string;
  description: string;
  skills: { title: string; weight: number }[];
  screeningQuestions: number[];
  education: string;
  yearsOfExperience: string;
  language: string;
}
