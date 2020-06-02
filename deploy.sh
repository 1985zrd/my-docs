#!/bin/sh

#运行sh ./deploy.sh

git add .
git commit -m 'add'
git pull
git push

npm run build
cd .vuepress/

tar -cvf dist.gz ./dist
# 上传文件
scp dist.gz root@120.27.8.21:/home/work/docs
printf 'scp transfer done!'
# 连接远端server，解压，清空；
ssh root@120.27.8.21 "cd /home/work/docs;tar -xvf dist.gz;rm -rf dist.gz;"
# done <"$filepth"
printf 'publish done!'