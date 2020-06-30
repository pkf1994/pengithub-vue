<template>
    <router-link class="Box-row Box-row--focus-gray py-2 d-flex position-relative js-navigation-item navigation-focus bg-white" :to="routerLink">
        <FileIcon v-if="content.type == 'dir' || content.type == 'file'" class="mr-3 flex-shrink-0">
            <svg v-if="content.type == 'dir'" height="16" class="octicon octicon-file-directory color-blue-3" color="blue-3" aria-label="Directory" viewBox="0 0 16 16" version="1.1" width="16" role="img"><path fill-rule="evenodd" d="M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25v-8.5A1.75 1.75 0 0014.25 3h-6.5a.25.25 0 01-.2-.1l-.9-1.2c-.33-.44-.85-.7-1.4-.7h-3.5z"></path></svg>
            <svg v-else height="16" class="octicon octicon-file text-gray-light" color="gray-light" aria-label="File" viewBox="0 0 16 16" version="1.1" width="16" role="img"><path fill-rule="evenodd" d="M3.75 1.5a.25.25 0 00-.25.25v11.5c0 .138.112.25.25.25h8.5a.25.25 0 00.25-.25V6H9.75A1.75 1.75 0 018 4.25V1.5H3.75zm5.75.56v2.19c0 .138.112.25.25.25h2.19L9.5 2.06zM2 1.75C2 .784 2.784 0 3.75 0h5.086c.464 0 .909.184 1.237.513l3.414 3.414c.329.328.513.773.513 1.237v8.086A1.75 1.75 0 0112.25 15h-8.5A1.75 1.75 0 012 13.25V1.75z"></path></svg>
        </FileIcon>

        <FileName class="flex-auto min-width-0 col-md-2 mr-3">
            <span class="css-truncate css-truncate-target d-block width-fit">
                <router-link class="js-navigation-open link-gray-dark"  :to="routerLink">
                    {{content.name}}
                </router-link>
            </span>
        </FileName>

        <UpdatedAt class="text-gray-light text-right" style="width:100px;">
            <transition name="fade" appear>
                <span class="no-wrap" v-if="content.committedDate">{{content.committedDate | getDateDiff}}</span>
            </transition>
        </UpdatedAt>
    </router-link>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        props: {
            content: Object,
            currentRef: String,
        },
        computed:{
            routerLink() {
                if(this.content.type == 'prevLink') return this.$route.path.replace(/\/$/,'').replace(/\/[^\/]*$/g,'')
                if(this.content.type == 'dir') return `/${this.owner}/${this.repo}/tree/${this.currentRef}/${this.content.path}`
                return `/${this.owner}/${this.repo}/blob/${this.currentRef}/${this.content.path}`
            },
            owner() {
                return this.$route.params.owner
            },
            repo() {
                return this.$route.params.repo
            },
        },
        components: {
            Container: styled.div``,
            FileIcon: styled.div``,
            FileName: styled.div``,
            UpdatedAt: styled.div``
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/box/index.scss';
@import 'node_modules/@primer/css/truncate/index.scss';
</style>