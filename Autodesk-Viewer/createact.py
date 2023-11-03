import requests
from wwwroot.auth import get_access_token

# Replace with your actual values
ACCESS_TOKEN = get_access_token()  
APP_NICKNAME = "ListLayers"
WORKING_VERSION = "my_working_version"

def create_activity():
    url = "https://developer.api.autodesk.com/da/us-east/v3/activities"
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    data = {
        "id": "ListLayersActivity",
        "commandLine": [
            "$(engine.path)\\accoreconsole.exe /i \"$(args[InputDwg].path)\" /al \"$(appbundles[{0}].path)\" /s \"$(settings[script].path)\"".format(APP_NICKNAME)
        ],
        "parameters": {
            "InputDwg": {
                "zip": False,
                "ondemand": False,
                "verb": "get",
                "description": "Input drawing file",
                "localName": "InputDrawing.dwg"
            },
            "result": {
                "zip": False,
                "ondemand": False,
                "verb": "put",
                "description": "Results",
                "required": True,
                "localName": "layers.txt"
            }
        },
        "engine": "Autodesk.AutoCAD+24_1",
        "appbundles": [
            "{0}.ListLayers+{1}".format(APP_NICKNAME, WORKING_VERSION)
        ],
        "settings": {
            "script": "(command \"LISTLAYERS\")\n"
        },
        "description": "Extracts layer names from an input drawing file and saves them to a text file"
    }
    response = requests.post(url, headers=headers, json=data)
    
    print("Response status code:", response.status_code)
    print("Response content:", response.content)
    
    if response.status_code == 200:
        print("Activity created successfully.")
    else:
        print("Failed to create activity.")

def main():
    try:
        create_activity()
    except Exception as e:
        print("An error occurred:", e)

if __name__ == "__main__":
    main()
