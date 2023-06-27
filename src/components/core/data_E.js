var dataE = {
    name: '流程E，力导图',
    nodeList: [
        {
            id: 'nodeA',
            name: '流程D-节点A',
            type: 'task',
            ico: 'el-icon-user-solid',
            state: 'success'
        },
        {
            id: 'nodeB',
            type: 'task',
            name: '流程D-节点B',
            ico: 'el-icon-goods',
            state: 'error'
        },
        {
            id: 'nodeC',
            name: '流程D-节点C',
            type: 'task',
            ico: 'el-icon-present',
            state: 'warning'
        }, {
            id: 'nodeD',
            name: '流程D-节点D',
            type: 'task',
            ico: 'el-icon-present',
            state: 'running'
        }
    ],
    lineList: [{
        from: 'nodeA',
        to: 'nodeB',
      "pdmtype":"",
      "pdmvalue":"",
      "pdmperiod":""
    }, {
        from: 'nodeA',
        to: 'nodeC',
        label: 'hello',
      "pdmtype":"",
      "pdmvalue":"",
      "pdmperiod":""
    }, {
        from: 'nodeB',
        to: 'nodeD',
      "pdmtype":"",
      "pdmvalue":"",
      "pdmperiod":""
    }, {
        from: 'nodeC',
        to: 'nodeD',
      "pdmtype":"",
      "pdmvalue":"",
      "pdmperiod":""
    }, {
        from: 'nodeC',
        to: 'nodeC',
      "pdmtype":"",
      "pdmvalue":"",
      "pdmperiod":""
    }
    ]
}

export function getDataE() {
    return dataE
}
