from flask import Flask, request, jsonify, render_template
import pickle
import pandas as pd
import numpy as np

app = Flask(__name__)

# Load the saved model and imputer
model = pickle.load(open('model.pkl', 'rb'))
imputer = pickle.load(open('imputer.pkl', 'rb'))

# Mappings from your ML code
company_mapping = {
    'mercedes': 11,  # Mercedes-Benz index
    'bmw': 12,      # BMW index
    'porsche': 15   # Porsche index
}

transmission_mapping = {'Manual': 0, 'Automatic': 1}
fuel_type_mapping = {'Diesel': 0, 'Petrol': 1, 'Electric': 4}
owner_type_mapping = {'First': 0, 'Second': 1, 'Third': 2}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # Create input DataFrame
        input_data = {
            'Company': company_mapping.get(data['company'], -1),
            'Model': -1,  # Simplified for this example
            'Year': int(data['year']),
            'Kilometers_Driven': float(data['km_driven']),
            'Fuel_Type': fuel_type_mapping.get(data['fuel_type'], -1),
            'Transmission': transmission_mapping.get(data['transmission'], -1),
            'Owner_Type': owner_type_mapping.get(data['owner_type'], -1),
            'Mileage': float(data['mileage']),
            'Engine': float(data['engine']),
            'Power': float(data['power'])
        }
        
        # Convert to DataFrame and transform
        input_df = pd.DataFrame([input_data])
        input_transformed = imputer.transform(input_df)
        
        # Make prediction
        prediction = model.predict(input_transformed)[0]
        
        # Convert to lakhs and format
        prediction_in_lakhs = round(prediction, 2)
        
        return jsonify({
            'success': True,
            'predicted_price': prediction_in_lakhs,
            'currency': 'lakhs'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
