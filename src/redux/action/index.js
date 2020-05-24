/*
 * action 类型
 */
export const type = {
    SENSOR_PARAM : 'SENSOR_PARAM',
    SOLUTION:'SOLUTION',
    LOGIN_NAME: 'LOGIN_NAME',
    LOGIN_ID: 'LOGIN_ID',
    REGISTER: 'REGISTER',
    TAXI_TYPE: 'TAXI_TYPE',
    TAXI_LOCATION: 'TAXI_LOCATION',
    GATHERER_PARAM: 'GATHERER_PARAM',
    GATEWAY_PARAM: 'GATEWAY_PARAM'
}
/*
 * 选择需要执行的action，用dispatch（action函数名）触发
 */

export function exportInfo(info,ty) {
    if(ty =='SOLUTION')
        return {
            type:type.SOLUTION,
            solution:info,
        }
    if (ty == 'LOGIN_NAME')
        return {
            type: type.LOGIN_NAME,
            name: info,
            //id:info.custId
        }
    if (ty == 'SENSOR_PARAM') {
        return {
            type: type.SENSOR_PARAM,
            sensor_type: info.type,
            level: info.level,
            temperature: info.temperature
        }
    }
    if (ty == 'GATHERER_PARAM') {
        return {
            type: type.GATHERER_PARAM,
            //gatherer_type: info.type,
            temperature: info.temperature
        }
    }
    if (ty == 'GATEWAY_PARAM') {
        return {
            type: type.GATEWAY_PARAM,
            level: info.level,
            temperature: info.temperature
        }
    }
    if (ty == 'LOGIN_ID') {
        return {
            type: type.LOGIN_ID,
            id: info
        }
    }
    if (ty == 'REGISTER') {
        return {
            type: type.REGISTER,
            re_state: info
        }
    }
    if (ty == 'TAXI_TYPE') {
        return {
            type: type.TAXI_TYPE,
            taxi_type: info
        }
    }
    if (ty == 'TAXI_LOCATION') {
        return {
            type: type.TAXI_LOCATION,
            taxi_location: info
        }
    }
}
