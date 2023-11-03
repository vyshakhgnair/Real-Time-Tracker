import requests
#from pyautocad import Autocad
from auth import get_access_token

block_names=[]

def find_number_of_blocks(view_metdata):
    count=0
    for object_info_3d in view_metdata['data']['objects'][0]['objects'][0]['objects']:
        block_details=object_info_3d["name"].split(" ")
        block_name=block_details[0]
        block_names.append(block_name)
        count=count+1
    print(block_names)
    
    #print("\n")
    #print(len(block_names))
    return count





def get_blockid():
    # Replace with your actual access token
    access_token =get_access_token()
    #print(access_token)    

    # Base URL for Forge Model Derivative API
    base_url = "https://developer.api.autodesk.com/modelderivative/v2/designdata"

    # Replace with your DWG file's URN
    dwg_urn = "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnlnbi1yZWFsLXRpbWUtdHJhY2tlci9Gcm9udCUyMHdhbGwlMjAtJTIwQmxvY2suZHdn"

    try:
        # Step 1: Get metadata about the DWG file
        metadata_response = requests.get(f"{base_url}/{dwg_urn}/metadata", headers={"Authorization": f"Bearer {access_token}"})
        metadata = metadata_response.json()
        count=0
        #print(metadata)
        # Step 2: Extract block information and identify the desired block
        desired_block_id = None
        print(metadata['data'])
        for object_info in metadata['data']['metadata']:
            if object_info['name'] == '3D View':
                view_urn = object_info['guid']
                view_response = requests.get(f"{base_url}/{dwg_urn}/metadata/{view_urn}", headers={"Authorization": f"Bearer {access_token}"})
                view_metadata = view_response.json()
                
                #print("value",view_metadata)

                # Now search through the view_metadata for the desired block
                count=find_number_of_blocks(view_metadata)
                for object_info_3d in view_metadata['data']['objects'][0]['objects'][0]['objects']:
                    #print(object_info_3d)
                    block_details=object_info_3d["name"].split(" ")
                    block_name=block_details[0]
                    
                    print(block_name)

        

        print("The total number of blocks which are referenced are :",count)

    except requests.exceptions.RequestException as e:
        print("An error occurred:", e)
    return desired_block_id

print(get_blockid())
    