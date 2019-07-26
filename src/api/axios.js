import axios from 'axios'
import Vue from 'vue'
import store from '../store'
import Router from '../router'
import { LoadingBar, Message, Modal } from 'iview'
Vue.use(LoadingBar, Message, Modal)

let CancelToken = axios.CancelToken //取消实例
window._axiosPromiserArr = []
//建立实例
const service = axios.create({
    // 设置超时时间
    timeout: 14000,
    baseURL: process.env.VUE_APP_BASE_URL,
    cancelToken: new CancelToken(function(cancel) {
        window._axiosPromiserArr.push({ cancel })
    }),
    headers: {}
})
//用户活跃时间
let USERTIMEOUT = 900 //15分钟
let userUpdate = function() {
    let timeout = setInterval(() => {
        USERTIMEOUT--
        if (!USERTIMEOUT) {
            store.dispatch('handleReset')
            sessionStorage.clear()
            Router.push('/')
            clearInterval(timeout)
            USERTIMEOUT = 900
            Modal.warning({
                title: '温馨提示',
                content: '登录超时，请重新登录'
            })
        }
    }, 1000)
}
service.defaults.headers.post['Content-Type'] =
    'application/x-www-form-urlencoded'
let loading = null
service.interceptors.request.use(
    config => {
        //如果是不是轮训接口，就重置倒计时

        if (config.url.indexOf('getissue') == -1) {
            //重置倒计时
            USERTIMEOUT = 900
        }

        // 在请求先展示加载框
        const token = sessionStorage.getItem('token')
        if (token) {
            config.headers['Authorization'] = token
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

/**
 * 请求响应拦截
 * 用于处理需要在请求返回后的操作
 */
service.interceptors.response.use(
    response => {
        // 请求响应后关闭加载框
        LoadingBar.start()
        const responseCode = response.status
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
        // 否则的话抛出错误
        if (responseCode === 200) {
            LoadingBar.finish()
            let code = response.data.code
            switch (code) {
                //已从其他端口登录
                case 0:
                    if (response.config.url.indexOf('userlogin') != -1) {
                        userUpdate()
                    }
                    return Promise.resolve(response.data)
                //其他地方登陆
                case -15:
                //操作超时，未登录
                case -13:
                case -51:
                    Message.error(response.data.msg)
                    store.dispatch('handleReset')
                    sessionStorage.clear()
                    Router.push('/')
                    return new Promise(() => {})
                case -81:
                    return Promise.reject(response.data)
                default:
                    Message.error(response.data.msg)
                    return new Promise(() => {})
            }
        } else {
            LoadingBar.error()
            return Promise.resolve(response)
        }
    },
    error => {
        // 请求响应后关闭加载框
        LoadingBar.error()
        if (!error.response) {
            // 请求超时状态
            if (error.message.includes('timeout')) {
                Message.error('链接超时,请从新操作')
            } else {
                Message.error('断网了')
            }
        } else {
            const responseCode = error.response.status
            switch (responseCode) {
                case 401:
                case 403:
                case 404:
                case 500:
                    Message.error('服务器链接错误...请稍后登录')
                    store.dispatch('handleReset')
                    sessionStorage.clear()
                    Router.push('/')
                default:
            }
        }
        window._axiosPromiserArr.forEach((ele, index) => {
            ele.cancel()
            delete window._axiosPromiseArr[index]
        })
        return new Promise(() => {})
    }
)
export default service
