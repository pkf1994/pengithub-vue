<template>
    <router-link :to="PRRouterLink" class="list-item container">
        <svg v-if="type === 'pullRequest'" class="pr-icon opened" fill="currentColor" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11 11.28V5c-.03-.78-.34-1.47-.94-2.06C9.46 2.35 8.78 2.03 8 2H7V0L4 3l3 3V4h1c.27.02.48.11.69.31.21.2.3.42.31.69v6.28A1.993 1.993 0 0010 15a1.993 1.993 0 001-3.72zm-1 2.92c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zM4 3c0-1.11-.89-2-2-2a1.993 1.993 0 00-1 3.72v6.56A1.993 1.993 0 002 15a1.993 1.993 0 001-3.72V4.72c.59-.34 1-.98 1-1.72zm-.8 10c0 .66-.55 1.2-1.2 1.2-.65 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
        <svg v-if="type === 'issue'" class="pr-icon opened" viewBox="0 0 14 16" fill="currentColor" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 011.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path></svg>
        <RepoFullName class="full-name">
            {{issue.repository.nameWithOwner}}
        </RepoFullName>
        <Meta class="meta">
            #{{issue.number}}
        </Meta>
        <Title class="title">
            {{issue.title}}
        </Title>
        <Byline class="byline">
            Opened by {{issue.author.login}} {{formatDate}}
        </Byline>

        <Labels class="labels relative">
            <span v-for="item in issue.labels.nodes" :meta="issue.id.replace('=','')"  class="label d-inline-block" :key="item.id" :style="{color: isLight(`#${item.color}`) ? 'black' : 'white', background: `#${item.color}`}">
                {{item.name}}
            </span>
        </Labels>
    </router-link>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_dateFormat,util_color} from '../../../../util'
    export default {
        props: {
            issue: {
                type: Object,
                required: true
            },
            type: {
                type: String,
                required: true
            }
        },
        data() {
            return {

            }
        },
        computed: {
            PRRouterLink: function () {
                return this.issue.url.replace("https://github.com","")
            },
            formatDate: function () {
                return util_dateFormat.getDateDiff(this.issue.createdAt)
            }
        },
        mounted() {
            this.adjustStyle()
        },
        methods: {
            isLight: function (color) {
                return util_color.isLight(color)
            },
            adjustStyle() {
                if(!this.issue.labels.nodes || this.issue.labels.nodes.length === 0) return
                let labelElList = document.querySelectorAll(`.labels .label[meta=${this.issue.id.replace('=','')}]`)
                let parent = undefined
                labelElList.forEach((item,index) => {
                    if(!parent) parent = item.parentNode
                    if(index !== (labelElList.length - 1)) {
                        parent.insertBefore(document.createTextNode(" "),item.nextSibling)
                    }
                })
            }
        },
        components: {
            Container: styled.div``,
            RepoFullName: styled.span``,
            Title: styled.strong``,
            Meta: styled.span``,
            Byline: styled.span``,
            Labels: styled.div``
        }
    }
</script>

<style scoped lang="scss">
    .container{
        position: relative;
        width: 100%;
        padding: 14px 15px 14px 35px;
        overflow-wrap: break-word;
        line-height: inherit;
        text-align: left;
    }

    .pr-icon{
        position: absolute;
        top: 14px;
        left: 12px;
        width: 16px;
        text-align: center;
        vertical-align: bottom;
    }

    .full-name{
        display: block;
        margin-bottom: 2px;
        font-size: 12px;
        font-weight: 600;
        color: #586069;
    }

    .opened{
        color: #28a745;
    }

    .title{
        display: block;
        margin-right: 55px;
        margin-bottom: 3px;
        font-weight: 600;
        line-height: 1.2;
        color: #0366d6;
        word-break: break-word;
    }

    .byline{
        display: block;
        margin: 0;
        font-size: 12px;
        color: #586069;
    }

    .meta{
        float: right;
        margin-bottom: 5px;
        margin-left: 5px;
        font-size: 11px;
        color: #6a737d;
    }

    .closed {
        color: #cb2431;
    }

    .labels{
        margin-top: 2px;
        .label{
            height: 18px;
            font-size: 10px;
            line-height: 1.5;
            padding: .15em 4px;
            font-weight: 600;
            border-radius: 2px;
            box-shadow: inset 0 -1px 0 rgba(27,31,35,.12);
        }
    }
</style>