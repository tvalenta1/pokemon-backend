# Pokemon backend API

## Swagger Docs
The Swagger docs are exposed on `/swagger` unprotected endpoint. You can [open the docs](http://localhost:3000/swagger) in your browser and even test the API from within the browser.

## Authentication

The Pokemon API is protected with very basic bearer token authentication. The user first needs to authenticate by issuing a POST request to the `/auth` API endpoint. The request body must contain `email` and `password`. For convenience there is already one user in the database so calling the `/auth` endpoint with following request body will successfully authenticate this user and return his bearer token.
```
{
  "email": "admin",
  "password": "admin"
}
```
Use this token as a bearer token for calling protected API endpoints.


## Things to improve

This section contains items that were not completelly implemented or were skipped entirely. I wanted to list them here for awareness.

### Authentication

There is no session handling implemented. Users can authenticate as many times in parallel as they want. The authentication token has expiry time and when that passes, the token is expired and user needs to re-authenticate. Since the sessions are not stored anywhere, it is not possible for the user to log out or to revoke somebody's token. The authenticated session ends when the token expires.

## Notes
To create initial migration:
```
yarn mikro-orm-esm migration:create --initial 
```
