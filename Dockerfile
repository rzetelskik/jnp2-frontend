FROM mhart/alpine-node:14.6.0 as build
WORKDIR /opt/app
COPY package.json yarn.lock ./
RUN yarn install
COPY . ./
RUN node_modules/.bin/ng build --prod --output-path=./dist/out 

FROM nginx:1.15
COPY --from=build /opt/app/dist/out/ /usr/share/nginx/html
COPY ./src/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
