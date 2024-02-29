from scripts.Extractor import DataExtractor
from scripts.utils.Utils import TextCleaner, generate_unique_id
import os.path
import os
import pathlib

SAVE_DIRECTORY = '../../Data/Processed/Resumes'


class ParseResume:

    def __init__(self, resume: str):
        self.resume_data = resume
        self.clean_data = TextCleaner.clean_text(
            self.resume_data)
        self.key_words = DataExtractor(
            self.clean_data).extract_particular_words()

    def get_JSON(self) -> dict:
        """
        Returns a dictionary of resume data.
        """
        resume_dictionary = {
            "unique_id": generate_unique_id(),
            "resume_data": self.resume_data,
            "clean_data": self.clean_data,
            "extracted_keywords": self.key_words,
        }

        return resume_dictionary
