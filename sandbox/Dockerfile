FROM node:20-alpine
RUN addgroup -g 10001 -S archgroup && adduser -u 10001 -S archuser -G archgroup
WORKDIR /workspace
COPY --chown=10001:10001 . /workspace/
USER 10001:10001
ENV NODE_ENV=production
ENTRYPOINT ["node", "scripts/doctor.js"]
