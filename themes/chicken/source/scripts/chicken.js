// 为标签追加字体图标
$('.tag-list-item').prepend('<span class="iconfont icon-biaoqian"></span>')

// 回到顶部的猫
$('.back-to-top').click(function () {
    $('html, body').animate({
        scrollTop: 0
    }, 500)
})

// 监听 回到顶部的猫 是否显示
$(document).scroll(function () {
    if ($(document).scrollTop() > 50) {
        $('.back-to-top').addClass('show')
    } else {
        $('.back-to-top').removeClass('show')
    }
})

// 在表格外包裹一层，用来生成滚动条
$('.post-content > table').wrap('<div class="table-container"></div>')

// Tocbot 实例化，用来快速生成文档目录
tocbot.init({
    tocSelector: '.toc', // 渲染目录的容器
    contentSelector: '.post-content', // 标题所在的容器
    headingSelector: 'h2, h3', // 要渲染的目录层级,
    headingsOffset: -50, // 微调目录高亮的显示位置（偏移量），防止点击的链接和高亮的链接不一致
})

// 初始化代码高亮 highlight.js
hljs.initHighlightingOnLoad()