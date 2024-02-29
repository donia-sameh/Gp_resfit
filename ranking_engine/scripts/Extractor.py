import spacy
from .utils import TextCleaner


# Load the English model
nlp = spacy.load('en_core_web_sm')


RESUME_SECTIONS = [
    'Contact Information',
    'Objective',
    'Summary',
    'Education',
    'Experience',
    'Skills',
    'Projects',
    'Certifications',
    'Licenses',
    'Awards',
    'Honors',
    'Publications',
    'References',
    'Technical Skills',
    'Computer Skills',
    'Programming Languages',
    'Software Skills',
    'Soft Skills',
    'Language Skills',
    'Professional Skills',
    'Transferable Skills',
    'Work Experience',
    'Professional Experience',
    'Employment History',
    'Internship Experience',
    'Volunteer Experience',
    'Leadership Experience',
    'Research Experience',
    'Teaching Experience'
]


class DataExtractor:

    def __init__(self, raw_text: str):
    
        self.text = raw_text
        self.clean_text = TextCleaner.clean_text(self.text)
        self.doc = nlp(self.clean_text)


    def extract_particular_words(self):
        """
        Extract nouns and proper nouns from the given text.

        Args:
            text (str): The input text to extract nouns from.

        Returns:
            list: A list of extracted nouns.
        """
        pos_tags = ['NOUN', 'PROPN']
        nouns = [token.text for token in self.doc if token.pos_ in pos_tags]
        return nouns

    def extract_entities(self):
        """
        Extract named entities of types 'GPE' (geopolitical entity) and 'ORG' (organization) from the given text.

        Args:
            text (str): The input text to extract entities from.

        Returns:
            list: A list of extracted entities.
        """
        entity_labels = ['GPE', 'ORG']
        entities = [
            token.text for token in self.doc.ents if token.label_ in entity_labels]
        return list(set(entities))
