<template>
    <Container class="container">
        <Time class="commit-group-title">
            <svg class="octicon octicon-git-commit" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10.86 7c-.45-1.72-2-3-3.86-3-1.86 0-3.41 1.28-3.86 3H0v2h3.14c.45 1.72 2 3 3.86 3 1.86 0 3.41-1.28 3.86-3H14V7h-3.14zM7 10.2c-1.22 0-2.2-.98-2.2-2.2 0-1.22.98-2.2 2.2-2.2 1.22 0 2.2.98 2.2 2.2 0 1.22-.98 2.2-2.2 2.2z"></path></svg>
            {{commitGroup.length > 1 ? 'Commits' : 'Commit'}} on {{commitGroup[0].commit.author.date | dateFormat('zzz d, yyyy')}}
        </Time>

        <div class="commit-group Box Box--condensed">
            <CommitItem class="commit-item border-top" v-for="item in commitGroup" :commit="item" :key="item.node_id"/>
        </div>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {AnimatedHeightWrapper,ImgWrapper} from '@/components'
    import CommitItem from './CommitItem'
    export default {
        props: {
            commitGroup: {
                type: Array,
                required: true
            }
        },
        components: {
            AnimatedHeightWrapper,
            ImgWrapper,
            CommitItem,
            Container: styled.div``,
            Time: styled.div``,
            CommitTitle: styled.p``,
            CommitMeta: styled.div``,
            AvatarStack: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/box/index.scss';
@import 'node_modules/@primer/css/avatars/index.scss';
.container{
    padding-top: 15px;
    padding-left: 39px;
    position: relative;
}
.container:before {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 14px;
    z-index: -1;
    display: block;
    width: 2px;
    content: "";
    background-color: #eff1f3;
}
.commit-group-title {
    margin-left: -31px;
    color: #586069;
    svg{
        margin-right: 17px;
        color: #c6cbd1;
        background: #fff;
    }
}

.commit-group {
    margin-top: 10px;
    list-style-type: none;
}

.user-mention {
    font-weight: 600;
    color: #24292e;
    white-space: nowrap;
}

.commit-item:first-child{
    border-top: none!important;
}
</style>