import React from "react";
import {HashRouter, Route, Switch} from "react-router-dom";
import App from './App';
import Admin from "./admin";
import Home from "./pages/home"
import {connect} from "react-redux";
import Login from "./pages/login";
import Register from "./pages/register"
import Sensor from "./pages/sensor";
import Collector from "./pages/collector"
import Gateway from "./pages/gateway"
import D_Sensor from "./pages/detail/D_Sensor";
import D_Gatherer from "./pages/detail/D_Gatherer";
import D_Gateway from "./pages/detail/D_Gateway";
import Search from "./pages/solution/Search";
import Discussion from "./pages/discussion";
import Comparision from "./pages/comparision";
import Share from "./pages/share";
import Bookmarks from "./pages/bookmarks";
import SensorManage from "./pages/manage/sensor"
import SensorDetail from "./pages/manage/detail/D_Sensor"

class IRouter extends React.Component {

    render() {
        return (
            <HashRouter>
                <App>
                    <Switch>
                        <Route path="/register" component={Register}/>
                        <Route path="/login" component={Login}/>
                        <Admin>
                            <Switch>
                                <Route path="/equipment" render={() =>
                                    <Switch>
                                        <Route path="/equipment/sensor" component={Sensor}/>
                                        <Route path="/equipment/collector" component={Collector}/>
                                        <Route path="/equipment/gateway" component={Gateway}/>
                                        <Route path="/equipment/detail/sensor/:id" component={D_Sensor}/>
                                        <Route path="/equipment/detail/gatherer/:id" component={D_Gatherer}/>
                                        <Route path="/equipment/detail/gateway/:id" component={D_Gateway}/>
                                    </Switch>
                                }/>
                                <Route path="/solution" render={() =>
                                    <Switch>
                                        <Route path="/solution/search" component={Search}/>
                                        <Route path="/solution/comparision" component={Comparision}/>
                                    </Switch>
                                }/>
                                <Route path="/community" render={() =>
                                    <Switch>
                                        <Route path="/community/discussion" component={Discussion}/>
                                        <Route path="/community/share" component={Share}/>
                                    </Switch>
                                }/>
                                <Route path="/management" render={() =>
                                    <Switch>
                                        <Route path="/management/equipment" component={SensorManage}/>
                                        <Route path="/management/detail/sensor/:id" component={SensorDetail}/>
                                    </Switch>
                                }/>
                                <Route path="/bookmarks" component={Bookmarks}/>
                                <Route render={() => {
                                    return (
                                        <Switch>
                                            <Route path="/home" component={Home}/>
                                            <Route component={Home}/>
                                        </Switch>
                                    )
                                }
                                }
                                />
                            </Switch>
                        </Admin>
                    </Switch>
                </App>
            </HashRouter>
        );
    }
}

const mapStateToProps = state => {
    return {
        name: state.name
    }
}
export default connect(mapStateToProps)(IRouter);
