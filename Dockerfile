FROM node:20

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn run clean-reinstall

COPY . ./

RUN NODE_OPTIONS="--max-old-space-size=4096" yarn run build

ENV PORT=8000

EXPOSE 8000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=8000

ARG TAG
ENV NUXT_PUBLIC_TAG=$TAG

ARG COMMIT
ENV NUXT_PUBLIC_COMMIT=$COMMIT

CMD ["node", ".output/server/index.mjs"]