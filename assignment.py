import findspark
findspark.init()

import matplotlib.pyplot as plt
# import seaborn as sns
from pyspark.sql import SparkSession
from pyspark.sql.functions import sum


# Initialize Spark session
spark = SparkSession.builder \
    .appName("Website Stats Analysis") \
    .getOrCreate()

# Load the dataset
# Adjust this to the correct absolute path
df = spark.read.csv("C:/Users/DELL/Downloads/final_website_stats.csv", header=True, inferSchema=True)


# Show the first 5 rows and schema
df.show(5)
df.printSchema()

# Aggregating data by day_of_week in PySpark (instead of using Pandas)
df_aggregated = df.groupBy("day_of_week").agg(
    sum("page_views").alias("total_page_views")
)

# Collect the data into a list of rows
data = df_aggregated.collect()

# Convert collected data into a format that can be plotted
days = [row['day_of_week'] for row in data]
page_views = [row['total_page_views'] for row in data]

# Plot Total Page Views by Day of the Week using Matplotlib
plt.figure(figsize=(10, 6))
plt.bar(days, page_views, color='lightcoral')
plt.title("Total Page Views by Day of the Week")
plt.ylabel("Total Page Views")
plt.xlabel("Day of the Week")
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

# Stop the Spark session
spark.stop()
