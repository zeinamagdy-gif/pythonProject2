import pandas as pd
import os
print(os.getcwd())
# Load the dataset
df = pd.read_csv("C:/Users/DELL/Downloads/ecommerce_customer_data_custom_ratios.csv")

# Preview the dataset
print(df.head())
print(df.isnull().sum())
df.drop_duplicates(inplace=True)
df['Returns'] = df['Returns'].fillna(0)
df['Purchase Date'] = pd.to_datetime(df['Purchase Date'])
df['Purchase Month'] = df['Purchase Date'].dt.month
df['Purchase Year'] = df['Purchase Date'].dt.year
df['Purchase DayOfWeek'] = df['Purchase Date'].dt.dayofweek
customer_spend = df.groupby('Customer ID')['Total Purchase Amount'].sum().reset_index()
customer_spend.columns = ['Customer ID', 'Total Spend']
df = df.merge(customer_spend, on='Customer ID')
customer_freq = df.groupby('Customer ID')['Purchase Date'].count().reset_index()
customer_freq.columns = ['Customer ID', 'Purchase Count']
df = df.merge(customer_freq, on='Customer ID')
customer_df = df.groupby('Customer ID').agg({
    'Total Spend': 'max',
    'Purchase Count': 'max',
    'Customer Age': 'max',
    'Returns': 'sum',
    'Churn': 'max'
}).reset_index()
from sklearn.preprocessing import StandardScaler

features = ['Total Spend', 'Purchase Count', 'Customer Age', 'Returns']
scaler = StandardScaler()
scaled_features = scaler.fit_transform(customer_df[features])
from sklearn.cluster import KMeans

kmeans = KMeans(n_clusters=3, random_state=42)
customer_df['Cluster'] = kmeans.fit_predict(scaled_features)
import seaborn as sns
import matplotlib.pyplot as plt

sns.pairplot(customer_df, hue='Cluster', vars=features)
plt.show()
from pyspark.sql import SparkSession
spark = SparkSession.builder.appName('test').getOrCreate()
print(spark.version)
import seaborn as sns
import matplotlib.pyplot as plt

# Scatter plot of TotalSpent vs Frequency colored by cluster
sns.scatterplot(data=customer_df, x='TotalSpent', y='Frequency', hue='Cluster')
plt.title('Customer Segmentation')
plt.show()
# Calculate Recency (Days since last purchase)
df['Recency'] = (df['Purchase Date'].max() - df['Purchase Date']).dt.days

# Frequency: Count of purchases per customer
customer_freq = df.groupby('Customer ID')['Purchase Date'].count().reset_index()
customer_freq.columns = ['Customer ID', 'Purchase Count']
df = df.merge(customer_freq, on='Customer ID')

# Monetary: Total spend per customer
customer_spend = df.groupby('Customer ID')['Total Purchase Amount'].sum().reset_index()
customer_spend.columns = ['Customer ID', 'Total Spend']
df = df.merge(customer_spend, on='Customer ID')

# Create DataFrame for clustering
customer_df = df.groupby('Customer ID').agg({
    'Total Spend': 'max',
    'Purchase Count': 'max',
    'Customer Age': 'max',
    'Returns': 'sum',
    'Churn': 'max',
    'Recency': 'max'
}).reset_index()
from sklearn.cluster import DBSCAN

dbscan = DBSCAN(eps=0.5, min_samples=5)
customer_df['DBSCAN_Cluster'] = dbscan.fit_predict(scaled_features)

# Visualize DBSCAN clustering
sns.scatterplot(data=customer_df, x='Total Spend', y='Purchase Count', hue='DBSCAN_Cluster')
plt.title('DBSCAN Clustering')
plt.show()
from sklearn.cluster import AgglomerativeClustering

agg_clust = AgglomerativeClustering(n_clusters=3)
customer_df['Agglomerative_Cluster'] = agg_clust.fit_predict(scaled_features)

# Visualize Agglomerative Clustering
sns.scatterplot(data=customer_df, x='Total Spend', y='Purchase Count', hue='Agglomerative_Cluster')
plt.title('Agglomerative Clustering')
plt.show()
from sklearn.metrics import silhouette_score, davies_bouldin_score

silhouette = silhouette_score(scaled_features, customer_df['Cluster'])
db_index = davies_bouldin_score(scaled_features, customer_df['Cluster'])
print(f'Silhouette Score: {silhouette}')
print(f'Davies-Bouldin Index: {db_index}')
from imblearn.over_sampling import SMOTE

smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(scaled_features, customer_df['Cluster'])

# Apply clustering again on the resampled data
kmeans = KMeans(n_clusters=3, random_state=42)
customer_df['Cluster_resampled'] = kmeans.fit_predict(X_resampled)
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

X = customer_df[['Total Spend', 'Purchase Count', 'Customer Age', 'Returns', 'Recency']]
y = customer_df['Churn']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

model = LogisticRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
print(f'Churn Prediction Accuracy: {accuracy}')
category_analysis = df.groupby(['Cluster', 'Product Category'])['Total Purchase Amount'].sum().reset_index()
sns.barplot(data=category_analysis, x='Product Category', y='Total Purchase Amount', hue='Cluster')
plt.title('Product Category Preferences by Customer Segment')
plt.show()
from flask import Flask, request, jsonify
app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict_churn():
    data = request.get_json()  # Get input data from POST request
    prediction = model.predict([data['features']])
    return jsonify({'prediction': prediction.tolist()})

if __name__ == '__main__':
    app.run(debug=True)
