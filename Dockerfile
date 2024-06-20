FROM node:20.12.2@sha256:740804d1d9a2a05282a7a359446398ec5f233eea431824dd42f7ba452fa5ab98

EXPOSE 3000:3000
WORKDIR /app

# Add source files
ADD ./ .

# # Install dependencies
RUN yarn install

# # Build server
RUN yarn build

# # Start server
CMD yarn start:prod
