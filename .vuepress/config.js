const { getFiles } = require('../getFiles')
const path = require('path')

function resolve (dir) {
    return path.join(__dirname + '/' + dir)
}
console.log(JSON.stringify(getFiles(resolve('../docs'))))

const files = getFiles(resolve('../docs'))

module.exports = {
    title: '惊蛰',
    description: '微雨众卉新，一雷惊蛰始',
    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }]
    ],
    themeConfig: {
        logo: '/logo.png',
        nav: [
            {
                text: '学习',
                items: [
                    { text: 'web前端', link: '/docs/web前端/' },
                    { text: '', items: [
                            {
                                text: 'nodejs',
                                link: '/docs/nodejs/'
                            },
                            {
                                text: 'vue',
                                link: '/docs/vue/'
                            },
                            {
                                text: '源码',
                                link: '/docs/源码/'
                            },
                            {
                                text: '其他',
                                link: '/docs/other/'
                            }
                        ]
                    }
                ]
                // items: [
                //     { text: 'web前端', link: '/docs/web前端/' },
                //     { text: 'Group1', items: [
                //             {
                //                 text: 'test1',
                //                 link: '/docs/web前端/'
                //             }
                //         ]
                //     }
                // ]
            },
            { text: '关于我', link: '/docs/about/' },
            { text: 'git', link: 'https://github.com/1985zrd' }
        ],
        sidebarDepth: 2,
        // displayAllHeaders: true,
        activeHeaderLinks: true,
        sidebar: files
    }
}
