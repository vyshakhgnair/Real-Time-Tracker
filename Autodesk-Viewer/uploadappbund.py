import requests
from wwwroot.auth import get_access_token

# Replace with your actual values
ACCESS_TOKEN = get_access_token()

def create_appbundle():
    url = "https://developer.api.autodesk.com/da/us-east/v3/appbundles"
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    data = {
        "id": "ListLayers",
        "engine": "Autodesk.AutoCAD+24_1",  # Use a valid engine version
        "description": "List Layers AppBundle based on AutoCAD 2024"
    }
    response = requests.post(url, headers=headers, json=data)
    
    print("Response status code:", response.status_code)
    print("Response content:", response.content)
    
    if response.status_code == 200:
        print("AppBundle created successfully.")
        return response.json()  # Return the response JSON for further use
    else:
        print("Failed to create AppBundle.")
        return None

def upload_appbundle(upload_data):
    # Use the values from upload_data dictionary here
    url = "https://developer.api.autodesk.com/da/us-east/v3/appbundles"
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    files = {
    "key": (None, upload_data["uploadParameters"]["formData"]["key"]),
    "content-type": (None, upload_data["uploadParameters"]["formData"]["content-type"]),
    "policy": (None, upload_data["uploadParameters"]["formData"]["policy"]),
    "success_action_status": (None, upload_data["uploadParameters"]["formData"]["success_action_status"]),
    "success_action_redirect": (None, upload_data["uploadParameters"]["formData"]["success_action_redirect"]),
    "x-amz-signature": (None, upload_data["uploadParameters"]["formData"]["x-amz-signature"]),
    "x-amz-credential": (None, upload_data["uploadParameters"]["formData"]["x-amz-credential"]),
    "x-amz-algorithm": (None, upload_data["uploadParameters"]["formData"]["x-amz-algorithm"]),
    "x-amz-date": (None, upload_data["uploadParameters"]["formData"]["x-amz-date"]),
    "x-amz-server-side-encryption": (None, upload_data["uploadParameters"]["formData"]["x-amz-server-side-encryption"]),
    "x-amz-security-token": (None, upload_data["uploadParameters"]["formData"]["x-amz-security-token"]),
        "file": ("ListLayers.zip", open("ListLayers.zip", "rb"), "application/octet-stream")
    }
    response = requests.post(url, headers=headers, files=files)
    
        
    
    print("Response status code:", response.status_code)
    print("Response content:", response.content)
    
    if response.status_code == 200:
        print("AppBundle uploaded successfully.")
    else:
        print("Failed to upload AppBundle.")


def store_appbundle():
    return upload_data

def main():
    try:
        global upload_data 
        upload_data= create_appbundle()
        upload_appbundle(upload_data)

    except Exception as e:
        print("An error occurred:", e)

if __name__ == "__main__":
    main()
