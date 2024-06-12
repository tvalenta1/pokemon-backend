# pokemon-backend

# Things to improve

This section contains items that were not completelly implemented or were skipped entirely. I wanted to list them here for awareness.

## Authentication

There is no session handling implemented. Users can authenticate as many times in parallel as they want. The authentication token has expiry time and when that passes, the token is expired and user needs to re-authenticate. Since the sessions are not stored anywhere, it is not possible for the user to log out or to revoke somebody's token. The authenticated session ends when the token expires.

# Notes
To create initial migration:
```
yarn mikro-orm-esm migration:create --initial 
```
