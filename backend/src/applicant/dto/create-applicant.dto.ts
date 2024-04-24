export class CreateApplicantDto {
  applicantId?: string;
  firstName: string;
  lastName: string;
  userName: string;
  phoneNumber: string;
  email: string;
  password: string;
  language: string;
  yearsOfExperience: string;
  education: string;
  jobVacancyId: string;
  screeningQuestions: string; // this will be a Json stringified
}
