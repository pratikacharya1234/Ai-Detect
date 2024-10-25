import joblib
from sklearn.datasets import fetch_20newsgroups
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline

# Fetch the dataset (this fetches a bunch of newsgroup text data)
data = fetch_20newsgroups()

# Extract the data and target
X = data.data  # The text data
y = [0 if label < 10 else 1 for label in data.target]  # Simple binary classification

# Create a pipeline with vectorization and a classifier
model = make_pipeline(TfidfVectorizer(), MultinomialNB())

# Train the model
model.fit(X, y)

# Save the trained model
joblib.dump(model, 'text_detection_model.pkl')
