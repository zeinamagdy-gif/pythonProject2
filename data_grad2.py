import pandas as pd
import numpy as np
import random
from faker import Faker
from datetime import timedelta
import os

# Define the path where you want to save the CSV file
save_path = "C:\\Users\\DELL\\PycharmProjects\\pythonProject2\\venv\\Scripts"
output_file = os.path.join(save_path, "simulated_data_nestle.csv")

# Check if directory exists, if not, create it
if not os.path.exists(save_path):
    print(f"Directory does not exist: {save_path}. Creating it.")
    os.makedirs(save_path)

# Initialize Faker
fake = Faker()

# Set random seed for reproducibility
random.seed(42)
np.random.seed(42)

# Number of rows
num_rows = 10000

# Mapping: Country to Region
country_region = {
    'Egypt': 'MENA',
    'Nigeria': 'CWAR',
    'Germany': 'Europe',
    'Kenya': 'EAR',
    'Brazil': 'LATAM',
    'South Africa': 'SSA',
    'Saudi Arabia': 'MENA',
    'France': 'Europe',
    'Mexico': 'LATAM',
    'China': 'Asia',
    'Morocco': 'MENA',
    'Ghana': 'CWAR'
}

# Mapping: Customer (country) to POD (port)
country_pod = {
    'Egypt': 'Port Said',
    'Nigeria': 'Apapa',
    'Germany': 'Hamburg',
    'Kenya': 'Mombasa',
    'Brazil': 'Santos',
    'South Africa': 'Durban',
    'Saudi Arabia': 'Jeddah Islamic Port',
    'France': 'Le Havre',
    'Mexico': 'Veracruz',
    'China': 'Shanghai',
    'Morocco': 'Casablanca',
    'Ghana': 'Tema'
}

# Dominant and Sub Category Mapping
dominant_category_mapping = {
    'Dairies': ['Milk', 'Ice Cream', 'Yogurt', 'Cheese'],
    'Coffee': ['Nescafe', 'Dolce Gusto'],
    'Nutrition': ['Cerelac', 'Baby Formula', 'Medical Nutrition'],
    'Food': ['Maggi', 'Frozen Food', 'Culinary Products']
}

# Other Options
loading_types = ['Loose', 'Slip Sheets']
shipping_lines = ['Maersk', 'MSC', 'CMA CGM', 'Hapag-Lloyd', 'Evergreen']
pol_ports = ['Port Said', 'Jebel Ali', 'Rotterdam', 'Shanghai', 'Singapore']
ffwo_types = ['MTS', 'Other Type 1', 'Other Type 2', 'Other Type 3']


# Helper functions
def generate_dates():
    docs_eds = fake.date_between(start_date='-90d', end_date='today')
    docs_sent = docs_eds + timedelta(days=random.randint(-5, 5))
    return docs_sent, docs_eds


def calculate_dispatch(docs_sent, docs_eds):
    diff = (docs_sent - docs_eds).days
    if abs(diff) <= 2:
        return 'Yes', diff, 'Hit', ''  # On Time
    else:
        return 'No', diff, '', 'Miss'  # Late


def generate_sp_date(docs_eds):
    return docs_eds + timedelta(days=random.randint(-5, 5))


def generate_pallets_and_cases():
    pallets = random.randint(30, 150)
    cases_per_pallet = random.randint(50, 80)
    total_cases = pallets * cases_per_pallet
    return pallets, total_cases


def generate_containers():
    dry20 = random.randint(0, 5)
    dry40 = random.randint(0, 5)
    ref20 = random.randint(0, 2)
    ref40 = random.randint(0, 2)
    total = dry20 + dry40 + ref20 + ref40
    return dry20, dry40, ref20, ref40, total


# Start generating data
data = []
for _ in range(num_rows):
    # Select a random customer (country)
    customer = random.choice(list(country_region.keys()))
    region = country_region[customer]
    pod = country_pod[customer]

    # Select dominant and sub-category
    dominant_category = random.choice(list(dominant_category_mapping.keys()))
    category = random.choice(dominant_category_mapping[dominant_category])

    docs_sent, docs_eds = generate_dates()
    on_time_dispatch, no_of_days, hit, miss = calculate_dispatch(docs_sent, docs_eds)
    sp_date = generate_sp_date(docs_eds)
    pallets, total_cases = generate_pallets_and_cases()
    dry20, dry40, ref20, ref40, total_cont = generate_containers()

    row = {
        'DOCs Sent?': docs_sent,
        'Docs EDS': docs_eds,
        'Region': region,
        'PO2': random.randint(4559000000, 4559999999),
        'PO / SO': random.randint(4559000000, 4559999999),
        'Outbound No': random.randint(841000000, 841999999),
        'Customer': customer,
        'Category': category,
        'Dominant Category': dominant_category,
        'Week#': docs_sent.isocalendar()[1],
        'Initial Availability Date': docs_eds - timedelta(days=random.randint(1, 5)),
        'Actual Availability Date': docs_sent,
        'Factory Dispatch Date': docs_sent + timedelta(days=random.randint(1, 3)),
        'Month': docs_sent.month,
        '20"Dry': dry20,
        '40"Dry': dry40,
        '20"Ref': ref20,
        '40"Ref': ref40,
        'TOTAL Cont': total_cont,
        'Cut-off': docs_sent + timedelta(days=random.randint(5, 10)),
        'ETD': docs_sent + timedelta(days=random.randint(10, 15)),
        'ETA': docs_sent + timedelta(days=random.randint(20, 30)),
        'Booking #': random.randint(700000000, 799999999),
        'POL': random.choice(pol_ports),
        'POD': pod,
        'FFWO': random.choice(ffwo_types),
        'Shipping Line': random.choice(shipping_lines),
        'Docs On Time': on_time_dispatch,
        'No of Days': no_of_days,
        'Hit': hit,
        'Miss': miss,
        'Form 13 Number': random.randint(80000000, 89999999),
        'Form 13 date': docs_sent + timedelta(days=random.randint(1, 5)),
        'Billing Number': random.randint(1306000000, 1306999999),
        'Invoice Value': round(random.uniform(10000, 150000), 2),
        'Invoice Number': fake.date_between(start_date=docs_sent, end_date=docs_sent + timedelta(days=90)),
        'Pallets': pallets,
        'Loading Type': random.choice(loading_types),
        'Halal Request': random.choice(['Yes', 'No', np.nan]),
        'On Time Dispatch': on_time_dispatch,
        'SP Dates': sp_date,
        'Number of foot pallets': random.randint(10, pallets),
        'Total Number of Cases': total_cases
    }
    data.append(row)

# Create DataFrame
simulated_df = pd.DataFrame(data)

# Save to CSV
simulated_df.to_csv(output_file, index=False)

print(f"Simulated accurate Nestlé-style data saved to {output_file}")


