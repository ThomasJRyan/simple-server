# Simple Server

A simple server for testing a client.

## Usage

Made with Python 3.10, but any Python 3 should work.

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```