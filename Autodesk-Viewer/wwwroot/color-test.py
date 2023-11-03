import requests
from auth import get_access_token,client_id,client_secret
# Set your Forge credentials
client_id = client_id
client_secret = client_secret


access_token = get_access_token()

# Upload DWG file
bucket_name = "vygn-real-time-tracker"
file_name = "Front wall - Block.dwg"
file_url = f"https://developer.api.autodesk.com/oss/v2/buckets/{bucket_name}/objects/{file_name}"
file_urn = "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnlnbi1yZWFsLXRpbWUtdHJhY2tlci9Gcm9udCUyMHdhbGwlMjAtJTIwQmxvY2suZHdn"  # You need to get this after uploading

# Define parameters and work item
block_id = "MT-266"
new_color = "000000"  # Replace with your desired color in hexadecimal
activity_id = "your.autocad.activity.id"  # AutoCAD activity ID 

work_item_data = {
    "activityId": activity_id,
    "arguments": {
        "InputArguments": [
            {
                "Name": "inputFile",
                "Resource": file_urn
            },
            {
                "Name": "blockId",
                "Value": block_id
            },
            {
                "Name": "newColor",
                "Value": new_color
            }
        ],
        "OutputArguments": [
            {
                "Name": "result",
                "HttpVerb": "POST",
                "Resource": file_urn
            }
        ]
    }
}

# Submit the work item
work_item_url = "https://developer.api.autodesk.com/da/us-east/v3/workitems"
headers = {"Authorization": f"Bearer {access_token}"}
response = requests.post(work_item_url, json=work_item_data, headers=headers)

if response.status_code == 200:
    print("Work item submitted successfully.")
else:
    print("Failed to submit work item:", response.text)
