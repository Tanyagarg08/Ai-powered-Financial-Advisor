import requests

response = requests.post(
    "http://127.0.0.1:5000/chat",
    json={"message": "hello"}
)

print("STATUS:", response.status_code)
print("REPLY:", response.json())
