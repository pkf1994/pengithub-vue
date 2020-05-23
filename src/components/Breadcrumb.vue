<template>
    <Container v-if="!disableLastFragment"> 
        <span v-for="(item,index) in pathArr"
                class="text-gray"
                :key="item + index">
                <router-link  class="text-gray" :to="item.routePath" >{{item.fragment}}</router-link><span v-if="index < pathArr.length - 1">{{spaceArround ? ' / ':'/'}}</span>
        </span>
    </Container>
    <Container v-else> 
        <span v-for="(item,index) in pathArr"
                class="text-gray"
                :key="item + index">
                <router-link v-if="index < pathArr.length - 1"  class="text-gray" :to="item.routePath" >{{item.fragment}}</router-link><span v-else>{{item.fragment}}</span><span v-if="index < pathArr.length - 1">{{spaceArround ? ' / ':'/'}}</span>
        </span>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        props: {
            spaceArround: {
                type: Boolean,
                default: false
            },
            displayPath: {
                type: String,
                required: false
            },
            routePath:{
                type: String,
                required: false
            },
            disableLastFragment: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            pathArr(){
                if(!this.displayPath) return
                let _path = this.displayPath
                //去前后/
                let _regExp = new RegExp('^\/')
                let regExp_ = new RegExp('\/$')
                let execResult 
                while(_path.match(_regExp) != null) {
                    _path = _path.replace(_regExp,'')
                }
                while(_path.match(regExp_) != null) {
                    _path = _path.replace(regExp_,'')
                }

                let fragmentArr = []
                
                _path.split('/').reverse().forEach((item,index) => {
                    if(index === 0) fragmentArr.push({
                        fragment: item,
                        fragmentAggregate: ''
                    })
                    if(index > 0) fragmentArr.push({
                        fragment: item,
                        fragmentAggregate: `${fragmentArr[index - 1].fragment}/${fragmentArr[index - 1].fragmentAggregate}`
                    })
                })

                let pathArr = []
                fragmentArr.forEach(item => {
                    let fragmentAggregate = item.fragmentAggregate.replace(/^\//,'').replace(/\/$/,'')
                    pathArr.push({
                        fragment: item.fragment,
                        routePath:(this.routePath ? this.routePath : this.$route.path).replace(fragmentAggregate,'').replace(/\/\//g,'/')
                    })
                }) 

                return pathArr.reverse()
            }
        },
        components: {
            Container: styled.span``
        }
    }
</script>

<style scoped>

</style>