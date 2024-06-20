# Pokemon backend API

## Swagger Docs
The Swagger docs are exposed on `/swagger` unprotected endpoint. You can [open the docs](http://localhost:3000/swagger) in your browser and test the API from within the browser.

## Authentication

The Pokemon API is protected with very basic bearer token authentication. The user first needs to authenticate by issuing a POST request to the `/auth` API endpoint. The request body must contain `email` and `password` attributes. For convenience there is already one user in the database so calling the `/auth` endpoint with following request body will successfully authenticate this user and return his bearer token.
```
{
  "email": "admin",
  "password": "admin"
}
```
Use this token as a bearer token for calling protected API endpoints.

The authentication uses JWT token to store information about the authenticated user. The token is signed with a private key (string value) and it contains basic information about the user.

Example:
```
{
  id: 2,
  firstName: 'Tomas',
  lastName: 'Test',
  email: 'mujemail@example.com',
  iat: 1718308376,
  exp: 1718311976
}
```
The token has certain validity period (currently set to one hour). After that time, the token is no longer valid and authentication fails. User must re-authenticate to get fresh token.

`jsonwebtoken` NPM library is used for JWT token handling (to sign and to verify the signature).

## Technical details

## 

### Request and response validation

Request and response validation is managed by fastify-openapi-glue library (delegating the actual validation to the Fastify server if I am not mistaken). It takes the validation rules from the OpenAPI specification.

## Structure of the project

I decided to structure the project by features (authentication, pokemon, user, ...) because I believe it is a good practise. Each feature contains related entities, controllers and services. For simplicity I decided to go with "Active record" design pattern, where entities also contain additional methods to add additional features. I kept most of the business logic in controllers but ideally the business logic should be moved to services.

### NPM libraries

Aside from libraries suggested in this coding challenge description, I decided to use following libraries that I find usefull in general or for this particular project

* [convict](https://www.npmjs.com/package/convict) - to simplify application configuration
* [fastify-openapi-glue](https://www.npmjs.com/package/fastify-openapi-glue) - to bind Fastify web server with OpenAPI specification. It adds routing based on API spec, security handling and request and response validation.
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - to sign and validate signature of JWT tokens. Used in the bearer token authentication
* eslint, prettier - to watch the code quality
* [Volta](https://volta.sh/) - to handle the same Node.js version accross workstations


## Technologies used

By selecting PostgreSQL, MikroORM and Fastify for my project I did not want to express my only interest in Big AI Models projects. I selected these technologies mainly because I wanted to explore new ORM library (MikroORM) and because I wanted to gain more experience with Fastify server.

## Things to improve

This section contains items that were not completelly implemented or were skipped entirely. I wanted to list them here for awareness.

### Authentication

There is no session handling implemented. Users can authenticate as many times in parallel as they want. The authentication token has expiry time and when that passes, the token is expired and user needs to re-authenticate. Since the sessions are not stored anywhere, it is not possible for the user to log out or for the administrator to revoke somebody's token. The authenticated session ends when the token expires.
Another thing to improve is the JWT token signing. Currently the token is signed using secret key which is a string value. In real life private and public key pair should be used for JWT token signature and verification.

### Password hashing
For simplicity, SHA-256 hashing algorithm was picked to hash user passwords. However, for production use, I would propose to use some other hashing algorithm like for example `bcrypt`. As that algorithm is better suitable for password hashing and more difficult to hack (it is computationally slower than SHA-256).

### Error handling and reporting
Fastify's error reporting is too verbose. For example SQL error is returned together with the whole query:
```
{
    "statusCode": 500,
    "code": "SQLITE_CONSTRAINT",
    "error": "Internal Server Error",
    "message": "insert into `user` (`first_name`, `last_name`, `email`, `password`) values ('Tomas', 'Test', 'mujemail@example.com', 'dd1b8ad5f9aba3225ff5052973f24043bbabb9594c077d83f8ea766776500ade') returning `id` - SQLITE_CONSTRAINT: UNIQUE constraint failed: user.email"
}
```
That is not acceptable for production environment. The error message must not expose any details of the application. Such verbose error reporting would need to be disabled for production.

### Typings
As I have not been working with Fastify too much yet, I am not very familiar with how typing works there. Therefore I am missing some types (for example in the handler functions - req, reply, ...) and using `any` instead. It is a bad practice and it should be fixed by correctly typing all the variables.

## Eslint & prettier
The eslint and prettier configuration is probably not 100% correct. I am seeing some warnings when running `yarn install`. Also, I am seeing the issues reported twice in VSCode editor. Although both eslint and prettier seem to work and I am able to view and fix any issues in VSCode or in the cli using `yarn eslint`.

## Code documentation
In a real life product I would pay much more attention to add thorough JSDoc documentation to the code.

## Notes
To create initial migration:
```
yarn mikro-orm-esm migration:create --initial 
```
