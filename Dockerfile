# 配置运行环境
FROM node:alpine AS deps

# 配置工作目录
WORKDIR /wwwroot

# 切换国内软件源
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories
# 安装编译环境
RUN apk update && apk upgrade -f && apk add --no-cache g++ make python3

# 复制依赖配置
COPY ./LICENSE /wwwroot/LICENSE
COPY ./yarn.lock /wwwroot/yarn.lock
COPY ./package.json /wwwroot/package.json

# 更新 NPM 全局模块
RUN npm update -g
# 安装依赖文件
RUN yarn install --production --pure-lockfile
# 清理安装缓存
RUN npm cache clean -f && yarn cache clean

# 配置运行环境
FROM node:alpine AS runner

# 配置工作目录
WORKDIR /wwwroot

# 配置 Node 运行模式
ENV NODE_ENV production
# 禁用 Next 数据遥测
ENV NEXT_TELEMETRY_DISABLED 1

# 切换国内软件源
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories
# 安装时区依赖
RUN apk update && apk upgrade -f && apk add --no-cache bash tzdata
# 设置默认时区
RUN cp -r -f /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
# 更新 NPM 全局模块
RUN npm update -g
# 清理安装缓存
RUN npm cache clean -f && yarn cache clean

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
