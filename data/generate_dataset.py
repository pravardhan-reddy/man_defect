import pandas as pd
import numpy as np
import random
import os

# Set seed for reproducibility
np.random.seed(42)
random.seed(42)

NUM_RECORDS = 5000

machines = ['M-01', 'M-02', 'M-03', 'M-04', 'M-05', 'M-06', 'M-07', 'M-08']
products = ['PROD-A10', 'PROD-B20', 'PROD-C30', 'PROD-D40']
operators = ['Op-Alice', 'Op-Bob', 'Op-Charlie', 'Op-David', 'Op-Elena', 'Op-Frank']
shifts = ['Morning', 'Afternoon', 'Night']

defect_types = ['Surface Crack', 'Dimensional Deviation', 'Color Variance', 'Porosity', 'Contamination']

records = []

# Base dates over the last 180 days
date_range = pd.date_range(end=pd.Timestamp.now(), periods=180, freq='D')

for i in range(1, NUM_RECORDS + 1):
    batch_id = f"BAT-{10000 + i}"
    machine = random.choice(machines)
    # Assign lines to machines
    line = f"Line-{(int(machine.split('-')[1]) - 1) // 2 + 1}"
    product = random.choice(products)
    operator = random.choice(operators)
    shift = random.choice(shifts)
    prod_date = random.choice(date_range).strftime('%Y-%m-%d %H:%M')

    # Inject machine specific anomalies (M-04 is high risk for vibration & thermal spikes, M-07 for pressure drops)
    if machine == 'M-04':
        vibration = np.random.normal(4.8, 1.1)
        temp = np.random.normal(84.0, 4.8)
        pressure = np.random.normal(9.8, 1.0)
        speed = np.random.normal(1420, 90)
        humidity = np.random.normal(68.0, 7.0)
    elif machine == 'M-07':
        vibration = np.random.normal(3.2, 0.7)
        temp = np.random.normal(78.0, 3.5)
        pressure = np.random.normal(6.2, 1.4)  # Pressure drop risk
        speed = np.random.normal(1350, 75)
        humidity = np.random.normal(55.0, 5.0)
    else:
        vibration = np.random.normal(2.1, 0.4)
        temp = np.random.normal(74.0, 2.5)
        pressure = np.random.normal(8.6, 0.5)
        speed = np.random.normal(1210, 45)
        humidity = np.random.normal(48.0, 4.0)

    # Night shift parameter variance
    if shift == 'Night':
        vibration += np.random.uniform(0.1, 0.4)
        temp += np.random.uniform(0.8, 2.2)

    vibration = max(0.5, round(float(vibration), 2))
    temp = max(50.0, round(float(temp), 1))
    pressure = max(3.0, round(float(pressure), 2))
    speed = max(800, int(speed))
    humidity = max(20.0, round(float(humidity), 1))

    # Defect probability calculation
    risk_score = 0.05
    
    # Rule 1: High vibration + high temp => Surface Crack risk
    if vibration > 3.8 and temp > 80.0:
        risk_score += 0.65
    
    # Rule 2: Low or unstable pressure + high speed => Dimensional Deviation
    if pressure < 7.0 or speed > 1380:
        risk_score += 0.45

    # Rule 3: High humidity => Color Variance / Porosity
    if humidity > 62.0:
        risk_score += 0.35

    risk_score += float(np.random.uniform(-0.05, 0.05))
    risk_score = min(max(risk_score, 0.02), 0.95)

    has_defect = 1 if random.random() < risk_score else 0

    defect_type = 'None'
    defect_status = 'PASS'

    if has_defect:
        if vibration > 3.8 and temp > 80.0:
            defect_type = 'Surface Crack'
        elif pressure < 7.0 or speed > 1380:
            defect_type = 'Dimensional Deviation'
        elif humidity > 62.0:
            defect_type = random.choice(['Color Variance', 'Porosity'])
        else:
            defect_type = random.choice(defect_types)

        defect_status = 'REWORK' if random.random() < 0.6 else 'SCRAP'

    records.append({
        'Batch_ID': batch_id,
        'Machine_ID': machine,
        'Line_ID': line,
        'Product_ID': product,
        'Temperature': temp,
        'Pressure': pressure,
        'Speed': speed,
        'Vibration': vibration,
        'Humidity': humidity,
        'Operator': operator,
        'Shift': shift,
        'Production_Time': prod_date,
        'Has_Defect': has_defect,
        'Defect_Type': defect_type,
        'Defect_Status': defect_status
    })

df = pd.DataFrame(records)

os.makedirs('c:/e-drive/Hackathon/data', exist_ok=True)
csv_path = 'c:/e-drive/Hackathon/data/manufacturing_sample_5000.csv'
df.to_csv(csv_path, index=False)
print(f"Dataset generated successfully at {csv_path} with {len(df)} records!")
