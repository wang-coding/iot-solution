/**
 * reducer
 */
import {type} from "../action";

/**
 *
 * @param state 调用时redux自动填充
 * @param action 接收要执行的action方法
 */
const dbState =  (state ,action)=>{
    switch (action.type) {
        case type.GATEWAY_PARAM:
            return {
                ...state,
                level:action.level,
                temperature:action.temperature
            }
        case type.GATHERER_PARAM:
            return{
                ...state,
                //type:action.gatherer_type,
                temperature:action.temperature
            }
            break;
        case type.SENSOR_PARAM:
            return {
                ...state,  //保留原有状态
                type:action.sensor_type,
                level:action.level,
                temperature:action.temperature
            }
            break;
        case type.LOGIN_NAME:
            return {
                ...state,  //保留原有状态
                name:action.name,
                //id:action.id
            }
            break;
        case type.LOGIN_ID:
            return {
                ...state,  //保留原有状态
                id:action.id
            }
            break;
        case type.REGISTER:
            return {
                ...state,  //保留原有状态
                re_state:action.re_state
            }
            break;
        case type.TAXI_TYPE:
            return {
                ...state,  //保留原有状态
                taxi_type:action.taxi_type
            }
            break;
        case type.TAXI_LOCATION:
            return {
                ...state,  //保留原有状态
                taxi_location:action.taxi_location
            }
            break;
        case type.SOLUTION:
            return {
                ...state,  //保留原有状态
                solution:action.solution,
                //id:action.id
            }
            break;
        default:
            return {...state};

    }
}
export default dbState;