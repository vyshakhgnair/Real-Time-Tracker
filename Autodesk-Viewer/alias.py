import requests
from wwwroot.auth import get_access_token
# Replace with your actual values
ACCESS_TOKEN = get_access_token()

def create_alias():
    url = "https://developer.api.autodesk.com/da/us-east/v3/appbundles/ListLayers/aliases"
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    data = {
        "version": 1,
        "id": "my_working_version"
    }
    response = requests.post(url, headers=headers, json=data)
    
    print("Response status code:", response.status_code)
    print("Response content:", response.content)
    
    if response.status_code == 200:
        print("Alias created successfully.")
    else:
        print("Failed to create alias.")

def main():
    try:
        create_alias()
    except Exception as e:
        print("An error occurred:", e)

if __name__ == "__main__":
    main()
