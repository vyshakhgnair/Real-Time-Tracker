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
        "description": "List Layers AppBundle based on AutoCAD 2022"
    }
    response = requests.post(url, headers=headers, json=data)
    
    print("Response status code:", response.status_code)
    print("Response content:", response.content)
    
    
    if response.status_code == 200:
        print("AppBundle created successfully.")
    else:
        print("Failed to create AppBundle.")

def main():
    try:
        create_appbundle()
    except Exception as e:
        print("An error occurred:", e)

if __name__ == "__main__":
    main()
