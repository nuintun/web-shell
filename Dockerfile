# 配置运行环境
FROM node:alpine AS deps

# 配置工作目录
WORKDIR /wwwroot

# 安装编译环境
RUN apk update && apk add g++ make python3

# 复制依赖配置
COPY ./LICENSE /wwwroot/LICENSE
COPY ./yarn.lock /wwwroot/yarn.lock
COPY ./package.json /wwwroot/package.json

# 安装依赖文件
RUN yarn install --production --pure-lockfile

# 配置运行环境
FROM node:alpine AS runner

# 配置工作目录
WORKDIR /wwwroot

# 配置 Node 运行模式
ENV NODE_ENV production
# 禁用 Next 数据遥测
ENV NEXT_TELEMETRY_DISABLED 1

# 安装时区依赖
RUN apk update && apk add bash tzdata
# 设置默认时区
RUN cp -r -f /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

# 复制项目资源
COPY ./.env /wwwroot/.env
COPY ./.boot /wwwroot/.boot
COPY ./.next /wwwroot/.next
COPY ./public /wwwroot/public
COPY ./LICENSE /wwwroot/LICENSE
COPY ./package.json /wwwroot/package.json
COPY ./next.config.js /wwwroot/next.config.js
COPY --from=deps /wwwroot/node_modules /wwwroot/node_modules

# 配置默认端口
EXPOSE 3000

# 运行项目
CMD ["yarn", "start"]
