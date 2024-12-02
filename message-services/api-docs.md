# API Documentation

## Send Mail API Endpoint

### Request Method

* POST

### Request Path

* /send-mail

### Request Body

* `to`: array of recipient email addresses
* `fromName`: optional sender name (default: Mokshit Jain)
* `subject`: email subject
* `text`: optional email text content
* `html`: email HTML content

### Response

* 200 OK: email sent successfully
* 400 Bad Request: invalid request body
* 500 Internal Server Error: server error

## Send Whatsapp API Endpoint

### Request Method

* POST

### Request Path

* /send-whatsapp

### Request Body

* `countryCode`: optional country code
* `phone`: optional phone number
* `subject`: optional subject
* `message`: message to be sent

## User API Endpoints

### Create User

#### Request Method

* POST

#### Request Path

* /users

#### Request Body

* `name`: user name
* `token`: user token

#### Response

* 201 Created: user created successfully
* 400 Bad Request: invalid request body
* 500 Internal Server Error: server error

### Get All Users

#### Request Method

* GET

#### Request Path

* /users

#### Response

* 200 OK: users retrieved successfully
* 500 Internal Server Error: server error

### Get User by ID

#### Request Method

* GET

#### Request Path

* /users/{id}

#### Response

* 200 OK: user retrieved successfully
* 404 Not Found: user not found
* 500 Internal Server Error: server error

### Update User

#### Request Method

* PATCH

#### Request Path

* /users/{id}

#### Request Body

* `name`: user name
* `token`: user token

#### Response

* 200 OK: user updated successfully
* 400 Bad Request: invalid request body
* 404 Not Found: user not found
* 500 Internal Server Error: server error

### Delete User

#### Request Method

* DELETE

#### Request Path

* /users/{id}

#### Response

* 200 OK: user deleted successfully
* 404 Not Found: user not found
* 500 Internal Server Error: server error
