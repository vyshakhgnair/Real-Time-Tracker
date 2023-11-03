import requests
from auth import get_access_token
# Replace with your actual values
ACCESS_TOKEN = get_access_token()
NEW_NICKNAME = "realtest"

def update_nickname():
    url = "https://developer.api.autodesk.com/da/us-east/v3/forgeapps/me"
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    data = {
        "nickname": NEW_NICKNAME
    }
    response = requests.patch(url, headers=headers, json=data)
    
    print("Response status code:", response.status_code)
    print("Response content:", response.content)

    if response.status_code == 200:
        print("Nickname updated successfully.")
    else:
        
        print("Failed to update nickname.")

def main():
    try:
        update_nickname()
    except Exception as e:
        print("An error occurred:", e)

if __name__ == "__main__":
    main()
