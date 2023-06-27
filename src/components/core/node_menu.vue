<template>
    <div class="flow-menu" ref="tool">
        <div v-show="this.laneMenuVisible==true" >
          <span class="ef-node-pmenu" >{{this.localCaption.lane}}</span>
          <ul  class="ef-node-menu-ul" v-for="laneitem in this.laneMenuList"  >
            <draggable @end="endLane" @start="moveLane"   :options="draggableOptions">
              <li  class="ef-node-menu-li" :key="laneitem.id" :type="laneitem.type" :tag="laneitem.id">
                <i :class="{'bi-distribute-vertical':laneitem.type=='broadwise','bi-distribute-horizontal':laneitem.type=='direction'}" ></i> {{laneitem.name}}
              </li>
            </draggable>
          </ul>
        </div>
        <div v-for="menu  in  menuList" :key="menu.id">
            <span class="ef-node-pmenu" @click="menu.open = !menu.open"><i :class="{'el-icon-caret-bottom': menu.open,'el-icon-caret-right': !menu.open}"></i>&nbsp;{{menu.name}}</span>
            <ul v-show="menu.open" class="ef-node-menu-ul">
                <draggable @end="end" @start="move" v-model="menu.children" :options="draggableOptions">
                    <li v-for="subMenu in menu.children" class="ef-node-menu-li" :key="subMenu.id" :type="subMenu.type" :tag="subMenu.id">
                        <i :class="subMenu.ico"></i> {{subMenu.name}}
                    </li>
                </draggable>
            </ul>
        </div>
    </div>
</template>
<script>
    import draggable from 'vuedraggable'
    import {localDict} from "./localdict";

    var mousePosition = {
        left: -1,
        top: -1
    }

    export default {
      props: {
        laneMenuVisible: Boolean
      },
        data() {
            return {
                activeNames: '1',
                // draggable配置参数参考 https://www.cnblogs.com/weixin186/p/10108679.html
                draggableOptions: {
                    preventOnFilter: false,
                    sort: false,
                    disabled: false,
                    ghostClass: 'tt',
                    // 不使用H5原生的配置
                    forceFallback: true,
                    // 拖拽的时候样式
                    // fallbackClass: 'flow-node-draggable'
                },
                // 默认打开的左侧菜单的id
                defaultOpeneds: ['1', '2'],
                laneMenuList:[
                  {
                    id:'broadwise',
                    name:'横向泳道',
                    type:'broadwise',
                  },
                  {
                    id:'direction',
                    name:'纵向泳道',
                    type:'direction',
                  }
                ],
                menuList: [
                    {
                        id: '1',
                        type: 'group',
                        name: '凹印车间',
                        ico: 'el-icon-video-play',
                        open: true,
                        children: [
                            {
                                id: '100',
                                type: 'task',
                                name: '凹印',
                                ico: 'el-icon-time',
                                // 自定义覆盖样式
                                style: {}
                            }, {
                                id: '101',
                                type: 'task',
                                name: '凹印连线赋码',
                                ico: 'el-icon-odometer',
                                // 自定义覆盖样式
                                style: {}
                            }, {
                            id: '102',
                            type: 'task',
                            name: '离线赋码',
                            ico: 'el-icon-odometer',
                            // 自定义覆盖样式
                            style: {}
                          }
                        ]
                    },
                    {
                        id: '5',
                        type: 'group',
                        name: '烫模车间',
                        ico: 'el-icon-video-pause',
                        open: true,
                        children: [
                            {
                                id: '501',
                                type: 'task',
                                name: '烫金1',
                                ico: 'el-icon-shopping-cart-full',
                                // 自定义覆盖样式
                                style: {}
                            }, {
                                id: '502',
                                type: 'task',
                                name: '烫金2',
                                ico: 'el-icon-shopping-cart-full',
                                // 自定义覆盖样式
                                style: {}
                            }, {
                            id: '503',
                            type: 'task',
                            name: '烫金3',
                            ico: 'el-icon-shopping-cart-full',
                            // 自定义覆盖样式
                            style: {}
                          }, {
                            id: '504',
                            type: 'task',
                            name: '烫金4',
                            ico: 'el-icon-shopping-cart-full',
                            // 自定义覆盖样式
                            style: {}
                          }, {
                            id: '601',
                            type: 'task',
                            name: '模切',
                            ico: 'el-icon-shopping-cart-full',
                            // 自定义覆盖样式
                            style: {}
                          }, {
                            id: '701',
                            type: 'task',
                            name: '分切',
                            ico: 'el-icon-shopping-cart-full',
                            // 自定义覆盖样式
                            style: {}
                          }, {
                            id: '702',
                            type: 'task',
                            name: '裁切',
                            ico: 'el-icon-shopping-cart-full',
                            // 自定义覆盖样式
                            style: {}
                          }
                        ]
                    },
                  {
                    id: '2',
                    type: 'group',
                    name: '综合车间',
                    ico: 'el-icon-video-pause',
                    open: true,
                    children: [
                      {
                        id: '201',
                        type: 'task',
                        name: '胶印1',
                        ico: 'el-icon-caret-right',
                        // 自定义覆盖样式
                        style: {}
                      }, {
                        id: '202',
                        type: 'task',
                        name: '胶印2',
                        ico: 'el-icon-shopping-cart-full',
                        // 自定义覆盖样式
                        style: {}
                      }, {
                        id: '301',
                        type: 'task',
                        name: '丝印1',
                        ico: 'el-icon-shopping-cart-full',
                        // 自定义覆盖样式
                        style: {}
                      }, {
                        id: '302',
                        type: 'task',
                        name: '丝印2',
                        ico: 'el-icon-shopping-cart-full',
                        // 自定义覆盖样式
                        style: {}
                      }, {
                        id: '401',
                        type: 'task',
                        name: '柔印',
                        ico: 'el-icon-shopping-cart-full',
                        // 自定义覆盖样式
                        style: {}
                      }
                    ]
                  },
                  {
                    id: '8',
                    type: 'group',
                    name: '理数车间',
                    ico: 'el-icon-video-pause',
                    open: true,
                    children: [
                      {
                        id: '800',
                        type: 'end',
                        name: '质检',
                        ico: 'el-icon-caret-right',
                        // 自定义覆盖样式
                        style: {}
                      }
                    ]
                  }
                ],
                nodeMenu: {}
            }
        },
      mixins:[localDict],
        components: {
            draggable
        },
        created() {
            /**
             * 以下是为了解决在火狐浏览器上推拽时弹出tab页到搜索问题
             * @param event
             */
            if (this.isFirefox()) {
                document.body.ondrop = function (event) {
                    // 解决火狐浏览器无法获取鼠标拖拽结束的坐标问题
                    mousePosition.left = event.layerX
                    mousePosition.top = event.clientY - 50
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        },
        methods: {
            // 根据类型获取左侧菜单对象
            getMenuByType(type) {
                for (let i = 0; i < this.menuList.length; i++) {
                    let children = this.menuList[i].children;
                    for (let j = 0; j < children.length; j++) {
                        if (children[j].type === type) {
                            return children[j]
                        }
                    }
                }
            },
           getMenuById( id ){
             for (let i = 0; i < this.menuList.length; i++) {
               let children = this.menuList[i].children;
               for (let j = 0; j < children.length; j++) {
                 if (children[j].id === id) {
                   return children[j]
                 }
               }
             }
           },
          getLaneByTag( tag){
              for( let i = 0 ; i < this.laneMenuList.length;i++) {
                if (this.laneMenuList[i].id === tag){
                  return this.laneMenuList[i];
                }
              }
          },
          getMenuByTag( tag ){
            for (let i = 0; i < this.menuList.length; i++) {
              let children = this.menuList[i].children;
              for (let j = 0; j < children.length; j++) {
                if (children[j].id === tag) {
                  return children[j]
                }
              }
            }
          },
          // 拖拽开始时触发
          moveLane(evt, a, b, c) {
            console.log(evt);
            var type = evt.item.attributes.type.nodeValue
            this.nodeMenu = this.getLaneByTag(  evt.item.attributes.tag.nodeValue ) ;//this.getMenuByType(type)
          },
          // 拖拽结束时触发
          endLane(evt, e) {
            this.$emit('addLane', evt, this.nodeMenu, mousePosition)
          },
            // 拖拽开始时触发
            move(evt, a, b, c) {
              console.log(evt);
                var type = evt.item.attributes.type.nodeValue
                this.nodeMenu = this.getMenuByTag( evt.item.attributes.tag.nodeValue ) ;//this.getMenuByType(type)
            },
            // 拖拽结束时触发
            end(evt, e) {
                this.$emit('addNode', evt, this.nodeMenu, mousePosition)
            },
            // 是否是火狐浏览器
            isFirefox() {
                var userAgent = navigator.userAgent
                if (userAgent.indexOf("Firefox") > -1) {
                    return true
                }
                return false
            }
        }
    }
</script>
