<template>
    <Container class="py-4 border-bottom">
        <Star class="float-right mt-1 ml-1">
           <StarBtn :repo="repository.name" :owner="repository.owner.login" :viewerHasStarred="comprehensiveRepository.viewerHasStarred"></StarBtn>
        </Star>
        
        <Name class="mb-1 wb-break-all">
            <router-link :to="`/${comprehensiveRepository.owner.login}/${comprehensiveRepository.name}`">{{comprehensiveRepository.name}}</router-link>
        </Name>

        <ForkFromInfo v-if="comprehensiveRepository.parent" class="f6 text-gray mb-1">
            Forked from {{comprehensiveRepository.parent.nameWithOwner}}
        </ForkFromInfo>

        <Description v-if="comprehensiveRepository.descriptionHTML" class="text-gray mb-2 pr-4" v-html="comprehensiveRepository.descriptionHTML">
        </Description>
        <Description v-else class="text-gray mb-2 pr-4">
            {{comprehensiveRepository.description}}
        </Description>

        <Topics class="flex-wrap flex-items-center f6 my-1">
            <router-link :to="`/topics/${item}`" v-for="item in comprehensiveRepository.topics.slice(0,5)" :key="item" class="topic-tag topic-tag-link f6 my-1">{{item}}</router-link>
        </Topics>

        <TheMeta class="f6 text-gray mt-2">
            <PrimaryLanguage class="mr-3" v-if="comprehensiveRepository.language">
                <transition name="fade" appear>
                    <span v-if="comprehensiveRepository.primaryLanguage && comprehensiveRepository.primaryLanguage.color" class="repo-language-color" :style="{backgroundColor: comprehensiveRepository.primaryLanguage.color}"></span>
                </transition>
                {{comprehensiveRepository.language}}
            </PrimaryLanguage>

            <StarStatistic class="mr-3">
                <svg aria-label="star" class="octicon octicon-star" viewBox="0 0 14 16" version="1.1" width="14" height="16" role="img"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg>
                {{comprehensiveRepository.stargazers_count | thousands}}
            </StarStatistic>
            
            <ForkStatistic class="mr-3">
                <svg aria-label="fork" class="octicon octicon-repo-forked" viewBox="0 0 10 16" version="1.1" width="10" height="16" role="img"><path fill-rule="evenodd" d="M8 1a1.993 1.993 0 00-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 002 1a1.993 1.993 0 00-1 3.72V6.5l3 3v1.78A1.993 1.993 0 005 15a1.993 1.993 0 001-3.72V9.5l3-3V4.72A1.993 1.993 0 008 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
                {{comprehensiveRepository.forks_count | thousands}}
            </ForkStatistic>

            <License v-if="comprehensiveRepository.license" class="mr-3">
                <svg class="octicon octicon-law mr-1" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 4c-.83 0-1.5-.67-1.5-1.5S6.17 1 7 1s1.5.67 1.5 1.5S7.83 4 7 4zm7 6c0 1.11-.89 2-2 2h-1c-1.11 0-2-.89-2-2l2-4h-1c-.55 0-1-.45-1-1H8v8c.42 0 1 .45 1 1h1c.42 0 1 .45 1 1H3c0-.55.58-1 1-1h1c0-.55.58-1 1-1h.03L6 5H5c0 .55-.45 1-1 1H3l2 4c0 1.11-.89 2-2 2H2c-1.11 0-2-.89-2-2l2-4H1V5h3c0-.55.45-1 1-1h4c.55 0 1 .45 1 1h3v1h-1l2 4zM2.5 7L1 10h3L2.5 7zM13 10l-1.5-3-1.5 3h3z"></path></svg>
                {{comprehensiveRepository.license.name}}
            </License>

            <UpdatedAt>
                Updated {{comprehensiveRepository.updated_at | getDateDiff}}
            </UpdatedAt>
        </TheMeta>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {AnimatedHeightWrapper,StarBtn} from '@/components'
    export default {
        inject: ['extraDataProvided'],
        props: {
            repository: {
                type: Object,
                required: true
            }
        },
        computed: {
            comprehensiveRepository() {
                let extraData = this.extraDataProvided().filter(i => {
                    return i.id == this.repository.node_id
                })[0] || {}
                return Object.assign({},this.repository,extraData)
            }
        },
        components: {
            AnimatedHeightWrapper,
            StarBtn,
            Container: styled.div``,
            Star: styled.div``,
            Name: styled.h3``,
            ForkFromInfo: styled.span``,
            Description: styled.p``,
            Topics: styled.div``,
            TheMeta: styled.div``,
            PrimaryLanguage: styled.span``,
            StarStatistic: styled.span``,
            ForkStatistic: styled.span``,
            License: styled.span``,
            UpdatedAt: styled.span``,
        }
    }
</script>

<style scoped lang="scss">
.topics-row-container {
    height: 30px;
    overflow: hidden;
}

.topic-tag {
    display: inline-block;
    padding: .3em .9em;
    margin: 0 .5em .5em 0;
    white-space: nowrap;
    background-color: #f1f8ff;
    border-radius: 3px;
}

.repo-language-color {
    position: relative;
    top: 1px;
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
}
</style>