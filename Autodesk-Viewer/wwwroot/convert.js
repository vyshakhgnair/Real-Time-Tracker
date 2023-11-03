const axios = require('axios');

const blockNames = [];

async function findNumberOfBlocks(viewMetadata) {
  let count = 0;
  for (const objectInfo3D of viewMetadata.data.objects[0].objects[0].objects) {
    const blockDetails = objectInfo3D.name.split(' ');
    const blockName = blockDetails[0];
    blockNames.push(blockName);
    count++;
  }
  console.log(blockNames);
  console.log('\n');
  console.log(blockNames.length);
  return count;
}

async function getBlockId() {
  // Replace with your actual access token
  const accessToken = await getAccessToken();

  // Base URL for Forge Model Derivative API
  const baseUrl = 'https://developer.api.autodesk.com/modelderivative/v2/designdata';

  // Replace with your DWG file's URN
  const dwgUrn = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnlnbi1yZWFsLXRpbWUtdHJhY2tlci9Gcm9udCUyMHdhbGwlMjAtJTIwQmxvY2suZHdn';

  try {
    // Step 1: Get metadata about the DWG file
    const metadataResponse = await axios.get(`${baseUrl}/${dwgUrn}/metadata`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const metadata = metadataResponse.data;
    let count = 0;
    console.log(metadata);

    // Step 2: Extract block information and identify the desired block
    let desiredBlockId = null;
    for (const objectInfo of metadata.data.metadata) {
      if (objectInfo.name === '3D View') {
        const viewUrn = objectInfo.guid;
        const viewResponse = await axios.get(`${baseUrl}/${dwgUrn}/metadata/${viewUrn}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const viewMetadata = viewResponse.data;
        console.log('value', viewMetadata);

        // Now search through the viewMetadata for the desired block
        count = await findNumberOfBlocks(viewMetadata);
        for (const objectInfo3D of viewMetadata.data.objects[0].objects[0].objects) {
          console.log(objectInfo3D);
          const blockDetails = objectInfo3D.name.split(' ');
          const blockName = blockDetails[0];

          console.log(blockName);
          if (blockName === 'MT-200') {
            // Value present in [] is the block name
            desiredBlockId = blockDetails[1].slice(1, -1);
            break;
          }
        }

        if (desiredBlockId !== null) {
          break;
        }
      }
    }

    if (desiredBlockId === null) {
      console.log('Desired block not found.');
    } else {
      console.log('Desired block ID:', desiredBlockId);
    }

    console.log('The total number of blocks which are referenced are:', count);
  } catch (error) {
    console.error('An error occurred:', error);
  }

  return desiredBlockId;
}

async function getAccessToken() {
  // Replace with your Forge app's client ID and client secret
  const clientId = 'hQd7ISBoA79IXZiMQyNwNjmA2tlFAuYm';
  const clientSecret = '7XsA00C7MaGdhmqM';

  // Forge authentication endpoint
  const authUrl = 'https://developer.api.autodesk.com/authentication/v1/authenticate';

  // Request payload
  const payload = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
    scope: 'data:read data:write data:create',
  };

  try {
    // Get the access token
    const response = await axios.post(authUrl, null, { params: payload });
    return response.data.access_token;
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

(async () => {
  console.log(await getBlockId());
})();
