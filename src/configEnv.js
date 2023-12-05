import dotenv from "dotenv";

dotenv.config();

const envKeys = {
    mongo_uri: process.env.MONGO_URI,
    jwt_secret: process.env.JWT_SECRET_KEY,
    github_client_id: process.env.GITHUB_CLIENT_ID,
    github_client_secret: process.env.GITHUB_CLIENT_SECRET
};

export default envKeys;