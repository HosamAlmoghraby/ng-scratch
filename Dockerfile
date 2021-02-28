# Stage 1, "compile-stage", based on Node.js, to build and compile the app
FROM node:14.15.5 AS compile-stage
WORKDIR /app
COPY ./package.json .
RUN npm install
COPY . .
ARG configuration=production
RUN npm run build -- --output-path=./dist/out --configuration $configuration

# Stage 2, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx
COPY --from=compile-stage /app/dist/out /usr/share/nginx/html
