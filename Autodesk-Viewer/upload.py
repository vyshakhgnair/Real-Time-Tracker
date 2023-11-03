import requests
from uploadappbund import create_appbundle,upload_appbundle,ACCESS_TOKEN

access_token=ACCESS_TOKEN
upload_data=create_appbundle()
upload_appbundle(upload_data)

# Replace these placeholders with your actual values
YOUR_BUCKET_KEY = "vygn-real-time-tracker"
YOUR_OBJECT_KEY = "Front-wall-Block.dwg"
YOUR_UPLOAD_KEY = upload_data["uploadParameters"]["formData"]["key"]
YOUR_PATH_TO_FILE = "Front-wall-Block.dwg"
YOUR_AMZ_TOKEN = upload_data["uploadParameters"]["formData"]["x-amz-security-token"]
YOUR_AMZ_CREDENTIAL = upload_data["uploadParameters"]["formData"]["x-amz-credential"]
YOUR_AMZ_SIGNATURE = upload_data["uploadParameters"]["formData"]["x-amz-signature"]


# Step 1: GET signed upload URL
get_url = f"https://developer.api.autodesk.com/oss/v2/buckets/{YOUR_BUCKET_KEY}/objects/{YOUR_OBJECT_KEY}/signeds3upload"
headers = {"Authorization": "Bearer {access_token}"}
response = requests.get(get_url, headers=headers)
print(response.json())
upload_key = response.json()["uploadKey"]


'''# Step 2: PUT file to S3 using signed URL
put_url = f"https://com-autodesk-oss-direct-upload.s3-accelerate.amazonaws.com/signed-url-uploads/{upload_key}?uploadId={UPLOAD_ID}&partNumber=1&X-Amz-Security-Token={YOUR_AMZ_TOKEN}%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20220203T052230Z&X-Amz-SignedHeaders=host&X-Amz-Expires=60&X-Amz-Credential={YOUR_AMZ_CREDENTIAL}%2F20220203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature={YOUR_AMZ_SIGNATURE}"
with open(YOUR_PATH_TO_FILE, "rb") as f:
    file_data = f.read()
response = requests.put(put_url, data=file_data)

# Step 3: POST uploadKey
post_url = f"https://developer.api.autodesk.com/oss/v2/buckets/{YOUR_BUCKET_KEY}/objects/{YOUR_OBJECT_KEY}/signeds3upload"
post_data = {"uploadKey": upload_key}
response = requests.post(post_url, json=post_data, headers=headers)




# Step 4: Complete the upload
complete_upload_url = f"https://developer.api.autodesk.com/oss/v2/buckets/{YOUR_BUCKET_KEY}/objects/{YOUR_OBJECT_KEY}/signeds3upload"
headers = {"Authorization": "Bearer nFRJxzCD8OOUr7hzBwbr06D76zAT"}
complete_upload_data = {"uploadKey": YOUR_UPLOAD_KEY}
response = requests.post(complete_upload_url, json=complete_upload_data, headers=headers)

# Step 5: Get download URL
download_url = response.json()["objects"][0]["location"]

# Step 6: Get upload URL
get_upload_url = f"https://developer.api.autodesk.com/oss/v2/buckets/{YOUR_BUCKET_KEY}/objects/{YOUR_OBJECT_KEY}/signeds3upload"
get_upload_data = {"uploadType": "upload"}
response = requests.post(get_upload_url, json=get_upload_data, headers=headers)
upload_key = response.json()["uploadKey"]'''