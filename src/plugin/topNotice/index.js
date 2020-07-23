import {mapState,mapMutations} from 'vuex'
import {MUTATION_APPOINT_TOP_NOTICE} from '@/store/modules/topNotice/mutationTypes'
export default {
    install: (Vue) => {
        Vue.mixin({
            data() {
                return {
                    oneTimeNotice: []
                }
            },
            computed: {
                ...mapState({
                    topNotice: state => state.topNotice
                })
            },
            methods: {
                ...mapMutations({
                    mutation_appointTopNotice: MUTATION_APPOINT_TOP_NOTICE 
                }),
               topNoticeShow(theKey,notice,type = 'normal',isOneTimeNotice = false) {
                   this.mutation_appointTopNotice({
                        theKey,
                        notice,
                        type
                   })
                   if(isOneTimeNotice) {
                       if(!this.oneTimeNotice.some(i => i == theKey)) this.oneTimeNotice.push(theKey)
                   }
               }
            },
            beforeRouteLeave(to,from,next) {
                next()
                this.oneTimeNotice.forEach(i => {
                    this.mutation_appointTopNotice({
                        theKey: i,
                        notice: '',
                        type: 'normal'
                   })
                })
            }
        })
    }
}