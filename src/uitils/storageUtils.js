/*
进行local数据存储管理的工具模块
 */
import store from 'store';
const USER_KEY = 'user_key';

export default {
    saveUser(user){
        store.set(USER_KEY,user);//内部会自动转换为JSON
    },

    getUser(){
        return store.get(USER_KEY);
    },

    removeUser(){
        store.remove(USER_KEY);
    }
}