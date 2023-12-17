#!/bin/bash

./wait-for-it.sh mongodb:27017 -t 60
./wait-for-it.sh redis:6379 -t 60
./wait-for-it.sh authentication:8080 -t 60

npm start
