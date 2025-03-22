FROM node:18-alpine
ENV NODE_ENV=production
COPY .output ./white-page
EXPOSE 3000
CMD ["node", "white-page/server/index.mjs"]