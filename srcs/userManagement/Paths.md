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
|Missing fields|Returns a list with the name of the fields missing from the json file| 450 |
|Invalid Creditials| Password was incorrect| 400|
|Invalid Json| Json file provided has some kind of error | 401 |
|Internal Server Error| Something in the server went wrong| 500 |
|Invalid Request Method| The request method provided is incorrect| 405 |

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
|Missing fields|Returns a list with the name of the fields missing from the json file| 450 |
|Passwords are different| password is different from confirm_password | 409 |
|Username already exists| Username already exists| 400|
|Invalid Json| Json file provided has some kind of error | 401 |
|Internal Server Error| Something in the server went wrong| 500 |
|Invalid Request Method| The request method provided is incorrect| 405 |

## Data

### /data/user_info/\<username>/

Request Method: **GET**

JSON file: *(null)*

Returns:

| Message | Description | Status |
|--------|-------------|:-----:|
|Sucess| Returns the users data  | 200|
|Invalid user| User with this username doesn't exist| 400|
|Internal Server Error| Something in the server went wrong| 500 |
|Invalid Request Method| The request method provided is incorrect| 405 |

Sucess return Json:
```json
{
	"username": "example",
	"email": "example"
}
```

### /data/friends/\<username>/

Request Method: **GET**

JSON file: *(null)*

Returns:

| Message | Description | Status |
|--------|-------------|:-----:|
|Sucess| Returns the users friend list  | 200|
|Invalid user| User with this username doesn't exist| 400|
|Internal Server Error| Something in the server went wrong| 500 |
|Invalid Request Method| The request method provided is incorrect| 405 |

Sucess return Json:
```json
{
	"friends": ["friend1", "friend2"]
}
```

### /data/avatar/\<username>/

Request Method: **GET**

JSON file: *(null)*

Returns:

| Message | Description | Status |
|--------|-------------|:-----:|
|Sucess| Returns the users avatar  | 200|
|Invalid user| User with this username doesn't exist| 400|
|Internal Server Error| Something in the server went wrong| 500 |
|Invalid Request Method| The request method provided is incorrect| 405 |

### /data/users/

Request Method: **GET**

JSON file: *(null)*

Returns:

| Message | Description | Status |
|--------|-------------|:-----:|
|Sucess| Returns a list of all users  | 200|
|Internal Server Error| Something in the server went wrong| 500 |
|Invalid Request Method| The request method provided is incorrect| 405 |

Sucess return Json:
```json
[
	"user1",
	"user2",
	"user3"
]
```

## Config

### /config/rename/\<username1>/

Request Method: **PUT**

JSON file:
```json
{
	"new_username": "example"
}
```

Returns:

| Message | Description | Status |
|--------|-------------|:-----:|
|Sucess| Username updated sucessfully  | 200|
|New username not provided| the json file doesn't contain a new username| 400|
|Username already exists| the username provided is already in use | 409 |
|User not found | Cant change the username because the user doesn't exist| 404 |
|Invalid Json| Json file provided has some kind of error | 401 |
|Internal Server Error| Something in the server went wrong| 500 |
|Invalid Request Method| The request method provided is incorrect| 405 |

### /config/change_password/\<username1>/

Request Method: **PUT**

JSON file:
```json
{
	"old_password": "example",
	"new_password": "example",
	"confirm_new_password": "example"
}
```

Returns:

| Message | Description | Status |
|--------|-------------|:-----:|
|Sucess| Password updated sucessfully  | 200|
|Missing fields|Returns a list with the name of the fields missing from the json file| 450 |
|Passwords are different| new_password is different from confirm_new_password | 409 |
|User not found | Cant change the username because the user doesn't exist| 404 |
|Old password is incorrect| the old password doesn't match this user| 400|
|Invalid Json| Json file provided has some kind of error | 401 |
|Internal Server Error| Something in the server went wrong| 500 |
|Invalid Request Method| The request method provided is incorrect| 405 |

### /config/add_friend/\<username1>/\<username2>/

Request Method: **PUT**

JSON file: *(null)*

Returns:

| Message | Description | Status |
|--------|-------------|:-----:|
|Sucess| The 2 users are now friends  | 200|
|Users are already friends| The 2 users provided are already friends | 404 |
|User not found | Cant change the username because the user doesn't exist| 400
|Internal Server Error| Something in the server went wrong| 500 |
|Invalid Request Method| The request method provided is incorrect| 405 |

### /config/remove_friend/\<username1>/\<username2>/

Request Method: **PUT**

JSON file: *(null)*

Returns:

| Message | Description | Status |
|--------|-------------|:-----:|
|Sucess| The 2 users are no longer friends | 200|
|Users aren't already friends| The 2 users provided are not friends | 404 |
|User not found | Cant change the username because the user doesn't exist| 400
|Internal Server Error| Something in the server went wrong| 500 |
|Invalid Request Method| The request method provided is incorrect| 405 |

### /config/change_avatar/\<username1>/

Request Method: **PUT**

JSON file: *(null)*
**but it needs an image file**

Returns:

| Message | Description | Status |
|--------|-------------|:-----:|
|Sucess| Password updated sucessfully  | 200|
|User not found | Cant change the username because the user doesn't exist| 400 |
|No file provided| No image file was provided | 401 |
|Internal Server Error| Something in the server went wrong| 500 |
|Invalid Request Method| The request method provided is incorrect| 405 |




