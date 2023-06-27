<template>
    <div v-if="canvasVisible" style="height: calc(100vh);">
        <el-row>
            <!--顶部工具菜单-->
            <el-col :span="24">
                <div class="ef-tooltar">
                    <el-link type="primary" :underline="false">{{data.name}}</el-link>
                    <el-divider direction="vertical"></el-divider>
                    <el-button title="删除所选图形" type="text" icon="el-icon-delete" size="large" @click="deleteElement" :disabled="!this.activeElement.type"></el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button title="下载流程数据" type="text" icon="el-icon-download" size="large" @click="downloadData"></el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button title="放大" type="text" icon="bi-zoom-in" size="large" @click="zoomAdd"></el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button title="缩小" type="text" icon="bi-zoom-out" size="large" @click="zoomSub"></el-button>
                    <div style="float: right;margin-right: 5px">

                      <el-button type="primary" plain round icon="el-icon-upload" @click="commit" size="mini" >保存工艺</el-button>

                        <el-button type="info" plain round icon="el-icon-document" @click="dataInfo" size="mini">流程信息</el-button>
                      <el-button type="info" plain round icon="el-icon-picture" @click="saveAsImage" size="mini">导出图片</el-button>
<!--                        <el-button type="primary" plain round @click="dataReloadA" icon="el-icon-refresh" size="mini">切换流程A</el-button>-->
<!--                        <el-button type="primary" plain round @click="dataReloadB" icon="el-icon-refresh" size="mini">切换流程B</el-button>-->
<!--                        <el-button type="primary" plain round @click="dataReloadC" icon="el-icon-refresh" size="mini">切换流程C</el-button>-->
<!--                        <el-button type="primary" plain round @click="dataReloadD" icon="el-icon-refresh" size="mini">自定义样式</el-button>-->
<!--                        <el-button type="primary" plain round @click="dataReloadE" icon="el-icon-refresh" size="mini">力导图</el-button>-->
                        <el-button type="info" plain round icon="el-icon-question" @click="openHelp" size="mini">帮助</el-button>
                    </div>
                </div>
            </el-col>
        </el-row>
        <div style="display: flex;height: calc(100% - 47px);">
            <div class="hidden-xs hidden-sm " style="width: 200px;border-right: 1px solid #dce3e8;">
              <div class="ef-node-form-header">
                工艺节点
              </div>
              <el-scrollbar style="height: 100%;">
                <node-menu @addNode="addNode" @addLane="addLane" ref="nodeMenu" :laneMenuVisible=true ></node-menu>
              </el-scrollbar>
            </div>

          <div id="Container" ref="Container" style="width: 100%">
            <div id="efContainer" ref="efContainer"   >
                <template v-for="node in data.nodeList">
                    <flow-node
                            :id="node.id"
                            :key="node.id"
                            :node="node"
                            :activeElement="activeElement"
                            @changeNodeSite="changeNodeSite"
                            @nodeRightMenu="nodeRightMenu"
                            @clickNode="clickNode"
                    >
                    </flow-node>
                </template>
              <template v-for="lane in data.laneList" >
                <flow-lane
                  ref="flowLane"
                  :id="lane.id"
                  :lane="lane"
                  :key="lane.id"
                  @clickLane="clickLane"
                  v-laneDrag="{'laneid':lane.id,'that':that}"
                >
                </flow-lane>
              </template>
                <!-- 给画布一个默认的宽度和高度 -->
                <div class="canvasWidthHeightClass" :style="{width:canvasSetting.width ,height:canvasSetting.height}">&nbsp;</div>
            </div>
          </div>

            <!-- 右侧表单 -->
            <div  class="hidden-xs  hidden-sm " style="width: 400px;border-left: 1px solid #dce3e8;background-color: #FBFBFB">

              <div class="ef-node-form-header">
                详情
              </div>
              <el-scrollbar style="height: 100%;">
                <flow-node-form ref="nodeForm" @setLineLabel="setLineLabel" @repaintEverything="repaintEverything" @repaintLane="repaintLane"></flow-node-form>
              </el-scrollbar>
            </div>
        </div>
        <!-- 流程数据详情 -->
        <flow-info v-if="flowInfoVisible" ref="flowInfo" :data="data"></flow-info>
        <flow-help v-if="flowHelpVisible" ref="flowHelp"></flow-help>
    </div>

</template>

<script>
    import draggable from 'vuedraggable'
    // import { jsPlumb } from 'jsplumb'
    // 使用修改后的jsplumb
    import './jsplumb'
    import { flowMixin } from '@/components/core/mixins'
    import flowLane from '@/components/core/lane'
    import flowNode from '@/components/core/node'
    import nodeMenu from '@/components/core/node_menu'
    import FlowInfo from '@/components/core/info'
    import FlowHelp from '@/components/core/help'
    import FlowNodeForm from './node_form'

    import lodash from 'lodash'
    // import { getDataA } from './data_A'
    import { getDataB } from './data_B'
    // import { getDataC } from './data_C'
    // import { getDataD } from './data_D'
    // import { getDataE } from './data_E'
    // import { ForceDirected } from './force-directed'

    import html2canvas from 'html2canvas';

    import canvg from "canvg";

    export default {
        data() {
            return {
                that:this,
                // jsPlumb 实例
                jsPlumb: null,
                // 控制画布销毁
                canvasVisible: true,
                // 控制流程数据显示与隐藏
                flowInfoVisible: false,
                // 是否加载完毕标志位
                loadFlowFinish: false,
                flowHelpVisible: false,
                //是否允许相同的结点重复
                allowRepeatNode:false,
                // 数据
                data: {},
                // 激活的元素、可能是节点、可能是连线
                activeElement: {
                    // 可选值 node 、line
                    type: undefined,
                    // 节点ID
                    nodeId: undefined,
                    // 连线ID
                    sourceId: undefined,
                    targetId: undefined
                },
                zoom: 1.0,

            }
        },
        // 一些基础配置移动该文件中
        mixins: [flowMixin],
        components: {
            draggable, flowNode, nodeMenu, FlowInfo, FlowNodeForm, FlowHelp , flowLane
        },
        directives: {
            'flowDrag': {
              inserted(el){
                // console.log(' flowDrag inserted-el',el)
              },
                bind(el, binding, vnode, oldNode) {

                  // console.log('flowDrag bind',el, binding, vnode, oldNode)
                    if (!binding) {
                        return
                    }

                    el.onmousedown = (e) => {

                        if (e.button == 2) {
                            // 右键不管
                            return
                        }
                        //  鼠标按下，计算当前原始距离可视区的高度
                        let disX = e.clientX
                        let disY = e.clientY
                        el.style.cursor = 'move'

                        document.onmousemove = function (e) {

                            // 移动时禁止默认事件
                            e.preventDefault()
                            const left = e.clientX - disX
                            disX = e.clientX
                            el.scrollLeft += -left

                            const top = e.clientY - disY
                            disY = e.clientY
                            el.scrollTop += -top
                        }

                        document.onmouseup = function (e) {
                            el.style.cursor = 'auto'
                            document.onmousemove = null
                            document.onmouseup = null
                        }
                    }
                }
            },
          'laneDrag': {
            inserted(el){
              // console.log(' laneDrag inserted-el',el)
            },
            bind(el, binding, vnode, oldNode) {
              // console.log('laneDrag bind', binding)
              if (!binding) {
                return
              }
              var laneId = binding.value.laneid;
              var that = binding.value.that;
              var lane;
              for (var i = 0; i < that.data.laneList.length; i++) {
                let lane1 = that.data.laneList[i];
                if(lane1.id == laneId){
                  lane = lane1;
                  break;
                }
              }
              el.onmousedown = (e) => {
                if (e.button == 2) {
                  // 右键不管
                  return
                }
                //  鼠标按下，计算当前原始距离可视区的高度
                let disX = e.clientX
                let disY = e.clientY
                el.style.cursor = 'move'

                document.onmousemove = function (e) {

                  // 移动时禁止默认事件
                  e.preventDefault()
                  if(lane.type === 'direction') {
                    const left = e.clientX - disX
                    disX = e.clientX
                    el.scrollLeft += -left
                  }
                  if( lane.type ==='broadwise') {
                    const top = e.clientY - disY
                    disY = e.clientY
                    el.scrollTop += -top
                  }
                }

                document.onmouseup = function (e) {
                  el.style.cursor = 'auto'
                  document.onmousemove = null
                  document.onmouseup = null
                }
              }
            }
          }
        },
      componentWillUmount() {
          this.jsPlumb.reset();
      },
      mounted() {
            this.jsPlumb = jsPlumb.getInstance()
            this.$nextTick(() => {
                // 默认加载流程A的数据、在这里可以根据具体的业务返回符合流程数据格式的数据即可
                this.dataReload(getDataB())
            })
        },
        methods: {
            // 返回唯一标识
            getUUID() {
                return Math.random().toString(36).substr(3, 10)
            },
            jsPlumbInit() {
                this.jsPlumb.ready(() => {
                    // 导入默认配置
                    this.jsPlumb.importDefaults(this.jsplumbSetting)
                    // 会使整个jsPlumb立即重绘。
                    this.jsPlumb.setSuspendDrawing(false, true);
                    // 初始化节点
                    this.loadFlow()
                    // 单点击了连接线, https://www.cnblogs.com/ysx215/p/7615677.html
                    this.jsPlumb.bind('click', (conn, originalEvent) => {
                        this.activeElement.type = 'line'
                        this.activeElement.sourceId = conn.sourceId
                        this.activeElement.targetId = conn.targetId;
                        var lll;
                      this.data.lineList.forEach(function (line) {
                        if (line.from == conn.sourceId && line.to == conn.targetId) {
                           lll=lodash.cloneDeep(line);

                        }
                      })
                      if( lll ){
                        this.data.nodeList.forEach(function( d ){
                          if(d.id==lll.from){
                            lll.fromname=d.name;
                          }
                          if(d.id==lll.to){
                            lll.toname=d.name;
                          }
                        })
                      }

                        this.$refs.nodeForm.lineInit(this.data, lll);
                        //
                        //   {
                        //     from: conn.sourceId,
                        //     to: conn.targetId,
                        //     label: conn.getLabel()
                        // }
                        // )
                    })

                    // 连线
                    this.jsPlumb.bind("connection", (evt) => {
                      if(this.data.readonly){
                        return;
                      }
                      // console.log("connection : ",evt);


                        let from = evt.source.id
                        let to = evt.target.id
                        if (this.loadFlowFinish) {
                            this.data.lineList.push({from: from,
                              to: to ,
                              id: from+"_"+to,
                              anchors:  [evt.connection.endpoints[0].anchor.type,evt.connection.endpoints[1].anchor.type] ,
                              pdmtype:'',
                              pdmvalue:'',
                              pdmperiod:'',
                              pathtag:'',
                              label:''
                            })
                        }
                    })

                    // 删除连线回调
                    this.jsPlumb.bind("connectionDetached", (evt) => {
                        this.deleteLine(evt.sourceId, evt.targetId)
                    })

                    // 改变线的连接节点
                    this.jsPlumb.bind("connectionMoved", function(info,evt) {
                      console.log("connectionMoved :",evt);
                        this.changeLine(evt.originalSourceId, evt.originalTargetId)
                    })

                    // 连线右击
                    this.jsPlumb.bind("contextmenu", (evt) => {
                        console.log('contextmenu', evt)
                    })

                    // 连线
                    this.jsPlumb.bind("beforeDrop", (evt) => {
                      if(this.data.readonly){
                        return;
                      }
                        let from = evt.sourceId
                        let to = evt.targetId
                        if (from === to) {
                            this.$message.error('节点不支持连接自己')
                            return false
                        }
                        if (this.hasLine(from, to)) {
                            this.$message.error('该关系已存在,不允许重复创建')
                            return false
                        }
                        if (this.hashOppositeLine(from, to)) {
                            this.$message.error('两个节点之间会存在连线回环');
                            // return false
                        }
                        this.$message.success('连接成功')
                        return true
                    })

                    // beforeDetach
                    this.jsPlumb.bind("beforeDetach", (evt) => {
                        console.log('beforeDetach', evt)
                    })
                    this.jsPlumb.setContainer(this.$refs.efContainer)
                })
            },
            // 加载流程图
            loadFlow() {
                // 初始化节点
                for (var i = 0; i < this.data.nodeList.length; i++) {
                    let node = this.data.nodeList[i]
                    // 设置源点，可以拖出线连接其他节点
                    this.jsPlumb.makeSource(node.id, lodash.merge(this.jsplumbSourceOptions, {}))
                    // // 设置目标点，其他源点拖出的线可以连接该节点
                    this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions)
                  this.setEnterPoint(node.id);
                     if (!node.viewonly && !this.data.readonly) {
                        this.jsPlumb.draggable(node.id, {
                            containment: 'parent',
                            stop: function (el) {
                                // 拖拽节点结束后的对调
                                console.log('拖拽结束: ', el)
                            }
                        })
                    }
                }
                // 初始化连线
                for (var i = 0; i < this.data.lineList.length; i++) {
                    let line = this.data.lineList[i]
                    if(!line.id){
                      line.id = line.from+"_"+line.to;
                    }
                    let fullLabel = (line.pathtag?'<span title="路径标识">'+line.pathtag+"</span><br/>":'')
                    let pdm = (line.pdmtype?line.pdmtype+" ":"") +(line.pdmvalue?line.pdmvalue :"")+(line.pdmperiod?line.pdmperiod :"");
                    if(pdm){
                      pdm = '<i class="pdm-label" title="紧前关系">'+pdm+'</i>';
                    }
                    fullLabel = fullLabel + pdm;
                    var connParam = {
                        source: line.from,
                        target: line.to,
                        label: fullLabel,
                        connector: line.connector ? line.connector : '',
                        anchors: line.anchors ? line.anchors : undefined,
                        paintStyle: line.paintStyle ? line.paintStyle : undefined,
                    }
                    this.jsPlumb.connect(connParam, this.jsplumbConnectOptions)
                }

              // 初始化泳道
              for (var i = 0; i < this.data.laneList.length; i++) {
                let lane = this.data.laneList[i]
                // console.log('lane id:',lane.id,lane,( lane.type == 'broadwise'));
                if ( !this.data.readonly && lane.draggable && this.laneSetting.draggable ) {
                  this.jsPlumb.draggable(lane.id, {
                    containment: '#efContainer',
                    handle: '.laneLabelClass',
                    axis: lane.type == 'broadwise' ? 'y' : 'x',
                    start:function (el){
                      // console.log('lane start drag');
                    },
                    stop: function (el) {
                      // 拖拽节点结束后的对调
                      // console.log('拖拽结束: ', el)
                    }
                  })
                }
              }
                this.$nextTick(function () {
                    this.loadFlowFinish = true
                })
            },
            // 设置连线条件
            setLineLabel (from, to, pathtag,pdmtype,pdmvalue,pdmperiod) {
                var conn = this.jsPlumb.getConnections({
                    source: from,
                    target: to
                })[0];

              let fullLabel= pathtag?'<span title="路径标识">'+pathtag+"</span><br/>":"";
              let pdm = (pdmtype?pdmtype+" ":"") +(pdmvalue?pdmvalue :"")+(pdmperiod?pdmperiod :"");
              if(pdm){
                pdm = '<i class="pdm-label" title="紧前关系">'+pdm+'</i>';
              }
              fullLabel = fullLabel + pdm;

                if (!fullLabel || fullLabel === '') {
                    conn.removeClass('flowLabel')
                    conn.addClass('emptyFlowLabel')
                } else {
                    conn.addClass('flowLabel')
                }
                conn.setLabel({
                    label: fullLabel,
                })
                this.data.lineList.forEach(function (line) {
                    if (line.from == from && line.to == to) {
                       if(!line.id){
                         line.id = line.from+"_"+line.to;
                       }
                        line.label = pathtag +" | "+pdmtype+" "+pdmvalue+pdmperiod ;
                        line.pathtag = pathtag;
                        line.pdmtype = pdmtype;
                        line.pdmvalue = pdmvalue;
                        line.pdmperiod = pdmperiod;
                    }
                })

              // console.log("setLineLabel:" , this.data.lineList);

            },
            // 删除激活的元素
            deleteElement() {
              if(this.data.readonly) {
                return;
              }
                if (this.activeElement.type === 'node') {
                    this.deleteNode(this.activeElement.nodeId)
                } else if (this.activeElement.type === 'line') {
                    this.$confirm('确定删除所点击的线吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        var conn = this.jsPlumb.getConnections({
                            source: this.activeElement.sourceId,
                            target: this.activeElement.targetId
                        })[0]
                        this.jsPlumb.deleteConnection(conn)
                    }).catch(() => {
                    })
                }
                else if(this.activeElement.type === 'lane') {
                  if( typeof this.laneSetting.canDelete=='undefined' || this.laneSetting.canDelete!== true ){
                    return;
                  }
                  let l ,idx;
                  for(let i = 0 ; i < this.data.laneList.length;i++){
                    if( this.activeElement.laneId == this.data.laneList[i].id){
                      l = this.data.laneList[i];
                      idx = i;
                      break;
                    }

                  }
                  if(! l ){
                    return;
                  }

                  this.$confirm('确定删除所点击的 泳道  "'+ l.text+'" 吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                     this.data.laneList.splice(idx,1);
                  }).catch(() => {
                  })
                }
            },
            // 删除线
            deleteLine(from, to) {
                this.data.lineList = this.data.lineList.filter(function (line) {
                    if (line.from == from && line.to == to) {
                        return false
                    }
                    return true
                })
            },
            // 改变连线
            changeLine(oldFrom, oldTo) {
                this.deleteLine(oldFrom, oldTo)
            },
            // 改变节点的位置
            changeNodeSite(data) {

                for (var i = 0; i < this.data.nodeList.length; i++) {
                    let node = this.data.nodeList[i]
                    if (node.id === data.nodeId) {
                        node.left = data.left
                        node.top = data.top
                    }
                }
            },
          setEnterPoint( id ){
            let config = this.jsplumbSourceOptions;

            config.isSource = true;
            config.isTarget=true;
            // console.log(config.connectorOverlays[3][1]);
            // config.connectorOverlays[3][1].id="path_text_"+id;


            this.jsPlumb.addEndpoint(id, {
              anchors: 'Top',
              uuid: id + '-top'
            }, config);

            this.jsPlumb.addEndpoint(id, {
              anchors: 'TopLeft',
              uuid: id + '-topLeft'
            }, config);
            this.jsPlumb.addEndpoint(id, {
              anchors: 'TopRight',
              uuid: id + '-topRight'
            }, config);


            this.jsPlumb.addEndpoint(id, {
              anchors: 'Left',
              uuid: id + '-left'
            }, config);

            this.jsPlumb.addEndpoint(id, {
              anchors: 'Right',
              uuid: id + '-right'
            }, config);

            this.jsPlumb.addEndpoint(id, {
              anchors: 'BottomLeft',
              uuid: id + '-bottomLeft'
            }, config);

            this.jsPlumb.addEndpoint(id, {
              anchors: 'Bottom',
              uuid: id + '-bottom'
            }, config);


            this.jsPlumb.addEndpoint(id, {
              anchors: 'BottomRight',
              uuid: id + '-bottomRight'
            }, config);

            // this.jsPlumb.draggable(id);
          },
          //拖动添加泳道
          addLane(evt,nodeMenu,mousePosition){
              if(this.data.readonly){
                return;
              }
            var screenX = evt.originalEvent.clientX, screenY = evt.originalEvent.clientY
            let efContainer = this.$refs.Container;
            var containerRect = efContainer.getBoundingClientRect()
            console.log('addLane:', containerRect);
            var left = screenX, top = screenY
            // 计算是否拖入到容器中
            if (left < containerRect.x || left > containerRect.width + containerRect.x || top < containerRect.y || containerRect.y > containerRect.y + containerRect.height) {
              this.$message.error("请把泳道拖入到画布中")
              return
            }
            left = left - containerRect.x + efContainer.scrollLeft
            top = top - containerRect.y + efContainer.scrollTop
            // 居中
            left -= 85
            top -= 16
            var laneId =  nodeMenu.id;//this.getUUID();
            var laneType  = nodeMenu.type;
            var origType = laneType
            var origName = nodeMenu.name;
            var index = 1;
            var duplicate = false;
            while (index < 10000) {
              var repeat = false
              for (var i = 0; i < this.data.laneList.length; i++) {
                let lane1 = this.data.laneList[i]
                if (lane1.id === laneType) {
                  laneType = origType + index
                  repeat = true ;
                  duplicate=true;
                }
              }
              if (repeat) {
                index++
                continue
              }
              break
            }
            origName=origName+ index;

            // if( duplicate ){
            //   if( ! this.allowRepeatLane ){
            //     this.$message.error(origName+ ' 已经存在！');
            //     return;
            //   }
            // }
            let w=this.laneSetting.laneViewWidth,h=this.laneSetting.laneViewLength;
            // if(this.laneSetting.stickside){
              if ( nodeMenu.type == 'broadwise'){
                left = 0;
                h=this.laneSetting.laneViewWidth;
                w=this.laneSetting.laneViewLength;
              }
              if( nodeMenu.type == 'direction'){
                top = 0;
                w=this.laneSetting.laneViewWidth;
                h=this.laneSetting.laneViewLength;
              }
            // };
            var lane = {
              id: laneType,
              type: nodeMenu.type,
              left: left + 'px',
              top: top + 'px',
              height : h,
              width : w,
              text: origName,
              resizable: this.laneSetting.resizable,
              draggable: this.laneSetting.draggable,
            }

              var _that = this;
            /**
             * 这里可以进行业务判断、是否能够添加该节点
             */
            this.data.laneList.push( lane )
            this.$nextTick(function () {
              if(!_that.data.readyonly && lane.draggable) {
                this.jsPlumb.draggable(lane.id, {
                  containment: '#efContainer',
                  handle: '.laneLabelClass',

                  axis: lane.type == 'broadwise' ? 'y' : 'x',
                  start: function (el) {

                  },

                  stop: function (el) {
                    // 拖拽节点结束后的对调
                    console.log('拖拽结束: ', el)
                  }
                })
              }
            })
          },
            /**
             * 拖拽结束后添加新的节点
             * @param evt
             * @param nodeMenu 被添加的节点对象
             * @param mousePosition 鼠标拖拽结束的坐标
             */
            addNode(evt, nodeMenu, mousePosition) {
              if( this.data.readonly ){
                return;
              }
                var screenX = evt.originalEvent.clientX, screenY = evt.originalEvent.clientY
                let efContainer = this.$refs.Container
                var containerRect = efContainer.getBoundingClientRect()
                var left = screenX, top = screenY
                // 计算是否拖入到容器中
                if (left < containerRect.x || left > containerRect.width + containerRect.x || top < containerRect.y || containerRect.y > containerRect.y + containerRect.height) {
                    this.$message.error("请把节点拖入到画布中")
                    return
                }
                left = left - containerRect.x + efContainer.scrollLeft
                top = top - containerRect.y + efContainer.scrollTop
                // 居中
                left -= 85
                top -= 16
                var nodeId =  nodeMenu.id;//this.getUUID();
                // 动态生成名字
                var origName = nodeMenu.name
                var nodeName = origName
                var index = 1;
               var duplicate = false;
                while (index < 10000) {
                    var repeat = false
                    for (var i = 0; i < this.data.nodeList.length; i++) {
                        let node = this.data.nodeList[i]
                        if (node.name === nodeName) {
                            nodeName = origName + index
                            repeat = true ;
                          duplicate=true;
                        }
                    }
                    if (repeat) {
                        index++
                        continue
                    }
                    break
                }

                if( duplicate ){
                  if( ! this.allowRepeatNode ){
                    this.$message.error(origName+ ' 已经存在！');
                    return;
                  }
                }
                var node = {
                    id: nodeId,
                    name: nodeName,
                    type: nodeMenu.type,
                    left: left + 'px',
                    top: top + 'px',
                    ico: nodeMenu.ico,
                    state: 'success',
                    bopid: this.data.bopid,
                    subid: this.data.bopid+"_"+nodeId, //this.this.getUUID()
                    require:'',
                    firstflag:false,
                    lastflag:false
                }
                /**
                 * 这里可以进行业务判断、是否能够添加该节点
                 */
                this.data.nodeList.push(node)
                this.$nextTick(function () {
                    this.jsPlumb.makeSource(nodeId, this.jsplumbSourceOptions)
                    this.jsPlumb.makeTarget(nodeId, this.jsplumbTargetOptions)
                  this.setEnterPoint(nodeId);

                    this.jsPlumb.draggable(nodeId, {
                        containment: 'parent',
                        stop: function (el) {
                            // 拖拽节点结束后的对调
                            console.log('拖拽结束: ', el)
                        }
                    })
                })
            },
            /**
             * 删除节点
             * @param nodeId 被删除节点的ID
             */
            deleteNode(nodeId) {
              if(this.data.readonly){
                return;
              }
                this.$confirm('确定要删除节点' + nodeId + '?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {
                    /**
                     * 这里需要进行业务判断，是否可以删除
                     */
                    this.data.nodeList = this.data.nodeList.filter(function (node) {
                        if (node.id === nodeId) {
                            // 伪删除，将节点隐藏，否则会导致位置错位
                            // node.show = false
                            return false
                        }
                        return true
                    })
                    this.$nextTick(function () {
                        this.jsPlumb.removeAllEndpoints(nodeId);
                    })
                }).catch(() => {
                })
                return true
            },
          clickLane(laneId) {
            this.activeElement.type = 'lane'
            this.activeElement.laneId = laneId
            this.$refs.nodeForm.laneInit(this.data, laneId)
          },
            clickNode(nodeId) {
                this.activeElement.type = 'node'
                this.activeElement.nodeId = nodeId
                this.$refs.nodeForm.nodeInit(this.data, nodeId)
            },
            // 是否具有该线
            hasLine(from, to) {
                for (var i = 0; i < this.data.lineList.length; i++) {
                    var line = this.data.lineList[i]
                    if (line.from === from && line.to === to) {
                        return true
                    }
                }
                return false
            },
            // 是否含有相反的线
            hashOppositeLine(from, to) {
                return this.hasLine(to, from)
            },
            nodeRightMenu(nodeId, evt) {
                this.menu.show = true
                this.menu.curNodeId = nodeId
                this.menu.left = evt.x + 'px'
                this.menu.top = evt.y + 'px'
            },
            repaintLane( laneId){
              if( ! this.$refs.flowLane){
                return;
              }
              let lll;
              for( let i = 0 ; i < this.$refs.flowLane.length;i++){
                lll = this.$refs.flowLane[i];
                if( lll.$refs.lane.id==laneId){
                    break;
                }
              }
              if(lll){
                lll.laneLabelHtml();
              }
              // console.log(lll);
              // console.log(this.$refs.flowLane);
            },
            repaintEverything() {
                this.jsPlumb.repaint()
            },
            // 流程数据信息
            dataInfo() {
                this.flowInfoVisible = true
                this.$nextTick(function () {
                    this.$refs.flowInfo.init()
                })
            },
            // 加载流程图
            dataReload(data) {
                this.canvasVisible = false
                this.data.nodeList = []
                this.data.lineList = []
                this.$nextTick(() => {
                    data = lodash.cloneDeep(data)
                    data.nodeList.filter((node) => {
                      if(!node.bopid){
                        node.bopid = data.bopid;
                      }
                      if(!node.subid){
                        node.subid = data.bopid +"_" + node.id;
                      }
                    });
                    this.canvasVisible = true
                    this.data = data
                    this.$nextTick(() => {
                        this.jsPlumb = jsPlumb.getInstance()
                        this.$nextTick(() => {
                            this.jsPlumbInit();

                          this.$refs.nodeForm.nodeInit(this.data, null)
                        })
                    })
                })
            },
            // 模拟载入数据dataA
            dataReloadA() {
                // this.dataReload(getDataA())
            },
            // 模拟载入数据dataB
            dataReloadB() {
                this.dataReload(getDataB())
            },
            // 模拟载入数据dataC
            dataReloadC() {
                // this.dataReload(getDataC())
            },
            // 模拟载入数据dataD
            dataReloadD() {
                // this.dataReload(getDataD())
            },
            // 模拟加载数据dataE，自适应创建坐标
            dataReloadE() {
                // let dataE = getDataE()
                // let tempData = lodash.cloneDeep(dataE)
                // let data = ForceDirected(tempData)
                // this.dataReload(data)
                // this.$message({
                //     message: '力导图每次产生的布局是不一样的',
                //     type: 'warning'
                // });
            },
          setZoom  (zoom, transformOrigin, el) {
            transformOrigin = transformOrigin || [ 0.5, 0.5 ];
            let instance = this.jsPlumb;
            el = el || instance.getContainer();
            var p = [ "webkit", "moz", "ms", "o" ],
              s = "scale(" + zoom + ")",
              oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";

            for (var i = 0; i < p.length; i++) {
              el.style[p[i] + "Transform"] = s;
              el.style[p[i] + "TransformOrigin"] = oString;
            }

            el.style["transform"] = s;
            el.style["transformOrigin"] = oString;





            instance.setZoom(zoom);
          },
            zoomAdd() {
              // console.log("zoomAdd:",this.zoom);
                if (this.zoom >= 1) {
                    return;
                }

                this.zoom = parseFloat((this.zoom + 0.1).toFixed(2));
                this.setZoom(this.zoom);
            },
            zoomSub() {
              // console.log("zoomSub:",this.zoom);
                if (this.zoom <= 0) {
                  this.zoom = 0;
                    return
                }
                this.zoom = parseFloat((this.zoom - 0.1).toFixed(2));
                this.setZoom( this.zoom);

            },
          saveAsImage(){
              if(!this.data){
                return;
              }
              if( (!this.data.nodeList || this.data.nodeList.length<=0)
                  && (!this.data.lineList || this.data.lineList.length<=0)
                  && (!this.data.laneList) || this.data.laneList.length<=0){
                return;
            }

            // 2、计算生成图片的尺寸
            let positionObj = this.getCanvasSizeByNode( true );
              // console.log('positionObj',positionObj );

            // 3、处理svg标签，这里只做对连接线的转换，端点暂不考虑
            let removeArr = [];
            let svgElem = $("#efContainer").find(".jtk-connector");
            // console.log('svgElem:',svgElem);


            var _that = this;
            let i;
            svgElem.each(function(index, node) {

              // 3.1、创建canvas标签，设置标签id并将id放入移除数组中，便于生成图片后移除canvas
              const canvas = document.createElement('canvas');
              let ctx = canvas.getContext('2d')
              canvas.setAttribute('width', node.clientWidth+'px');
              canvas.setAttribute('height', node.clientHeight+'px');
              canvas.setAttribute('style', 'display:block;');
              let canvasId = 'canvas-' + _that.getUUID();
              canvas.id = canvasId;
              canvas.type="canvg";
              removeArr.push(canvasId);

              // 3.2、svg标签内容
              // let svg = node.outerHTML.trim();
              const svg = new XMLSerializer().serializeToString(node);


              // 3.3、转换为canvas，只能用<=2.0版
              const v = canvg(canvas, svg, { ignoreMouse: true, ignoreAnimation: true });



              // 3.4、设置位置
              if (node.style.left || node.style.top) {
                canvas.style.position = node.style.position;
                canvas.style.left = (canvas.style.left|| 0) + parseInt( node.style.left || '0')+'px';
                canvas.style.top = (canvas.style.top|| 0) + parseInt( node.style.top || '0')+'px';
              }

              // console.log('canvg obj:', canvas,canvas.style.left,canvas.style.top);
              $('#efContainer').append(canvas);
            });

            // 4、将流程图转换为canvas，然后再转成base64编码
            html2canvas(document.getElementById('efContainer'), {
              width: positionObj.width,
              height: positionObj.height,
              // 关闭日志
              logging: false
            }).then(function(canvas) {
              // 将canvas转成base64编码，然后再转成图片url
              let imgUri = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
              // 下载图片
              let alink = document.createElement('a');
              let alinkId = 'alink-' + _that.getUUID();
              removeArr.push(alinkId);
              alink.id = alinkId;
              alink.href = imgUri;
              alink.download = '工艺流程图_'+ _that.data.name+'_OrderID['+_that.data.orderid +"]_"+ _that.getUUID() + '.jpg';
              alink.click();
            });

            // 5、移除生成的canvas、alink，这里采用异步的方式是因为生成图片需要时间，若在生成图片时执行了清除代码则svg内容不会被转成图片
            setTimeout(function() {
              for (i = 0; i < removeArr.length; i++) {
                 $('#'+ removeArr[i]).remove();
              }
            }, 1000);




          },
          getCanvasSizeByNode: function( ignoreLaneWH) {
            let nodeArr =this.data.nodeList || []  ;
            let lineArr = this.data.lineList || [] ;
            let laneArr =  this.data.laneList|| [] ;
            let el = nodeArr.length>0? nodeArr[0]:( lineArr.length>0? lineArr[0]: ( laneArr.length>0? laneArr[0]:undefined));
            // console.log('getCanvasSizeByNode e:',el);
            if(!el){
              return;
            }

            let maxRight = 0;
            let minTop = 0;
            let maxBottom = 0;
            let minLeft = 0;
            let scrLeft=0;
            let scrTop = 0;


            for (let i = 0, len = nodeArr.length; i < len; i++) {
              let t = parseInt($('#'+ nodeArr[i].id).css('top'));
              let l = parseInt( $('#'+ nodeArr[i].id).css('left'));
              let w = parseInt( $('#'+ nodeArr[i].id).width());
              let h = parseInt( $('#'+ nodeArr[i].id).height());

              // console.log('node position:',nodeArr[i].id, $('#'+ nodeArr[i].id).css('left'), $('#'+ nodeArr[i].id).width(), $('#'+ nodeArr[i].id).height())
              if (l>0 && l+w > maxRight) {
                maxRight = l+w;
              }
              if (t>0 && t < minTop) {
                minTop = t;
              }
              if (t>0 && t+h > maxBottom) {
                maxBottom = t+h;
              }
              if (l>0 && l < minLeft) {
                minLeft = l;
              }
            }
            // console.log('node position:', minTop, minLeft, maxBottom,maxRight)

            for (let i = 0, len = lineArr.length; i < len; i++) {
              let t = parseInt($('#'+ lineArr[i].id).attr('y'));
              let l = parseInt( $('#'+ lineArr[i].id).attr('x'));
              let w = parseInt( $('#'+ lineArr[i].id).attr('width'));
              let h = parseInt( $('#'+ lineArr[i].id).attr('height'));
              if (l>0 && l+w > maxRight) {
                maxRight = l+w;
              }
              if (t>0 && t < minTop) {
                minTop = t;
              }
              if (t>0 && t+h > maxBottom) {
                maxBottom = t+h;
              }
              if (l>0 && l < minLeft) {
                minLeft = l;
              }
            }

            for (let i = 0, len = laneArr.length; i < len; i++) {
              let t = parseInt($('#'+ laneArr[i].id).css('top'));
              let l = parseInt( $('#'+ laneArr[i].id).css('lef'));
              let w = parseInt( $('#'+ laneArr[i].id).width());
              let h = parseInt( $('#'+ laneArr[i].id).height());


                if (l > 0 && l + w > maxRight) {
                  if(laneArr[i].type=='direction' || !ignoreLaneWH) {
                    maxRight = l + w;
                  }
                }
                if (t > 0 && t + h > maxBottom) {

                  if(laneArr[i].type=='broadwise' || !ignoreLaneWH) {
                    maxBottom = t + h;
                  }
                }

              if (t>0 && t < minTop) {
                minTop = t;
              }
              if (l>0 && l < minLeft) {
                minLeft = l;
              }
            }
            // console.log('minLeft: ',minLeft,'minTop: ',minTop,'maxRight: ',maxRight,'maxBottom: ',maxBottom);
            return {
              top: minTop,
              left:minLeft,
              width: maxRight+50,
              height: maxBottom+50
            };
          },

          commit(){
              //提交到服务数据
          },
            // 下载数据
            downloadData() {
                this.$confirm('确定要下载该流程数据吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {
                    var datastr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.data, null, '\t'));
                    var downloadAnchorNode = document.createElement('a')
                    downloadAnchorNode.setAttribute("href", datastr);
                    downloadAnchorNode.setAttribute("download", 'data.json')
                    downloadAnchorNode.click();
                    downloadAnchorNode.remove();
                    this.$message.success("正在下载中,请稍后...")
                }).catch(() => {
                })
            },
            openHelp() {
                this.flowHelpVisible = true
                this.$nextTick(function () {
                    this.$refs.flowHelp.init()
                })
            }
        }
    }
</script>
