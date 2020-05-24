import React from "react";
import {Link, withRouter} from "react-router-dom";
import {Breadcrumb, Icon} from "antd";
import "./index.less"

const breadcrumbNameMap = {
    '/community/discussion': '123',
    '/community/share': '456',
};

const Discussion = withRouter(props => {
    const { location } = props;
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        return (
            <Breadcrumb.Item key={url}>
                <Link to={url}>{breadcrumbNameMap[url]}</Link>
            </Breadcrumb.Item>
        );
    });
    const breadcrumbItems = [
        <Breadcrumb.Item key="home">
            <Link to="/"><Icon type="home" /></Link>
        </Breadcrumb.Item>,
    ].concat(extraBreadcrumbItems);
    return (
            <Breadcrumb className="bread">{breadcrumbItems}</Breadcrumb>
    );
});

export default Discussion;