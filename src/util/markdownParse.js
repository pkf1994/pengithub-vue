import marked from 'marked'
const createDOMPurify = require('dompurify');

export default {
    markdownToHTML: function(raw) {
        if(!raw) return ''
        const DOMPurify = createDOMPurify(window);
        return DOMPurify.sanitize((marked(raw,{breaks:true})))
    }
}