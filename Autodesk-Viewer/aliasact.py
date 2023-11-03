import requests
from wwwroot.auth import get_access_token
# Replace with your actual values
ACCESS_TOKEN =  get_access_token()
ACTIVITY_ID = "ListLayersActivity"

def create_activity_alias():
    url = f"https://developer.api.autodesk.com/da/us-east/v3/activities/{ACTIVITY_ID}/aliases"
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    data = {
        "version": 1,
        "id": "current_version"
    }
    response = requests.post(url, headers=headers, json=data)
    
    print("Response status code:", response.status_code)
    print("Response content:", response.content)
    
    if response.status_code == 200:
        print("Activity alias created successfully.")
    else:
        print("Failed to create activity alias.")

def main():
    try:
        create_activity_alias()
    except Exception as e:
        print("An error occurred:", e)

if __name__ == "__main__":
    main()
