FROM node:19-alpine3.16 AS build

ENV FRONTEND /home/app/
RUN mkdir -p $FRONTEND

WORKDIR $FRONTEND

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Deploy Frontend with 'serve' cmd
FROM node:19-alpine3.16

ENV FRONTEND /home/app/
WORKDIR $FRONTEND

COPY --from=build /home/app/build /home/app/build

RUN npm install -g --force serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]