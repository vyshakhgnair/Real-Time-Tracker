import requests

# Replace with your Forge app's client ID and client secret
client_id = "hQd7ISBoA79IXZiMQyNwNjmA2tlFAuYm"
client_secret = "7XsA00C7MaGdhmqM"

# Forge authentication endpoint
auth_url = "https://developer.api.autodesk.com/authentication/v1/authenticate"

def get_access_token():
    # Request payload
    payload = {
        "client_id": client_id,
        "client_secret": client_secret,
        "grant_type": "client_credentials",
        "scope": "data:read data:write data:create"
    }

    # Get the access token
    response = requests.post(auth_url, data=payload)
    print(response)
    return response.json()["access_token"]

