import axios from "axios";
import {API_TRENDING} from "../api";


export const RequestTrendingRepositoryList = (payload) => {
    let api = API_TRENDING(payload.language,payload.since)
    return axios.get(api).then(res => {
        return res
    })
}