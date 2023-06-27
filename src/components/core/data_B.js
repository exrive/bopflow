let dataB = {
  "name": " 红塔山小盒",
  "product": "001",
  "orderid": "Order_001",
  "manufactureplanid": "202300101",
  "bopid": "001_01",
  "readonly":false,
  "nodeList": [
    {
      "id": "101",
      "bopid": "001_01",
      "subid": "001_01_101",
      "name": "凹印连线赋码",
      "type": "task",
      "left": "477px",
      "top": "31px",
      "ico": "el-icon-odometer",
      "state": "first",
      "firstflag": true,
      "lastflag": false,
      "require": ""
    },
    {
      "id": "100",
      "bopid": "001_01",
      "subid": "001_01_100",
      "name": "凹印",
      "type": "task",
      "left": "111px",
      "top": "33px",
      "ico": "el-icon-time",
      "state": "first",
      "require": "",
      "firstflag": true,
      "lastflag": false
    },
    {
      "id": "102",
      "name": "离线赋码",
      "type": "task",
      "left": "111px",
      "top": "124px",
      "ico": "el-icon-odometer",
      "state": "success",
      "require": "",
      "firstflag": false,
      "lastflag": false,
      "bopid": "001_01",
      "subid": "001_01_102"
    },
    {
      "id": "501",
      "name": "烫金1",
      "type": "task",
      "left": "177px",
      "top": "338px",
      "ico": "el-icon-shopping-cart-full",
      "state": "success",
      "bopid": "001_01",
      "subid": "001_01_501",
      "require": "",
      "firstflag": false,
      "lastflag": false
    },
    {
      "id": "502",
      "name": "烫金2",
      "type": "task",
      "left": "560px",
      "top": "341px",
      "ico": "el-icon-shopping-cart-full",
      "state": "success",
      "bopid": "001_01",
      "subid": "001_01_502",
      "require": "",
      "firstflag": false,
      "lastflag": false
    },
    {
      "id": "503",
      "name": "烫金3",
      "type": "task",
      "left": "356px",
      "top": "455px",
      "ico": "el-icon-shopping-cart-full",
      "state": "success",
      "bopid": "001_01",
      "subid": "001_01_503",
      "require": "",
      "firstflag": false,
      "lastflag": false
    },
    {
      "id": "601",
      "name": "模切",
      "type": "task",
      "left": "356px",
      "top": "531px",
      "ico": "el-icon-shopping-cart-full",
      "state": "success",
      "bopid": "001_01",
      "subid": "001_01_601",
      "require": "",
      "firstflag": false,
      "lastflag": false
    },
    {
      "id": "800",
      "name": "质检",
      "type": "end",
      "left": "356px",
      "top": "942px",
      "ico": "el-icon-caret-right",
      "state": "last",
      "firstflag": false,
      "lastflag": true,
      "bopid": "001_01",
      "subid": "001_01_800",
      "require": ""
    }
  ],
  "lineList": [
    {
      "id": "100-102",
      "from": "100",
      "to": "102",
      "anchors": [
        "Bottom",
        "Top"
      ],
      "pathtag": "",
      "pdmtype": "SS",
      "pdmvalue": "4",
      "pdmperiod": "H"
    },
    {
      "from": "101",
      "to": "502",
      "anchors": [
        "Right",
        "Right"
      ],
      "pathtag": "P2",
      "label": "P2",
      "pdmtype": "",
      "pdmvalue": "",
      "pdmperiod": "",
      "id": "101_502"
    },
    {
      "from": "102",
      "to": "501",
      "anchors": [
        "Bottom",
        "Left"
      ],
      "pathtag": "P1",
      "label": "P1",
      "pdmtype": "",
      "pdmvalue": "",
      "pdmperiod": "",
      "id": "102_501"
    },
    {
      "from": "101",
      "to": "501",
      "anchors": [
        "Bottom",
        "TopRight"
      ],
      "pathtag": "P1",
      "label": "P1",
      "pdmtype": "",
      "pdmvalue": "",
      "pdmperiod": "",
      "id": "101_501"
    },
    {
      "from": "102",
      "to": "502",
      "anchors": [
        "BottomRight",
        "Top"
      ],
      "pathtag": "P2",
      "label": "P2",
      "pdmtype": "",
      "pdmvalue": "",
      "pdmperiod": "",
      "id": "102_502"
    },
    {
      "from": "501",
      "to": "502",
      "anchors": [
        "Right",
        "Left"
      ],
      "pathtag": "P1",
      "label": "P1 : SS 1H",
      "pdmtype": "SS",
      "pdmvalue": "1",
      "pdmperiod": "H",
      "id": "501_502"
    },
    {
      "from": "502",
      "to": "501",
      "anchors": [
        "BottomLeft",
        "BottomRight"
      ],
      "pathtag": "P2",
      "label": "P2 : SS 0H",
      "pdmtype": "SS",
      "pdmvalue": "0",
      "pdmperiod": "H",
      "id": "502_501"
    },
    {
      "from": "501",
      "to": "503",
      "anchors": [
        "Bottom",
        "Left"
      ],
      "label": "P2 |  ",
      "pdmtype": "",
      "pdmvalue": "",
      "pdmperiod": "",
      "id": "501_503",
      "pathtag": "P2"
    },
    {
      "from": "502",
      "to": "503",
      "anchors": [
        "Bottom",
        "Right"
      ],
      "pathtag": "P1",
      "label": "P1",
      "pdmtype": "",
      "pdmvalue": "",
      "pdmperiod": "",
      "id": "502_503"
    },
    {
      "from": "503",
      "to": "601",
      "anchors": [
        "Bottom",
        "Top"
      ],
      "pathtag": "",
      "pdmtype": "",
      "pdmvalue": "",
      "pdmperiod": "",
      "id": "503_601"
    },
    {
      "from": "601",
      "to": "800",
      "anchors": [
        "Bottom",
        "Top"
      ],
      "pathtag": "",
      "pdmtype": "",
      "pdmvalue": "",
      "pdmperiod": "",
      "id": "601_800"
    }
  ],
  "laneList": [
    {
      "id": "broadwise1",
      "type": "broadwise",
      "text": "凹印车间",
      "top": "0px",
      "left": "0px",
      "resizable": true,
      "draggable": true
    },
    {
      "id": "broadwise2",
      "type": "broadwise",
      "text": "烫模车间",
      "top": "300px",
      "left": "0px",
      "resizable": false,
      "draggable": false
    },
    {
      "id": "broadwise3",
      "type": "broadwise",
      "text": "综合车间",
      "top": "600px",
      "left": "0px",
      "resizable": true,
      "draggable": true
    },
    {
      "id": "broadwise4",
      "type": "broadwise",
      "text": "理数车间",
      "top": "900px",
      "left": "0px",
      "resizable": true,
      "draggable": true
    }
  ]
}


export function getDataB () {
  return dataB;
}
