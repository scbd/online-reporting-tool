FROM node:20

WORKDIR /usr/src/app

COPY package.json ./

RUN yarn run clean-reinstall

COPY . ./

RUN yarn run build

ENV PORT 8000

EXPOSE 8000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=8000

CMD ["node", ".output/server/index.mjs"]