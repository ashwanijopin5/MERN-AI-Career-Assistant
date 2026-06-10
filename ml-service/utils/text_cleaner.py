import re
import nltk
from nltk.stem import WordNetLemmatizer
from nltk.corpus import wordnet


nltk.download('wordnet', quiet=True)
nltk.download('omw-1.4', quiet=True)

STOP_WORDS = {
    "the", "a", "an", "and", "or", "but", "in", "on", "at",
    "to", "for", "of", "with", "by", "from", "is", "are",
    "was", "were", "be", "been", "have", "has", "had", "do",
    "does", "did", "will", "would", "could", "should", "may",
    "might", "can", "this", "that", "these", "those", "i",
    "we", "you", "he", "she", "they", "it", "my", "our",
    "your", "his", "her", "their", "its", "as", "if", "up", "also"
}
STOP_WORDS.update({
    "skills",
    "skill",
    "experience",
    "project",
    "projects",
    "build",
    "built",
    "develop",
    "developed",
    "using",
    "used",
    "work",
    "working",
    "candidate",
    "candidates",
    "role",
    "position",
    "stack"
})
IMPORTANT_PHRASES = {
    "machine learning",
    "deep learning",
    "computer vision",
    "data science",
    "node.js",
    "express.js",
    "rest api",
    "full stack",
    "cloud deployment"
}
lemmatizer = WordNetLemmatizer()

def clean_text(text):
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r"\S+@\S+", " ", text)
    text = re.sub(r"http\S+|www\S+", " ", text)
    text = re.sub(r"[\+\(]?[1-9][0-9 .\-\(\)]{8,}[0-9]", " ", text)
    text = re.sub(r"[^a-z0-9\.\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()



def extract_keywords(text):
    cleaned = clean_text(text)
    
    
    keywords = []
    for phrase in IMPORTANT_PHRASES:
        if phrase in cleaned:
            keywords.append(phrase)

    words = cleaned.split()
    for word in words:
        word = re.sub(r"[^a-z0-9]", "", word)
        if len(word) < 3:
            continue
        if word in STOP_WORDS:
            continue
        
        lemma = lemmatizer.lemmatize(word, pos='v')
        
        keywords.append(lemma)
    return list(set(keywords))

def count_keyword_frequency(text):
    keywords = extract_keywords(text)
    freq = {}
    for word in keywords:
        freq[word] = freq.get(word, 0) + 1
    return freq

def has_github(text):
    return bool(re.search(r"github\.com", text.lower()))

def has_linkedin(text):
    return bool(re.search(r"linkedin\.com", text.lower()))