<template>
    <container>
        <svg aria-label="directory" v-if="fileType === 'dir'" viewBox="0 0 14 16" version="1.1" width="14" height="16" role="img"><path fill-rule="evenodd" d="M13 4H7V3c0-.66-.31-1-1-1H1c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM6 4H1V3h5v1z"></path></svg>
        <svg aria-label="binary" v-else-if="fileType === 'binary'" viewBox="0 0 12 16" version="1.1" width="12" height="16" role="img"><path fill-rule="evenodd" d="M4 12h1v1H2v-1h1v-2H2V9h2v3zm8-7.5V14c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h7.5L12 4.5zM11 5L8 2H1v12h10V5zM8 4H6v1h1v2H6v1h3V7H8V4zM2 4h3v4H2V4zm1 3h1V5H3v2zm3 2h3v4H6V9zm1 3h1v-2H7v2z"></path></svg>
        <svg aria-label="markup" v-else-if="fileType === 'book'" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M3 5h4v1H3V5zm0 3h4V7H3v1zm0 2h4V9H3v1zm11-5h-4v1h4V5zm0 2h-4v1h4V7zm0 2h-4v1h4V9zm2-6v9c0 .55-.45 1-1 1H9.5l-1 1-1-1H2c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h5.5l1 1 1-1H15c.55 0 1 .45 1 1zm-8 .5L7.5 3H2v9h6V3.5zm7-.5H9.5l-.5.5V12h6V3z"></path></svg>
        <svg aria-label="media" v-else-if="fileType === 'image'" viewBox="0 0 12 16" version="1.1" width="12" height="16" role="img"><path fill-rule="evenodd" d="M6 5h2v2H6V5zm6-.5V14c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h7.5L12 4.5zM11 5L8 2H1v11l3-5 2 4 2-2 3 3V5z"></path></svg>
        <i v-else-if="fileType === 'zip'" class="iconfont icon-zip"/>
        <i v-else-if="fileType === 'videa'" class="iconfont icon-Moviefile"/>
        <i v-else-if="fileType === 'audio'" class="iconfont icon-fileaudioo"/>
        <svg aria-label="file" v-else viewBox="0 0 12 16" version="1.1" width="12" height="16" role="img"><path fill-rule="evenodd" d="M6 5H2V4h4v1zM2 8h7V7H2v1zm0 2h7V9H2v1zm0 2h7v-1H2v1zm10-7.5V14c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h7.5L12 4.5zM11 5L8 2H1v12h10V5z"></path></svg>
        <span>{{file.name}}</span>
        <AnimatedHeightWrapper>
            <UpdatedAt class="updated-at" v-if="file.committedDate">
                {{file.committedDate | getDateDiff}}
            </UpdatedAt>  
        </AnimatedHeightWrapper>
    </container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {AnimatedHeightWrapper} from '@/components'
    import {util_analyseFileType} from '@/util'
    export default {
        props: {
            file: {
                type: Object,
                required: true
            }
        },
        computed: {
            fileType(){
                if(this.file.type === "dir") {
                    return "dir"
                }
                return util_analyseFileType.analyseContentTypeByFileName(this.file.name)
            }
        },
        components: {
            AnimatedHeightWrapper,
            container: styled.div``,
            UpdatedAt: styled.div``
        }
    }
</script>

<style scoped lang="scss">
.list-item{
    svg,i{
        position: absolute;
        top: 16px;
        color: rgba(3,47,98,.5);
        position: absolute;
        left: 12px;
        width: 16px;
        text-align: center;
        vertical-align: bottom;
        display: inline;
        fill: currentColor;
    }
}
.updated-at{
    float: none;
    padding: 5px 0 0;
    font-size: 11px;
    color: #6a737d;
}
</style>