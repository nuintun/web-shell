# 配置运行环境
FROM node:latest AS deps

# 配置工作目录
WORKDIR /wwwroot

# 复制依赖配置
COPY ./yarn.lock /wwwroot/yarn.lock
COPY ./package.json /wwwroot/package.json

# 安装依赖文件
RUN yarn install --production --pure-lockfile

# 配置运行环境
FROM node:latest AS runner

# 配置工作目录
WORKDIR /wwwroot

# 配置 Node 运行模式
ENV NODE_ENV production
# 禁用 Next 数据遥测
ENV NEXT_TELEMETRY_DISABLED 1

# 设置默认时区
RUN cp -r -f /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

# 复制项目资源
COPY ./.env /wwwroot/.env
COPY ./.boot /wwwroot/.boot
COPY ./.next /wwwroot/.next
COPY ./public /wwwroot/public
COPY ./package.json /wwwroot/package.json
COPY ./next.config.js /wwwroot/next.config.js
COPY --from=deps /wwwroot/node_modules /wwwroot/node_modules

# 配置默认端口
EXPOSE 3000

# 运行项目
CMD ["yarn", "start"]
