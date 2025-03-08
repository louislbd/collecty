#!/bin/bash

python3 -m venv venv

source venv/bin/activate

pip install "fastapi[standard]"
pip install -r requirements.txt

fastapi dev main.py