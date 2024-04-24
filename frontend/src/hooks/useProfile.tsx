import { Applicant } from "@/constants/Applicant";
import { JobVacancy } from "@/constants/JobVacancy";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function useProfile() {
  const [profile, setProfile] = useState<Applicant>();
  const { data } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/auth/profile`, {
          headers: {
            Authorization: `Bearer ${data?.accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log({ data });
          // Update form data with the fetched job data
          setProfile(data);
        } else {
          console.error("Error fetching data:", response.statusText);
          // Handle error state or display an error message to the user
        }
      } catch (error) {
        console.error("Error during data fetching:", error);
        // Handle network errors or other issues
      }
    };

    if (data) {
      fetchData();
    }
  }, [data]);

  return {
    profile,
  };
}
