# Import necessary libraries
import requests  # For making HTTP requests
import pandas as pd  # For handling Excel files and data manipulation
from tqdm import tqdm  # For showing progress bars during iterations
import json  # For working with JSON data
import ast  # For safely evaluating strings containing Python literal expressions

# Define the function to make API requests to the LLM service
def llm_request(url, prompt, user_query, mapped_topic, attachment, model_name):
    """
    This function sends a POST request to the LLM service to process the user query,
    mapped topic, and attachment, and retrieve the result.
    
    Parameters:
    - url (str): The API endpoint for the service.
    - prompt (str): The prompt template for the LLM model.
    - user_query (str): The user query to be processed.
    - mapped_topic (str): The mapped topic related to the user query.
    - attachment (str): Any attachment sent by the user.
    - model_name (str): The model name being used for processing.

    Returns:
    - Tuple (str, dict or str): "SUCCESS" with response data in JSON or "FAIL" with error message.
    """
    headers = {
        'Content-Type': 'application/json',  # Indicating the content type as JSON
        'serviceEndpointType': 'LAMBDA'  # Custom header, assuming it's required by the service
    }

    # Data to be sent to the service (all required parameters)
    data = {
        "prompt": prompt,
        "user_query": user_query,
        "mapped_topic": mapped_topic,
        "attachment": attachment,
        "model_name": model_name
    }

    try:
        # Sending a POST request to the API
        response = requests.post(url, headers=headers, json=data)
        
        # Raise exception if the HTTP status code is not 200 (successful)
        response.raise_for_status()
        
        # Return success and the JSON response data from the API
        return "SUCCESS", response.json()
    except Exception as e:
        # In case of an error (network issue, wrong status code, etc.), return failure with error message
        return "FAIL", str(e)

# Path to the input Excel file containing the data
input_file_path = "/Users/netomi/Downloads/fast-test.xlsx"

# Model name to be used for LLM request
model_name = "Netomi Generic Model v1"

# URL endpoint for the LLM service
url = 'http://ds-us-v2.internal.netomi.com'

# Define the prompt which will be sent to the LLM API
prompt =
# Read the input data from the Excel file into a pandas DataFrame
df = pd.read_excel(input_file_path)

# Iterate over each row in the DataFrame (each conversation/message)
for i in tqdm(range(len(df))):  # tqdm is used to show a progress bar during iteration
    # Extract the necessary columns for each row
    user_query = str(df.loc[i,'user_query'])  # Convert user query to string
    mapped_topic = str(df.loc[i, 'mapped_topic'])  # Convert mapped topic to string
    attachment = str(df.loc[i, 'attachment'])  # Convert attachment to string

    # Call the llm_request function with the necessary parameters
    response, response_data = llm_request(url, prompt, user_query, mapped_topic, attachment, model_name)
    
    if response == "FAIL":
        # If the request failed, log the error in the "response" column of the DataFrame
        df.loc[i, "response"] = str(response) + ' | error: ' + str(response_data)
    
    if response == "SUCCESS":
        # If the request was successful, store the response data in the "response" column
        df.loc[i, "response"] = str(response_data)
        
        try:
            # If the response contains a 'content' key, try to parse it as JSON
            resp = response_data.get('content', "{}")  # Default to "{}" if 'content' is not found
            parse_resp = json.loads(resp)  # Parse the response content as JSON
            
            # Iterate over the keys in the parsed response and assign values to the corresponding columns in the DataFrame
            for ele in list(parse_resp.keys()):
                df.loc[i, ele] = parse_resp.get(ele, '')  # Fill in the DataFrame with the parsed data

        except Exception as e:
            # If there's an issue parsing the JSON or accessing the response, log the error
            print(f'parsing issue | error: {str(e)}')

# Save the updated DataFrame (with added responses) back to a new Excel file
df.to_excel('output.xlsx', index=False)
