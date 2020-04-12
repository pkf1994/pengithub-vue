import * as api from '@/network/api'
import {authRequiredGet} from '@/network'
import {MUTATION_RESOLVE_NOTIFICATIONS_COUNT} from './mutations'
import * as actionType from './actionTypes'
const parse = require('parse-link-header')

export default {
    async [actionType.ACTION_GET_UNREAD_NOTIFICATIONS_COUNT](context,payload) {
        try{
            context.commit({
                type: 'TRIGGER_LOADING',
                actionType: actionType.ACTION_GET_UNREAD_NOTIFICATIONS_COUNT,
                loading: true
            })   

            let url = api.API_USER_NOTIFICATIONS({
                per_page: 1
            })
            const res = await authRequiredGet(url)
            console.log(res)

            let pageInfo = parse(res.headers.link) || {}
            
            let count
            if(pageInfo.last) {
                count = pageInfo.last.page
            }else if(res.data.length != 0) {
                count = 1
            }else {
                count = 0
            }

            context.commit({
                type: MUTATION_RESOLVE_NOTIFICATIONS_COUNT,
                data: count
            })

            context.commit({
                type: 'TRIGGER_LOADING',
                actionType: actionType.ACTION_GET_UNREAD_NOTIFICATIONS_COUNT,
                loading: false
            })   
        }catch(e) {
            context.commit({
                type: 'TRIGGER_LOADING',
                actionType: actionType.ACTION_GET_UNREAD_NOTIFICATIONS_COUNT,
                loading: false
            })  
            console.log(e)
            throw(e)
        }   
    }
}

