import MarkdownIt from "markdown-it";

export const markdownHtmlParser = new MarkdownIt({
    html: true,
    xhtmlOut: true,
    breaks: false,
    langPrefix: 'language-',
    linkify: false,
    typographer: false,
    quotes: '“”‘’'
})//.use(mik)