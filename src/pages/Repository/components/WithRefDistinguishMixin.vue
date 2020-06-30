<template>
</template>

<script>
    import { authRequiredGet } from '@/network'
    import * as api from '@/network/api'
    let parse = require('parse-link-header')
    export default {
        data() {
            return {
                allBranchesAndTags: {
                    branches: [],
                    tags: [],
                    loading: false
                },
            }
        },
        computed: {
            path() {
                if(!this.$route.params.pathMatch) return
                if(this.$route.params.pathMatch.indexOf('/') === -1) return ''
                if(!this.currentRef) return undefined
                return this.$route.params.pathMatch.replace(this.currentRef,'').replace(/^\//,'')
            },
            currentRef() {
                let pathMatch = this.$route.params.pathMatch
                if(!pathMatch) {
                    if(this.defaultBranch) return this.defaultBranch
                    if(this.defaultRef) return this.defaultRef
                    return
                }
                if(pathMatch.match(/^[^\/]+\/?$/)) return pathMatch.replace('/','')
                if(this.allBranchesAndTags.branches.length == 0) return
                let ref
                this.allBranchesAndTags.branches.forEach(item => {
                    let regExp =  new RegExp(`^(${item.ref.replace('refs/heads/','')})(\/\.*)?`)
                    let refMatch = pathMatch.match(regExp)
                    if(refMatch){
                        if(!ref) ref = refMatch[1]
                        if(refMatch[1].length > ref.length) ref = refMatch[1]
                    }
                })
                this.allBranchesAndTags.tags.forEach(item => {
                    let regExp =  new RegExp(`^(${item.ref.replace('refs/tags/','')})(\/\.*)?`)
                    let refMatch = pathMatch.match(regExp)
                    if(refMatch){
                        if(!ref) ref = refMatch[1]
                        if(refMatch[1].length > ref.length) ref = refMatch[1]
                    }
                })
                if(!ref) ref = pathMatch.replace(/^\//,'').split('/')[0]
                return ref
            },
            refType() {
                let refType
                try{
                    this.allBranchesAndTags.branches.forEach( i => {
                        let branchName = i.ref.replace('refs/heads/','')
                        if(branchName == this.currentRef) {
                            refType = 'branch'
                            throw new Error('forEach abort')
                        }
                    })
                    this.allBranchesAndTags.tags.forEach( i => {
                        let tagName = i.ref.replace('refs/tags/','')
                        if(tagName == this.currentRef) {
                            refType = 'tag'
                            throw new Error('forEach abort')
                        }
                    })
                }catch(e) {
                    //do nothing
                }
                return refType || 'tree'
            },
            owner() {
                return this.$route.params.owner
            },
            repo() {
                return this.$route.params.repo
            },
        },
        methods: {
            async network_getAllBranchesAndTags() {
                try{
                    this.allBranchesAndTags.loading = true
                    await Promise.all([
                        this.network_getAllBranches(),
                        this.network_getAllTags()
                    ])
                }catch(e) {
                    console.log(e)
                }finally{
                    this.allBranchesAndTags.loading = false
                }
            },
            async network_getAllBranches() {
                let lastPage = 1
                let currentPage = 1
                let branches = []
                while(currentPage <= lastPage) {
                    let url_branches = api.API_GIT_MATCHING_REFS({
                        owner: this.$route.params.owner,
                        repo: this.$route.params.repo,
                        ref: 'heads/',
                        params: {
                            per_page: 100,
                            page: currentPage
                        }
                    })
                    let res = await authRequiredGet(url_branches)
                    let pageInfo = parse(res.headers.link) || {}
                    if(pageInfo.last) lastPage = pageInfo.last.page
                    branches = branches.concat(res.data)
                    currentPage += 1
                }
                
                this.allBranchesAndTags.branches = branches
            },
            async network_getAllTags() {
                let lastPage = 1
                let currentPage = 1
                let tags = []
                while(currentPage <= lastPage) {
                    let url_tags = api.API_GIT_MATCHING_REFS({
                        owner: this.$route.params.owner,
                        repo: this.$route.params.repo,
                        ref: 'tags/',
                        params: {
                            per_page: 100,
                            page: currentPage
                        }
                    })
                    let res = await authRequiredGet(url_tags)
                    let pageInfo = parse(res.headers.link) || {}
                    if(pageInfo.last) lastPage = pageInfo.last.page
                    tags = tags.concat(res.data)
                    currentPage += 1
                }
                this.allBranchesAndTags.tags = tags
            },
        },     
    }
</script>

<style scoped lang="scss">
</style>