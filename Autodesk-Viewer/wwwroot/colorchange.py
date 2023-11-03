import requests
from pyautocad import Autocad
from extract import get_blockid
from auth import get_access_token

def change_block_color(block_id):
    acad = Autocad(create_if_not_exists=True)
    block = acad.doc.HandleToObject(block_id)
    if block:
        # Set the color to green
        block.color = 3  # Green color index

def main():
    # Your existing code to retrieve block ID
    block_id = get_blockid()

    if block_id:
        change_block_color(block_id)
        print("Block color changed to green.")
    else:
        print("Block ID not found.")

if __name__ == "__main__":
    main()
