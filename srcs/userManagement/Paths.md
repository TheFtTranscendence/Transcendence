# User Management

## Authentication

### /auth/login/

Request Method: **POST**

JSON file:
```json
{
	"username": "example",
	"password": "example"
}
```

Returns:

| Message | Description | Status |
|--------|-------------|:-----:|
|Sucess| Login was sucessfull| 200|
|Missing fields|Returns a list with the name of the fields missing from the json file| 400 |
|Invalid Creditials| **Password** was incorrect| 400|

### /auth/register/

Request Method: **POST**

JSON file:
```json
{
	"email": "example@example.example",
	"username": "example",
	"password": "example",
	"confirm_password": "example"
}
```

Returns:

| Message | Description | Status |
|--------|-------------|:-----:|
|Sucess| Registration was sucessfull| 201|
|Missing fields|Returns a list with the name of the fields missing from the json file| 400 |
|Passwords are different| password is different from confirm_password | 409 |
|Username already exists| Username already exists| 400|
|Email already exists| Email already exists| 400|

## Config

### /auth/users/

Request Method: **GET**
Header: Authorization - Token {user_token}

if the user is admin it returns a list of all users if not admin then it returns only the info of that user, if the admin wants his info only **/auth/users/me/**

### /auth/users/{user_id}/

Request Method: **DELETE**
Header: Authorization - Token {user_token}

if the user is admin than he can delete anyone else it can only delete himself

Returns:

| Message | Description | Status |
|--------|-------------|:-----:|
|No premissions| You do not have permission to delete this user | 400|

### /auth/users/{user_id}/

Request Method: **PATCH**
Header: Authorization - Token {user_token}
JSON file:
```json
{
	"field_name": "new value"
}
```

if the user is admin than he can change anyone else it can only change himself

to change the password it needs "password" and "confirm_password"

Returns:

| Message | Description | Status |
|--------|-------------|:-----:|
|No premissions| You do not have permission to delete this user | 400|
|Passwords dont match| Passwords do not match | 400|
