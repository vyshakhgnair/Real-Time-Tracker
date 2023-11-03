import requests
from auth import get_access_token,client_id,client_secret
# Set your Forge credentials
client_id = client_id
client_secret = client_secret
bucket_name = "vygn-real-time-tracker"
file_name = "Front wall - Block.dwg"
access_token = get_access_token() # Obtained from the OAuth flow

# Download DWG file
download_url = f"https://developer.api.autodesk.com/oss/v2/buckets/{bucket_name}/objects/{file_name}"
response = requests.get(download_url, headers={"Authorization": f"Bearer {access_token}"})

if response.status_code == 200:
    with open(file_name, "wb") as f:
        f.write(response.content)
    print("File downloaded successfully.")
else:
    print("Failed to download file:", response.text)
