# Greenbase Backend Agent

## Install Dependencies

Open a command prompt and navigate to the backend directory:

```bash
cd backend
pip install -r requirements.txt --user
```

## Run

Open a command prompt and navigate to the backend directory:

Start by ingesting the company's internal wiki:
```bash
python run_ingestion.py
```

Run the following command to start the FastAPI server:
```bash
python chat_server.py
```
You will need to restart the server if you make any changes to the files, before you test your changes from the frontend.