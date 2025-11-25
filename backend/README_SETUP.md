# Backend Setup with MongoDB Atlas

## 1. Get MongoDB Atlas Connection String

1. Log in to your [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account.
2. Create a Cluster if you haven't already.
3. Click **Connect** on your cluster.
4. Select **Drivers**.
5. Choose **Python** and version **3.6 or later**.
6. Copy the connection string. It looks like:
   `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority`
7. Replace `<password>` with your actual database user password.

## 2. Configure Environment Variables

Create a file named `.env` in the `backend/` directory (same folder as this README).

Add the following content, replacing the values with your own:

```env
MONGODB_URL=mongodb+srv://myuser:mypassword@mycluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=fastapi_react_auth_db
SECRET_KEY=change_this_to_a_secure_random_string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 3. Install Dependencies

Make sure you are in the `backend/` directory:

```bash
cd backend
pip install -r requirements.txt
```

## 4. Run the Server

```bash
uvicorn main:app --reload
```

The server should start and print:
`INFO:     Successfully connected to MongoDB Atlas!`

