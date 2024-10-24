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

Open a second command prompt and type the following command to get your private IP address:
```bash
ipconfig
```

You should see something like the following:
```
Windows IP Configuration

Ethernet adapter Ethernet 2:

   Connection-specific DNS Suffix  . : asia-southeast1-c.c.roifmr-test.internal.
   Link-local IPv6 Address . . . . . : fe80::8b83:8bb1:b202:7fb7%14
   IPv4 Address. . . . . . . . . . . : 10.148.100.215
   Subnet Mask . . . . . . . . . . . : 255.255.0.0
   Default Gateway . . . . . . . . . : 10.148.0.1

Ethernet adapter vEthernet (nat):

   Connection-specific DNS Suffix  . :
   Link-local IPv6 Address . . . . . : fe80::739a:9a1a:5596:4a2b%19
   IPv4 Address. . . . . . . . . . . : 172.21.16.1
   Subnet Mask . . . . . . . . . . . : 255.255.240.0
   Default Gateway . . . . . . . . . :
```
Copy the IPv4 Address starting with `10.148.xxx.xxx` and keep it handy, it will be used for your setup in the frontend as well as your submission.