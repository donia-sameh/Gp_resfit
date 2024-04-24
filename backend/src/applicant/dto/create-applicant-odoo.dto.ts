export class CreateApplicantOdooDto {
  firstName: string;
  lastName: string;
  userName?: string;
  phoneNumber?: string;
  password?: string;
  language?: string;
  experience?: string;
  education?: string;
  job_id?: string;
  resumeData: string;
  rating: string;
  resumeFile?: Express.Multer.File;
}
