const express = require('express');
const { Pool } = require('pg');
const axios = require('axios');
const cors = require('cors');
const app = express();
const fs = require('fs');
const multer = require('multer');
// Middleware to enable CORS for all routes
app.use(cors());

// Autodesk Forge API credentials
const CLIENT_ID = 'hQd7ISBoA79IXZiMQyNwNjmA2tlFAuYm';
const CLIENT_SECRET = '7XsA00C7MaGdhmqM';
const BUCKET_KEY = 'vygn-real-time-tracker';

const blocknames=[];

// Configure multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to enable CORS for all routes
app.use(cors());

const pool = new Pool({
  user: 'postgres', // Replace with your PostgreSQL username
  host: 'localhost',
  database: 'master', // Replace with your database name
  password: 'postgresql123', // Replace with your PostgreSQL password
  port: 5432, // Replace with your PostgreSQL port if different
});

// Middleware to parse JSON in request body
app.use(express.json());

app.post('/login', async (req, res) => {
  const { sgid, password } = req.body;

  try {
    const query = {
      text: 'SELECT * FROM "apad_RT_User" WHERE "UserID" = $1 AND "UserPassword" = $2',
      values: [sgid, password],
    };
    const result = await pool.query(query);
    //console.log(result)
    if (result.rows.length === 1) {
      const userRole = result.rows[0].UserType
      const userStatus = result.rows[0].Status
      if (userStatus === 'ACTIVE'){
        if (userRole==='Viewer'){
          res.json({ success: true, message: 'Login successful', role: 'Viewer' });
        }
        else{
          res.json({ success: true, message: 'Login successful', role: 'Other' });
        }
      }
      else{
        res.json({ success: false, message: 'User is INACTIVE' });
      }
    } else {
      res.json({ success: false, message: 'Login failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/getPercentage/:sgid', async (req, res) => {
  try {
    const { sgid } = req.params;
    const query = 'SELECT "Percentage" FROM "apad_Customer" WHERE "ClientID" = $1';
    //console.log('sgid : ',sgid)
    const values = [sgid];
    const result = await pool.query(query,values);
    //console.log('result : ',result)
    const per = result.rows[0].Percentage
    if (result.rows.length > 0) {
      res.json({ percentage : per });
    } else {
      res.status(404).json({ message: 'No data found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.get('/placedBlocksClient/:sgid', async (req, res) => {
  try {
    const { sgid } = req.params;
    console.log(sgid)
    const query = 'SELECT COUNT(*) AS total_count FROM "apad_Blocks" WHERE "OAN" =(SELECT "OAN" FROM "apad_Customer" WHERE "ClientID"=$1) AND "Status" = $2';
    const result = await pool.query(query, [sgid, 'Placed']);
    const totalPlacedBlocks = result.rows[0].total_count;
    // Sending the total row count to the frontend
    res.json({ PB: totalPlacedBlocks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.get('/totalBlocksClient/:sgid', async (req, res) => {
  try {
    const { sgid } = req.params;
    const query = 'SELECT COUNT(*) AS total_count FROM "apad_Blocks" WHERE "OAN" =(SELECT "OAN" FROM "apad_Customer" WHERE "ClientID"=$1)';
    const result = await pool.query(query, [sgid]);
    const totalPlacedBlocks = result.rows[0].total_count;
    // Sending the total row count to the frontend
    res.json({ TB: totalPlacedBlocks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

// GET route to fetch user data
app.get('/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT "UserID", "UserName", "UserType", "Status" FROM "apad_RT_User" ORDER BY "UserID"');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.get('/datacustomer', async (req, res) => {
  try {
    const result = await pool.query('SELECT "ClientID", "ClientName", "OAN", "Percentage" FROM "apad_Customer" ORDER BY "ClientID"');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

// POST route to add a new user
app.post('/api/data', async (req, res) => {
  try {
    const { UserID, UserName, Role, Email, Password } = req.body;

    // Perform database insertion using the provided data
    await pool.query(
      'INSERT INTO "apad_RT_User" ("UserID", "UserName", "UserType", "UserEmail", "UserPassword", "LastLogin", "Status") VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6)',
      [UserID, UserName, Role, Email, Password, 'INACTIVE']
    );

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// POST route to add a new Client
app.post('/api/dataClient', async (req, res) => {
  try {
    const { ClientID, ClientName, OAN } = req.body;

    // Perform database insertion using the provided data
    await pool.query(
      'INSERT INTO "apad_Customer" ("ClientID", "ClientName", "OAN") VALUES ($1, $2, $3)',
      [ClientID, ClientName, OAN]
    );

    res.status(201).json({ message: 'Client created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating client' });
  }
});

//Update Status
app.put('/api/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    //console.log(id,status)

    // Perform the status update operation using the user ID
    await pool.query('UPDATE "apad_RT_User" SET "Status" = $1 WHERE "UserID" = $2', [status, id]);

    res.json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user status' });
  }
});

//To fetch user details for editing purpose
app.get('/api/data/:userID', async (req, res) => {
  const { userID } = req.params;
  try {
    const query = {
      text: 'SELECT * FROM public."apad_RT_User" WHERE "UserID" = $1',
      values: [userID],
    };

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update edited User details
app.put('/api/dataEdit/:userID', async (req, res) => {
  const { userID } = req.params;
  const updatedUserData = req.body;

  try {
    // Construct the SQL query to update user data in the database
    const query = {
      text: `
        UPDATE "apad_RT_User"
        SET "UserName" = $1, "UserPassword" = $2, "UserEmail" = $3, "UserType" = $4
        WHERE "UserID" = $5
      `,
      values: [
        updatedUserData.UserName,
        updatedUserData.UserPassword,
        updatedUserData.UserEmail,
        updatedUserData.UserType,
        userID,
      ],
    };

    // Execute the query to update user data
    await pool.query(query);

    // Send a success response
    res.json({ success: true, message: 'User data updated successfully' });
  } catch (error) {
    // Log and send an error response if an error occurs
    console.error('Error updating user data:', error);
    res.status(500).json({ success: false, message: 'Failed to update user data' });
  }
});

// Delete User
app.delete('/api/dataDelete/:userID', async (req, res) => {
  const {userID} = req.params;
  try {
    // Delete the user from the database
    const result = await pool.query('DELETE FROM "apad_RT_User" WHERE "UserID" = $1', [userID]);
    
    if (result.rowCount > 0) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//To fetch client details for editing purpose
app.get('/api/dataEditClient/:OAN', async (req, res) => {
  const { OAN } = req.params;
  try {
    const query = {
      text: 'SELECT * FROM public."apad_Customer" WHERE "OAN" = $1',
      values: [OAN],
    };

    const result = await pool.query(query);
    console.log(result.rows)
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update edited Client details
app.put('/api/dataEditCustomer/:OAN', async (req, res) => {
  const { OAN } = req.params;
  const updatedUserData = req.body;
  console.log(OAN)
  console.log(updatedUserData)

  try {
    // Construct the SQL query to update user data in the database
    const query = {
      text: `
        UPDATE "apad_Customer"
        SET "ClientID" = $1, "ClientName" = $2
        WHERE "OAN" = $3
      `,
      values: [
        updatedUserData.ClientID,
        updatedUserData.ClientName,
        OAN,
      ],
    };

    // Execute the query to update user data
    await pool.query(query);

    // Send a success response
    res.json({ success: true, message: 'User data updated successfully' });
  } catch (error) {
    // Log and send an error response if an error occurs
    console.error('Error updating user data:', error);
    res.status(500).json({ success: false, message: 'Failed to update user data' });
  }
});

// Delete Client
app.delete('/api/dataDeleteClient/:OAN', async (req, res) => {
  const {OAN} = req.params;
  console.log(OAN);
  try {
    // Delete the user from the database
    const result = await pool.query('DELETE FROM "apad_Customer" WHERE "OAN" = $1', [OAN]);
    
    if (result.rowCount > 0) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a new GET route to fetch the OAN with the maximum Percentage
app.get('/maxPercentageOAN', async (req, res) => {
  try {
    const query = 'SELECT "OAN" FROM "apad_Customer" WHERE "Percentage" = (SELECT MAX("Percentage") FROM "apad_Customer")';
    const result = await pool.query(query);

    if (result.rows.length > 0) {
      res.json({ OAN: result.rows[0].OAN });
    } else {
      res.status(404).json({ message: 'No data found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.get('/totalBlocks', async (req, res) => {
  try {
    const query = 'SELECT "OAN" FROM "apad_Customer" WHERE "Percentage" = (SELECT MAX("Percentage") FROM "apad_Customer")';
    const result = await pool.query(query);
    const OA_No = result.rows[0].OAN

    const query2 = 'SELECT COUNT(*) AS total_count FROM "apad_Blocks" WHERE "OAN" = $1';
    const result2 = await pool.query(query2, [OA_No]);
    const totalRowCount = result2.rows[0].total_count;
    // Sending the total row count to the frontend
    res.json({ TB: totalRowCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.get('/placedBlocks', async (req, res) => {
  try {
    const query = 'SELECT "OAN" FROM "apad_Customer" WHERE "Percentage" = (SELECT MAX("Percentage") FROM "apad_Customer")';
    const result = await pool.query(query);
    const OA_No = result.rows[0].OAN

    const query2 = 'SELECT COUNT(*) AS total_count FROM "apad_Blocks" WHERE "OAN" = $1 AND "Status" = $2';
    const result2 = await pool.query(query2, [OA_No, 'Placed']);
    const totalPlacedBlocks = result2.rows[0].total_count;
    // Sending the total row count to the frontend
    res.json({ PB: totalPlacedBlocks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.get('/maxPercentageOAN2', async (req, res) => {
  try {
    const query = 'SELECT "OAN" FROM "apad_Customer" ORDER BY "Percentage" DESC LIMIT 1 OFFSET 1';
    
    const result = await pool.query(query);

    if (result.rows.length > 0) {
      res.json({ OAN: result.rows[0].OAN });
    } else {
      res.status(404).json({ message: 'No data found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.get('/totalBlocks2', async (req, res) => {
  try {
    const query = 'SELECT "OAN" FROM "apad_Customer" ORDER BY "Percentage" DESC LIMIT 1 OFFSET 1';
    const result = await pool.query(query);
    const OA_No = result.rows[0].OAN

    const query2 = 'SELECT COUNT(*) AS total_count FROM "apad_Blocks" WHERE "OAN" = $1';
    const result2 = await pool.query(query2, [OA_No]);
    const totalRowCount = result2.rows[0].total_count;
    // Sending the total row count to the frontend
    res.json({ TB: totalRowCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.get('/placedBlocks2', async (req, res) => {
  try {
    const query = 'SELECT "OAN" FROM "apad_Customer" ORDER BY "Percentage" DESC LIMIT 1 OFFSET 1';
    const result = await pool.query(query);
    const OA_No = result.rows[0].OAN

    const query2 = 'SELECT COUNT(*) AS total_count FROM "apad_Blocks" WHERE "OAN" = $1 AND "Status" = $2';
    const result2 = await pool.query(query2, [OA_No, 'Placed']);
    const totalPlacedBlocks = result2.rows[0].total_count;
    // Sending the total row count to the frontend
    res.json({ PB: totalPlacedBlocks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});


app.get('/maxPercentageOAN3', async (req, res) => {
  try {
    const query = 'SELECT "OAN" FROM "apad_Customer" ORDER BY "Percentage" DESC LIMIT 1 OFFSET 2';
    
    const result = await pool.query(query);

    if (result.rows.length > 0) {
      res.json({ OAN: result.rows[0].OAN });
    } else {
      res.status(404).json({ message: 'No data found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.get('/totalBlocks3', async (req, res) => {
  try {
    const query = 'SELECT "OAN" FROM "apad_Customer" ORDER BY "Percentage" DESC LIMIT 1 ';
    const result = await pool.query(query);
    const OA_No = result.rows[0].OAN

    const query2 = 'SELECT COUNT(*) AS total_count FROM "apad_Blocks" WHERE "OAN" = $1';
    const result2 = await pool.query(query2, [OA_No]);
    const totalRowCount = result2.rows[0].total_count;
    // Sending the total row count to the frontend
    res.json({ TB: totalRowCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.get('/placedBlocks3', async (req, res) => {
  try {
    const query = 'SELECT "OAN" FROM "apad_Customer" ORDER BY "Percentage" DESC LIMIT 1 OFFSET 2';
    const result = await pool.query(query);
    const OA_No = result.rows[0].OAN

    const query2 = 'SELECT COUNT(*) AS total_count FROM "apad_Blocks" WHERE "OAN" = $1 AND "Status" = $2';
    const result2 = await pool.query(query2, [OA_No, 'Placed']);
    const totalPlacedBlocks = result2.rows[0].total_count;
    // Sending the total row count to the frontend
    res.json({ PB: totalPlacedBlocks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


app.get('/getTotalBlockCount', async (req, res) => {
  try {
    // Query to get the total block count for a specific "OAN" (e.g., 'OA1')
    const query = 'SELECT "RedNo" FROM "apad_Blocks" WHERE "OAN" = $1 ORDER BY "RedNo" ';
    const values = req.query.OAN; // Replace with the specific OAN you want to count
    //console.log(values);
    const result = await pool.query(query, [values]);
    const redNoValues = result.rows.map(row => row.RedNo);
    //console.log("hello",redNoValues);
    res.json({ redNoValues });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching total block count' });
  }
});


app.get('/getBlockStatus', async (req, res) => {
  try {
    // Query to get the "status" for each block
    const query = 'SELECT "RedNo", "Status" FROM "apad_Blocks" WHERE "OAN" = $1 ORDER BY "RedNo"';
    const values = req.query.OAN; // Replace with the specific OAN you want to query

    const result = await pool.query(query, [values]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching block status' });
  }
});

// POST route to update MNo and TrNo in the Blocks table
app.post('/updateBlockAttributes', async (req, res) => {
  try {
    const { redNo, MNo, TrNo } = req.body;
    const OAN=req.query.OAN;

    // Update the MNo and TrNo attributes in the Blocks table
    const query = 'UPDATE "apad_Blocks" SET "MNo" = $1, "TrNo" = $2, "Status" = $3, "PlacementTime" = CURRENT_TIMESTAMP WHERE "OAN" = $4 AND "RedNo" = $5';
    const values = [MNo, TrNo, 'Placed', OAN, redNo]; // Assuming you want to set the Status to 'Placed'
    await pool.query(query, values);

    const childtrno = MNo.concat("/",TrNo);
    const dateObject = new Date();

    const query1 = 'UPDATE "assembly_transactions" SET "apad_status" = $1, "apad_updationtime" = $3 where "child_trace_no" = $2';
    const values1 = ['Placed',childtrno, dateObject]; // Assuming you want to set the Status to 'Placed'
    await pool.query(query1, values1);


    const placed = 'SELECT COUNT(*) FROM "apad_Blocks" Where "OAN"=$1';
    const placedValue = [OAN]
    const tot = await pool.query(placed,placedValue)
    const totalBlocksforPercentage = tot.rows[0].count
    //console.log(totalBlocksforPercentage);

    const placed2 = 'SELECT COUNT(*) FROM "apad_Blocks" Where "OAN"=$1 AND "Status"=$2';
    const placedValue2 = [OAN, 'Placed']
    const tot2 = await pool.query(placed2,placedValue2)
    const placedBlocksforPercentage = tot2.rows[0].count
    //console.log(placedBlocksforPercentage);

    const per = (placedBlocksforPercentage / totalBlocksforPercentage) * 100
    const percentageAsInteger = parseInt(per, 10);
    //console.log(per, ' ',percentageAsInteger)
    const updateQuery = 'UPDATE "apad_Customer" SET "Percentage" = $1 WHERE "OAN" = $2';
    const updateValues = [percentageAsInteger,OAN]
    await pool.query(updateQuery,updateValues)
  // Execute the query to calculate and update the percentage
  

    res.json({ message: 'Block attributes updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating block attributes' });
  }
});

// POST route to update MNo and TrNo attributes to null in the Blocks table
app.post('/rejectBlockAttributes', async (req, res) => {
  try {
    const { redNo, OAN } = req.body; // Get OAN from the request body
    //console.log("OAN :",OAN);

    // Update the MNo and TrNo attributes to null in the Blocks table
    const query = 'UPDATE "apad_Blocks" SET "MNo" = $1, "TrNo" = $2, "Status" = $3 WHERE "RedNo" = $4 AND "OAN" = $5';
    const values = [null, null, "NotPlaced", redNo, OAN]; 

    await pool.query(query, values);
    const placed = 'SELECT COUNT(*) FROM "apad_Blocks" Where "OAN"=$1';
    const placedValue = [OAN]
    const tot = await pool.query(placed,placedValue)
    const totalBlocksforPercentage = tot.rows[0].count
    //console.log(totalBlocksforPercentage);

    const placed2 = 'SELECT COUNT(*) FROM "apad_Blocks" Where "OAN"=$1 AND "Status"=$2';
    const placedValue2 = [OAN, 'Placed']
    const tot2 = await pool.query(placed2,placedValue2)
    const placedBlocksforPercentage = tot2.rows[0].count
    //console.log(placedBlocksforPercentage);

    const per = (placedBlocksforPercentage / totalBlocksforPercentage) * 100
    const percentageAsInteger = parseInt(per, 10);
    //console.log(per, ' ',percentageAsInteger)
    const updateQuery = 'UPDATE "apad_Customer" SET "Percentage" = $1 WHERE "OAN" = $2';
    const updateValues = [percentageAsInteger,OAN]
    await pool.query(updateQuery,updateValues)
    res.json({ message: 'Block rejected successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error while rejecting block' });
  }
});



// POST route to get MNo and TrNo values for a specific redNo
app.post('/getBlockAttributes', async (req, res) => {
  try {
    const { redNo,OAN } = req.body;
    //console.log("OANs :",OAN);
    
    // Query the database to fetch MNo and TrNo for the specified redNo
    const query = 'SELECT "MNo", "TrNo" FROM "apad_Blocks" WHERE "RedNo" = $1 AND "OAN" = $2';
    const values = [redNo, OAN]; // Assuming 'OA1' is the OAN you are working with

    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      res.json({
        success: true,
        MNo: result.rows[0].MNo,
        TrNo: result.rows[0].TrNo,
      });
    } else {
      res.json({
        success: false,
        error: 'Block not found for the specified RedNo and OAN',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching block attributes' });
  }
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { clientId, OANumber } = req.body;
    //console.log(clientId,OANumber);
    // Authenticate with Autodesk Forge
    const authData = new URLSearchParams();
    authData.append('client_id', CLIENT_ID);
    authData.append('client_secret', CLIENT_SECRET);
    authData.append('grant_type', 'client_credentials');
    authData.append('scope', 'data:write data:read bucket:read');

    const authResponse = await axios.post('https://developer.api.autodesk.com/authentication/v1/authenticate', authData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // Set the correct content type
      },
    });

    const accessToken = authResponse.data.access_token;
  //console.log('OAN : ',OANumber);
  //console.log('clientid : ',clientId)
   const clientQuery = 'SELECT "UserName" FROM "apad_RT_User" WHERE "UserID" = $1';
   const re = await pool.query(clientQuery, [clientId]);
   //console.log('re : ',re)
   const clientname=re.rows[0].UserName;
    //console.log('clientname : ',clientname)
   const customerUpdateQuery = 'INSERT INTO "apad_Customer" ("OAN","ClientName", "ClientID") VALUES($1, $2,$3)';
   await pool.query(customerUpdateQuery, [OANumber, clientname,clientId]);


    // Upload the file to the existing bucket
    const file = req.file;
    const uploadResponse = await axios.put(`https://developer.api.autodesk.com/oss/v2/buckets/${BUCKET_KEY}/objects/${file.originalname}`, file.buffer, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': file.mimetype,
      },
    });

    //console.log(uploadResponse)
    if (uploadResponse.status === 200) {

      const objectURN = uploadResponse.data.objectId;
      const base64URN = Buffer.from(objectURN).toString('base64');
      //console.log("Base64 URN: " + base64URN);
      const dwg_urn =base64URN;
      const base_url = "https://developer.api.autodesk.com/modelderivative/v2/designdata";
      
      const metadata_response = await axios.get(`${base_url}/${dwg_urn}/metadata`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
  
      const metadata = metadata_response.data;
      // Step 2: Extract block information and identify the desired block
      for (const object_info of metadata.data.metadata) {
          if (object_info.name === '3D View') {
              const view_urn = object_info.guid;
              const view_response = await axios.get(`${base_url}/${dwg_urn}/metadata/${view_urn}`, {
                  headers: {
                      "Authorization": `Bearer ${accessToken}`
                  }
              });
              const view_metadata = view_response.data;
    
              // Now search through the view_metadata for the desired block
              for (const object_info_3d of view_metadata.data.objects[0].objects[0].objects) {
                  const block_details = object_info_3d.name.split(" ");
                  const block_name = block_details[0];
                  blocknames.push(block_name);
              }  
          }
      }
      //console.log(blocknames);
    
      // Insert each blockname as RedNo in the PostgreSQL "Blocks" table
    for (const blockname of blocknames) {
      const insertQuery = `INSERT INTO "apad_Blocks" ("OAN", "RedNo","Status") VALUES ($1, $2,$3)`;

      // Execute the query for each blockname
      await pool.query(insertQuery, [OANumber, blockname,"NotPlaced"]);
    }
      blocknames.splice(0, blocknames.length);
      res.send({ success: true, base64URN });
    } else {
      res.status(500).send({ success: false, error: 'Failed to upload the file' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: error.message });
  }
});
