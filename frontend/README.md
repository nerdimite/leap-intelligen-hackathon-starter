# Greenbase Frontend Application

## Install Dependencies

### Update Node.js
Update Node.js to v18.20.4 by running the executable file located at `S:\Software\node-v18.20.4-x64.msi`.

### Install Yarn

Install Yarn by running the following command:
```bash
npm install -g yarn
```

Install the dependencies by running the following command:
```bash
yarn install
```

## Run

### Update Environment Variables

Edit the `.env` file in the `frontend` directory and update the following environment variables (replace `<your-private-ip>` with your private IP address that you obtained from the backend README):

```bash
NEXT_PUBLIC_DEFAULT_CUSTOMER_ID=8
NEXT_PUBLIC_DEFAULT_AVATAR_URL=https://api.dicebear.com/9.x/pixel-art/svg?seed=Greenbase%20User
LOGIN_API_URL=http://<your-private-ip>:8000/user/login
SEARCH_API_URL=http://<your-private-ip>:8000/search
GENERATE_ID_URL=http://<your-private-ip>:8000/chat/generate_id
CHAT_API_URL=http://<your-private-ip>:8000/chat
```

### Build and Run the Application

Build and run the application by running the following commands:
```bash
yarn next build
yarn next start
```
If you make any changes to the .env file or any other files in the frontend directory, you will need to build and run the application again. For most intents and purposes, you wouldn't need to change the .env file once you have set it up but incase you run into any issues from changing the .env file, you can try rebuilding and running the application again.
