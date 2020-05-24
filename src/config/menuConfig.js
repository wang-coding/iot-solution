const menuList = [
    {
        "title": "首页",
        "key": "/home"
    },
    {
        "title": "物联网设备",
        "key": "/equipment",
        "children": [
            {
                "title": "传感器",
                "key": "/equipment/sensor"
            },
            {
                "title": "数据采集器",
                "key": "/equipment/collector"
            },
            {
                "title": "网关",
                "key": "/equipment/gateway"
            }
        ]
    },
    {
        "title": "物联网方案",
        "key": "/solution",
        "children": [
            {
                "title": "方案查询",
                "key": "/solution/search"
            },
            {
                "title": "方案对比",
                "key": "/solution/comparision"
            }
        ]
    },
    {
        "title": "方案社区",
        "key": "/community",
        "children": [
            {
                "title": "交流讨论",
                "key": "/community/discussion"
            },
            {
                "title": "方案共享",
                "key": "/community/share"
            }
        ]
    },
    {
        "title": "管理",
        "key": "/management",
        "children": [
            {
                "title": "物联网设备",
                "key": "/management/equipment"
            },
            {
                "title": "组网方案",
                "key": "/community/solution"
            },
            {
                "title": "权限管理",
                "key": "/community/grant"
            }
        ]
    },
]

export default menuList;