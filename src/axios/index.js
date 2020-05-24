
import axios from 'axios'
import {Modal} from "antd";
import qs from "qs";
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

//将第三方插件再做一次封装，易于排错
export default class Axios{
    static requestList(url,params,isShowLoading,method){
        let data = {
            params:params,
            isShowLoading:isShowLoading || false
        }
        return new Promise((resolve,reject)=>{
            this.ajax({
                url,
                data,
                method,
            }).then((data)=>{
                let _list = [];
                if(data && data.result ){
                    if(data.result.list){
                        _list = data.result.list.map((item, index) => {
                            item.key = index;
                            return item
                        });
                        resolve({list:_list,result:data.result});
                    }else {
                        resolve({result:data.result});
                    }
                }else {
                    reject(data);
                }

            })
        })

    }

    static ajax(options){

        let loading;
        if(options.data && options.data.isShowLoading !== false){
            loading = document.getElementById('ajaxLoading');
            loading.style.display = 'block';
        }
        let baseApi = " http://49.235.254.120:7300/mock/5e4b939532cd956c763b4329";
        //let baseApi ="http://172.81.239.25:8080";
        let data =  (options.data && options.data.params) || ''
        return new Promise((resolve,reject)=>{
            /*axios({
                url:options.url,
                method:options.method || 'get',
                baseURL:baseApi,
                timeout:5000,
                param:qs.stringify(data),
            }).*/
            axios.post(baseApi+options.url,qs.stringify(data)).
            then((response)=>{
                if(options.data && options.data.isShowLoading !== false){
                    loading = document.getElementById('ajaxLoading');
                    loading.style.display = 'none';
                }
                if(response.status == '200'){
                    let res =response.data;
                    if (res.code == '0'){
                        resolve(res);
                    }else {
                        Modal.info({
                            title:"提示",
                            content:res.msg
                        })
                    }
                }else {
                    reject(response.data);
                }
            })
        })
    }
}