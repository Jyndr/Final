import sys
import subprocess
import platform

def install_torch():
    try:
        import torch
        print("PyTorch is already installed.")
        return True
    except ImportError:
        print("Installing PyTorch...")
        try:
            system = platform.system()
            python_version = sys.version_info 
            if system == "Windows":
                if python_version >= (3, 8):
                    subprocess.check_call([sys.executable, "-m", "pip", "install", "torch", "torchvision", "torchaudio", "--index-url", "https://download.pytorch.org/whl/cu118"])
                else:
                    subprocess.check_call([sys.executable, "-m", "pip", "install", "torch", "torchvision", "torchaudio"])
            else:
                subprocess.check_call([sys.executable, "-m", "pip", "install", "torch", "torchvision", "torchaudio"])
            
            print("PyTorch installation completed.")
            return True
        except Exception as e:
            print(f"Error installing PyTorch: {e}")
            return False

def install_packages():
   
    try:
        
        if not install_torch():
            print("Failed to install PyTorch. Please install it manually from https://pytorch.org/")
            sys.exit(1)
            
        # Then install other packages
        import pkg_resources
        installed = {pkg.key for pkg in pkg_resources.working_set}
        
        # Define packages with versions
        required_packages = [
            "requests>=2.31.0",
            "feedparser>=6.0.10",
            "pandas>=2.1.0",
            "nltk>=3.8.1",
            "beautifulsoup4>=4.12.0",
            "scikit-learn>=1.3.0",
            "fake-useragent>=1.4.0",
            "joblib>=1.3.0",
            "scipy>=1.11.0",
            "threadpoolctl>=3.2.0",
            "regex>=2023.8.8",
            "tqdm>=4.66.0",
            "setuptools>=68.0.0",
            "transformers>=4.35.0",
            "numpy>=1.24.0",
            "protobuf>=4.25.1",
            "pymongo>=4.6.0"
        ]
        
        missing = [pkg for pkg in required_packages if pkg.split('>=')[0].lower() not in installed]
        
        if missing:
            print(f"Installing missing packages: {', '.join(missing)}")
            # Install protobuf first if it's missing
            if "protobuf" in missing:
                subprocess.check_call([sys.executable, "-m", "pip", "install", "protobuf>=4.25.1"])
                missing.remove("protobuf>=4.25.1")
            
            # Install remaining packages
            if missing:
                subprocess.check_call([sys.executable, "-m", "pip", "install", *missing])
            print("Package installation completed.")
        else:
            print("All required packages are already installed.")
            
        # Try to install sentencepiece separately with error handling
        try:
            import sentencepiece
            print("sentencepiece is already installed.")
        except ImportError:
            print("Attempting to install sentencepiece...")
            try:
                subprocess.check_call([sys.executable, "-m", "pip", "install", "sentencepiece>=0.1.99"])
                print("sentencepiece installed successfully.")
            except Exception as e:
                print(f"Warning: Could not install sentencepiece: {e}")
                print("The script will continue with basic functionality.")
                print("Some advanced features may be limited.")
            
    except Exception as e:
        print(f"Error installing packages: {str(e)}")
        sys.exit(1)

# Install required packages
install_packages()

# Import required packages
import requests
import feedparser
import pandas as pd
import nltk
import json
import os
import time
import ssl
from bs4 import BeautifulSoup
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from fake_useragent import UserAgent
from datetime import datetime
from pymongo import MongoClient

# Import torch and transformers with error handling
try:
    import torch
    from transformers import AutoTokenizer, AutoModelForSequenceClassification
    print("Successfully imported PyTorch and Transformers")
except ImportError as e:
    print(f"Error importing torch or transformers: {e}")
    print("Please ensure you have CUDA-compatible GPU and proper PyTorch installation.")
    print("You can try installing PyTorch manually from: https://pytorch.org/")
    sys.exit(1)

# Download required NLTK data
def download_nltk_data():
    """Download required NLTK data"""
    try:
        required_nltk_data = ['punkt', 'stopwords', 'wordnet', 'averaged_perceptron_tagger']
        for data in required_nltk_data:
            try:
                nltk.data.find(f'tokenizers/{data}' if data == 'punkt' else f'corpora/{data}')
                print(f"NLTK {data} already downloaded.")
            except LookupError:
                nltk.download(data)
                print(f"Downloaded NLTK {data}.")
        print("NLTK data setup completed.")
    except Exception as e:
        print(f"Error downloading NLTK data: {str(e)}")
        sys.exit(1)

# Download NLTK data
download_nltk_data()

# SSL Configuration
ssl._create_default_https_context = ssl._create_unverified_context

# Initialize global variables
ml_model = None
vectorizer = None
device = None

try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

try:
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('wordnet')

import pandas as pd

def generate_disaster_keywords(location):
    """Generate disaster keywords"""
    # Core disaster keywords
    keywords = [
        "earthquake", "flood", "cyclone", "tsunami", 
        "landslide", "rain", "typhoon", "volcano",
        "storm", "hurricane", "tornado", "drought"
    ]
    
    # Add location variations to improve search
    location_variations = [location]
    if " " in location:  # Handle multi-word locations
        location_variations.append(location.replace(" ", ""))
        location_variations.extend(location.split())
    
    # Create search keywords with location variations
    final_keywords = []
    for loc in location_variations:
        for kw in keywords:
            if kw not in loc.lower():
                final_keywords.append(f"{loc} {kw}")
    final_keywords.extend(keywords)  # Add standalone disaster keywords
    
    df = pd.DataFrame({'keyword': list(set(final_keywords))})  # Remove duplicates
    return df

DISASTER_KEYWORDS = [
    "earthquake", "flood", "cyclone", "tsunami", 
    "landslide", "rain", "typhoon", "volcano",
    "storm", "hurricane", "tornado", "drought"
]

class NewsArticle:
    def __init__(self, source, title, content, url, published_date):
        self.source = source
        self.title = title
        self.content = content
        self.url = url
        self.published_date = published_date

    @property
    def is_disaster_related(self):
        """Check if the article is disaster related using verify_disaster_relevance"""
        text = f"{self.title} {self.content}"
        return verify_disaster_relevance(text)

    def to_dict(self):
        return {
            "source": self.source,
            "title": self.title,
            "content": self.content,
            "url": self.url,
            "published_date": self.published_date
        }

"""# GOOGLE NEWS"""

def scrape_google_news(location, num_results=20):
    """Scrapes Google News for disaster-related articles for a given location."""
    # Use disaster keywords
    keywords = DISASTER_KEYWORDS
    
    # Create location query
    location_query = f'"{location}"'
    
    # Create disaster keywords query
    disaster_query = ' OR '.join([f'"{kw}"' for kw in keywords])
    search_query = f'({location_query}) AND ({disaster_query})'
    
    google_news_url = f"https://news.google.com/rss/search?q={search_query.replace(' ', '+')}"

    try:
        feed = feedparser.parse(google_news_url)
        articles = []

        for entry in feed.entries[:num_results]:
            try:
                published_date = datetime.strptime(entry.published, '%a, %d %b %Y %H:%M:%S %Z')
            except ValueError:
                published_date = None

            # Only check if it's recent (within last 30 days)
            if published_date is None or (datetime.now() - published_date).days <= 30:
                article = NewsArticle(
                    source=entry.source.title,
                    title=entry.title,
                    content=entry.summary,
                    url=entry.link,
                    published_date=published_date,
                )
                if article.is_disaster_related:
                    articles.append(article)

        return articles

    except Exception as e:
        print(f"Error scraping Google News: {e}")
        return []

def is_location_relevant(text, target_location):
    """Check if the news article is truly relevant to the target location."""
    text = text.lower()
    target_location = target_location.lower()
    
    # List of words that might indicate the article is about a different location
    location_indicators = ['in', 'at', 'from', 'near', 'around']
    
    # Split text into sentences
    sentences = text.split('.')
    
    for sentence in sentences:
        # If the target location is mentioned in a sentence
        if target_location in sentence:
            # Check if another location is more prominent
            words = sentence.split()
            for i, word in enumerate(words):
                if word in location_indicators and i + 1 < len(words):
                    next_word = words[i + 1]
                    # If the word after location indicator is not our target location
                    if next_word != target_location and len(next_word) > 3:
                        # Check if this might be the main location of the event
                        if next_word.istitle() or next_word in sentence.split(target_location)[0]:
                            return False
    
    return True

def collect_all_disaster_news(location):
    """Collect disaster news from all sources into a single combined dataset"""
    if not location:
        print("Error: Location is required")
        return pd.DataFrame()

    all_articles = []

    # Collect from various sources
    print(f"Collecting news for {location}...")
    
    # Google News (primary source)
    print("Fetching from Google News...")
    google_articles = scrape_google_news(location)
    if google_articles:
        all_articles.extend([article.to_dict() for article in google_articles])
        print(f"Found {len(google_articles)} articles from Google News")
    
    # News websites (secondary source)
    print("Fetching from news websites...")
    website_articles = scrape_news_websites(location)
    if website_articles:
        all_articles.extend(website_articles)
        print(f"Found {len(website_articles)} articles from news websites")
    
    # Twitter (optional source)
    print("Fetching from Twitter...")
    twitter_articles = scrape_twitter(location)
    if twitter_articles:
        all_articles.extend(twitter_articles)
        print(f"Found {len(twitter_articles)} articles from Twitter")

    # Convert to DataFrame
    df = pd.DataFrame(all_articles)

    if df.empty:
        print("No articles found from any source")
        return df

    # Ensure required columns exist
    required_columns = ['source', 'title', 'content', 'url']
    for col in required_columns:
        if col not in df.columns:
            df[col] = ''

    # Clean and process the combined dataset
    df = clean_combined_dataset(df)

    # Calculate trust scores using ML model
    df = calculate_trust_scores_for_dataset(df)

    return df

"""# TWITTER"""

import requests

class NewsArticle:
    def __init__(self, source, title, content, url, published_date):
        self.source = source
        self.title = title
        self.content = content
        self.url = url
        self.published_date = published_date

    @property
    def is_disaster_related(self):
        """Check if the article is disaster related using verify_disaster_relevance"""
        text = f"{self.title} {self.content}"
        return verify_disaster_relevance(text)

    def to_dict(self):
        return {
            "source": self.source,
            "title": self.title,
            "content": self.content,
            "url": self.url,
            "published_date": self.published_date
        }

API_KEY = "keuLbQOMCQJkFh8XRCPbkY8Or1"
API_SECRET = "Cj7fvx89BtRzCpd5PY0J82D1MpSiXILEi7FGPyNeKLdoBQzWNj"
BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAOnr0AEAAAAAZ6s4SeQiuXQrxzBRo7cbEBnVzts%3DDlLmnr6hAxgTv6reEhgBh0VXd0fDNblcMCv4NJK7eUKuVzub3i"

# Replace with your actual Bearer token
BEARER_TOKEN = os.environ.get("BEARER_TOKEN")

def scrape_twitter(location):
    articles = []
    search_url = "https://api.twitter.com/2/tweets/search/recent"

    # Construct query with location
    query_params = {
        'query': f'({location}) ("earthquake" OR "flood" OR "cyclone" OR "hurricane" OR "wildfire" OR "landslide" OR "tsunami" OR "tornado" OR "disaster" OR "volcanic eruption") ("breaking" OR "alert" OR "update" OR "news" OR "evacuation" OR "damage" OR "rescue" OR "emergency") lang:en',
        'max_results': '50',
        'tweet.fields': 'created_at,author_id',
    }
    headers = {
        "Authorization": f"Bearer {BEARER_TOKEN}"
    }

    try:
        response = requests.get(search_url, headers=headers, params=query_params)
        if response.status_code != 200:
            raise Exception(
                f"Request returned an error: {response.status_code} {response.text}"
            )
        data = response.json()
        tweets = data.get("data", [])
        for tweet in tweets:
            article = NewsArticle(
                source="Twitter",
                title=tweet.get("text", ""),
                content="",
                url=f"https://twitter.com/i/web/status/{tweet.get('id')}",
                published_date=tweet.get("created_at")
            )
            if article.is_disaster_related:
                articles.append(article.to_dict())
    except Exception as e:
        print(f"Error scraping Twitter: {e}")
    return articles

"""# News Webs"""

def scrape_news_websites(location):
    """Scrape news from various RSS feeds"""
    articles = []
    RSS_FEEDS = {
        "NDTV": "https://feeds.feedburner.com/ndtvnews-top-stories",
        "The Times of India": "https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms",
        "Hindustan Times": "https://www.hindustantimes.com/rss/topnews/rssfeed.xml",
        "The Hindu": "https://www.thehindu.com/news/national/feeder/default.rss",
        "India Today": "https://www.indiatoday.in/rss/1",
        "Reuters": "https://www.reuters.com/rssFeed/worldNews"
    }
    
    # Use only disaster keywords without location
    disaster_keywords = DISASTER_KEYWORDS
    
    for source, url in RSS_FEEDS.items():
        try:
            print(f"Checking {source}...")
            feed = feedparser.parse(url)
            for entry in feed.entries:
                title = entry.title if hasattr(entry, 'title') else ""
                content = entry.summary if hasattr(entry, 'summary') else ""
                link = entry.link if hasattr(entry, 'link') else ""
                published = entry.published if hasattr(entry, 'published') else None
                
                # Check if the article contains any disaster keywords
                text = f"{title} {content}".lower()
                if any(keyword.lower() in text for keyword in disaster_keywords):
                    article = NewsArticle(
                        source=source,
                        title=title,
                        content=content,
                        url=link,
                        published_date=published
                    )
                    if article.is_disaster_related:
                        articles.append(article.to_dict())
        except Exception as e:
            print(f"Error scraping {source}: {str(e)}")
            continue
            
    return articles

"""# Model"""

import random
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

def initialize_model():
    """Initialize the fake news detection model from Hugging Face"""
    try:
        # Check if sentencepiece is available
        try:
            import sentencepiece
        except ImportError:
            print("Warning: sentencepiece not available. Using basic tokenizer.")
            return None, None, None

        # Use a pre-trained model fine-tuned for fake news detection
        model_name = "microsoft/deberta-v3-base"  # Using a more reliable base model
        print("Loading tokenizer...")
        try:
            tokenizer = AutoTokenizer.from_pretrained(model_name)
            print("Loading model...")
            model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=2)
            
            # Move model to GPU if available
            device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
            print(f"Using device: {device}")
            model = model.to(device)
            model.eval()  # Set to evaluation mode
            
            print("Model initialized successfully")
            return model, tokenizer, device
        except Exception as e:
            print(f"Warning: Could not initialize the ML model: {e}")
            print("Falling back to basic trust score calculation")
            return None, None, None
            
    except Exception as e:
        print(f"Error initializing model: {e}")
        print("Falling back to basic trust score calculation")
        return None, None, None

def calculate_trust_score(article):
    """Calculate trust score using the Hugging Face model"""
    global ml_model, tokenizer, device
    
    if ml_model is None or tokenizer is None:
        ml_model, tokenizer, device = initialize_model()
        if ml_model is None:
            return fallback_calculate_trust_score(article)

    try:
        # Combine title and content
        text = f"{article['title']} {article['content']}" if article['content'] else article['title']
        
        # Tokenize and prepare input
        inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512, padding=True)
        inputs = {k: v.to(device) for k, v in inputs.items()}
        
        # Get prediction
        with torch.no_grad():
            outputs = ml_model(**inputs)
            probabilities = torch.softmax(outputs.logits, dim=1)
            trust_score = probabilities[0][1].item()  # Probability of being real news
        
        # Adjust score based on source reliability
        trust_score = adjust_trust_score(trust_score, article)
        
        return max(0.1, min(0.95, trust_score))
    except Exception as e:
        print(f"Error in trust score calculation: {e}")
        return fallback_calculate_trust_score(article)

def adjust_trust_score(base_score, article):
    """Adjust trust score based on additional factors"""
    # Source reliability adjustment
    source = article['source'].lower() if isinstance(article['source'], str) else ''
    
    # High trust sources boost
    high_trust_boost = {
        'reuters': 0.15,
        'associated press': 0.15,
        'bbc': 0.15,
        'the new york times': 0.12,
        'the hindu': 0.12,
        'ndtv': 0.1,
        'the times of india': 0.1,
        'hindustan times': 0.1
    }
    
    # Apply source reliability boost
    for trusted_source, boost in high_trust_boost.items():
        if trusted_source in source:
            base_score = min(0.95, base_score + boost)
            break
    
    # Content length factor
    content = article.get('content', '')
    if content:
        if len(content) > 1000:
            base_score = min(0.95, base_score + 0.05)
        elif len(content) > 500:
            base_score = min(0.95, base_score + 0.03)
    
    # URL reliability
    url = article.get('url', '')
    if url:
        if url.startswith('https'):
            base_score = min(0.95, base_score + 0.02)
        if any(domain in url.lower() for domain in ['.gov', '.edu', '.org']):
            base_score = min(0.95, base_score + 0.05)
    
    return base_score

# Update the global variables
ml_model = None
tokenizer = None
device = None

def build_fake_news_detection_model(location=None):
    """Initialize the fake news detection model"""
    global ml_model, tokenizer, device
    
    if ml_model is None:
        ml_model, tokenizer, device = initialize_model()
    
    return ml_model, tokenizer

"""# Trust Score"""

def calculate_trust_scores_for_dataset(df):
    """Calculate trust scores for the entire dataset using ML model"""
    if df.empty:
        return df

    # Calculate trust scores
    df["trust_score"] = df.apply(
        lambda row: calculate_trust_score(row),
        axis=1
    )

    return df

def process_and_display_results(df):
    """Process the collected data and prepare for display"""
    if df.empty:
        return pd.DataFrame()

    # Convert trust_score to percentage
    df['trust_score_percent'] = (df['trust_score'] * 100).round(1)

    # Prepare final output
    output_df = df[['source', 'title', 'url', 'trust_score_percent']].copy()
    output_df.columns = ['Source', 'Title', 'URL', 'Trust Score (%)']

    print(output_df.head(10))
    return output_df

"""# REAL Time"""

def getreal_time_disaster_news(location=None):
    """API endpoint for web backend to get real-time disaster news
    
    Args:
        location (str, optional): Location to search for disaster news. Defaults to None.
    """
    # Ensure ML model is loaded
    global ml_model, tokenizer, device
    if ml_model is None or tokenizer is None:
        ml_model, tokenizer, device = build_fake_news_detection_model(location)

    # Get fresh data from all sources
    df_news = collect_all_disaster_news(location)

    if df_news.empty:
        return []

    # Process for display
    results = process_and_display_results(df_news)

    # Convert to format for web display with timestamp
    current_time = datetime.now().isoformat()
    news_items = []
    for _, row in results.iterrows():
        news_items.append({
            'source': row['Source'],
            'title': row['Title'],
            'url': row['URL'],
            'trust_score': row['Trust Score (%)'],
            'retrieved_at': current_time,
            'location': location
        })

    return news_items

"""# Main Function"""

import json  # Missing import
import random

def send_prediction_results(results):
    """Sends the predicted processed results to a designated endpoint."""
    print(json.dumps(results, indent=2))

def format_article_output(article):
    """Format article data for output"""
    print(f"Source: {article['Source']}")
    print(f"Title: {article['Title']}")
    print(f"URL: {article['URL']}")
    print(f"Trust Score: {article['Trust Score (%)']}")
    print("-" * 80)

def store_in_mongodb(news_items):
    """Store news items in MongoDB"""
    try:
        # Connect to MongoDB
        client = MongoClient('mongodb://localhost:27017/')
        db = client['disaster_news']
        collection = db['newsarticles']
        
        # Convert news items to list of documents
        documents = []
        for item in news_items:
            # Add timestamp for when the document is stored
            item['stored_at'] = datetime.now()
            documents.append(item)
        
        # Insert documents into MongoDB
        if documents:
            result = collection.insert_many(documents)
            print(f"Successfully stored {len(result.inserted_ids)} articles in MongoDB")
            return True
        else:
            print("No articles to store")
            return False
            
    except Exception as e:
        print(f"Error storing data in MongoDB: {str(e)}")
        return False
    finally:
        if 'client' in locals():
            client.close()

def main():
    """Main function to get disaster news for a location"""
    try:
        # Get location from command line arguments
        import sys
        if len(sys.argv) < 2:
            print("Please provide a location as a command line argument")
            print("Usage: python okdone.py 'location'")
            sys.exit(1)
            
        location = sys.argv[1].strip()
        print(f"\nFetching disaster news for {location}...")

        # Build ML model for fake news detection
        global ml_model, tokenizer, device
        ml_model, tokenizer = build_fake_news_detection_model(location)

        # Collect and process all disaster news
        df = collect_all_disaster_news(location)

        if df.empty:
            print(f"No disaster news found for {location}")
            return

        # Process and display results
        processed_df = process_and_display_results(df)

        if processed_df.empty:
            print("No relevant disaster news found for this location.")
            return
            
        # Convert DataFrame to list of dictionaries for MongoDB
        news_items = []
        for _, row in processed_df.iterrows():
            news_item = {
                'source': row['Source'],
                'title': row['Title'],
                'url': row['URL'],
                'trust_score': row['Trust Score (%)'],
                'retrieved_at': datetime.now().isoformat(),
                'location': location
            }
            news_items.append(news_item)
            format_article_output(row)
        
        # Store in MongoDB
        if store_in_mongodb(news_items):
            print("Successfully stored news articles in MongoDB")
        else:
            print("Failed to store news articles in MongoDB")

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        print("Please try again.")

def clean_combined_dataset(df):
    """Clean and preprocess the combined dataset"""
    if df.empty:
        return df
        
    # Remove duplicates based on URL
    df = df.drop_duplicates(subset=['url'], keep='first')
    
    # Remove rows with empty titles or content
    df = df.dropna(subset=['title'])
    
    # Clean text fields
    df['title'] = df['title'].str.strip()
    df['content'] = df['content'].fillna('').str.strip()
    
    # Ensure all text fields are strings
    df['title'] = df['title'].astype(str)
    df['content'] = df['content'].astype(str)
    df['source'] = df['source'].astype(str)
    df['url'] = df['url'].astype(str)
    
    return df

def fallback_calculate_trust_score(article):
    """Calculate a basic trust score when ML model is not available"""
    base_score = 0.5  # Start with neutral score
    
    # Source reliability adjustment
    source = article['source'].lower() if isinstance(article['source'], str) else ''
    high_trust_sources = {
        'reuters': 0.15,
        'associated press': 0.15,
        'bbc': 0.15,
        'the new york times': 0.12,
        'the hindu': 0.12,
        'ndtv': 0.1,
        'the times of india': 0.1,
        'hindustan times': 0.1
    }
    
    # Apply source reliability boost
    for trusted_source, boost in high_trust_sources.items():
        if trusted_source in source:
            base_score += boost
            break
    
    # Content length factor
    content = article.get('content', '')
    if content:
        if len(content) > 1000:
            base_score += 0.05
        elif len(content) > 500:
            base_score += 0.03
    
    # URL reliability
    url = article.get('url', '')
    if url:
        if url.startswith('https'):
            base_score += 0.02
        if any(domain in url.lower() for domain in ['.gov', '.edu', '.org']):
            base_score += 0.05
    
    return max(0.1, min(0.95, base_score))

def verify_disaster_relevance(text):
    """Check if the text is related to disasters"""
    tokens = word_tokenize(text.lower())
    stop_words = set(stopwords.words('english'))
    tokens = [token for token in tokens if token not in stop_words]

    for keyword in DISASTER_KEYWORDS:
        if keyword.lower() in tokens or keyword.lower() in text:
            return True

    return False

if __name__ == "__main__":
    main()
