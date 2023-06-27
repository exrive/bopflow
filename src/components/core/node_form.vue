<template>
    <div>
        <div class="ef-node-form">

            <div class="ef-node-form-body">
              <el-form :model="data" ref="dataForm" label-width="100px" size="mini">
                <!--                    <el-form-item label="类型">-->
                <!--                        <el-input v-model="node.type" :disabled="true"></el-input>-->
                <!--                    </el-form-item>-->
                <el-form-item :label="this.localCaption.product"  >
                  <el-input v-model="data.product" :disabled="true"  ></el-input>
                </el-form-item>
                <el-form-item :label="this.localCaption.orderid" v-show="isOrder" >
                  <el-input v-model="data.orderid" :disabled="true" ></el-input>
                </el-form-item>
                <el-form-item :label="this.localCaption.manufactureplanid"  v-show="isOrder">
                  <el-input v-model="data.manufactureplanid" :disabled="true"  ></el-input>
                </el-form-item>
                <el-form-item :label="this.localCaption.bopid">
                  <el-input v-model="data.bopid" :disabled="true"></el-input>
                </el-form-item>
                <h1 style="background-color: #b7b5b5 ;width: 100%;height:2px;"></h1>
              </el-form>
            </div>
          <div class="ef-node-form-body" v-show="type === 'node'" >
                <el-form :model="node" ref="dataForm" label-width="100px" size="mini">

<!--                    <el-form-item label="类型">-->
<!--                        <el-input v-model="node.type" :disabled="true"></el-input>-->
<!--                    </el-form-item>-->
                  <el-form-item :label="this.localCaption.subid">
                    <el-input v-model="node.subid" :disabled="true"></el-input>
                  </el-form-item>
                    <el-form-item :label="this.localCaption.node">
                        <el-input :value="(!node.id? '':node.id + '  ' +node.name)" :disabled="true"></el-input>
                    </el-form-item>
<!--                    <el-form-item label="left坐标">-->
<!--                        <el-input v-model="node.left" :disabled="true"></el-input>-->
<!--                    </el-form-item>-->
<!--                    <el-form-item label="top坐标">-->
<!--                        <el-input v-model="node.top" :disabled="true"></el-input>-->
<!--                    </el-form-item>-->
                    <el-form-item >
                        <el-checkbox :disabled="readonly" v-model="node.firstflag">{{this.localCaption.firstflag}}</el-checkbox>
                      <el-checkbox :disabled="readonly"  v-model="node.lastflag">{{this.localCaption.lastflag}}</el-checkbox>
                    </el-form-item>
                  <el-form-item :label="this.localCaption.techrequire">
                    <el-input :disabled="readonly"  type="textarea" :rows="8" v-model="node.require"></el-input>
                  </el-form-item>

                </el-form>
            <el-row  v-show="!readonly"  style="margin-right: 20px;text-align: right;justify-content: right;"><el-col >
              <el-button icon="el-icon-close" @click="resetData">{{ this.localCaption.reset }}</el-button>
              <el-button   type="primary" icon="el-icon-check" @click="saveNode">{{ this.localCaption.save}}</el-button>

            </el-col></el-row>
          </div>
          <div class="ef-node-form-body" v-show="type === 'line'" >
                <el-form :model="line"  ref="dataForm" label-width="80px" size="mini">

                  <el-form-item :label="this.localCaption.from"   >
                    <el-input :value="line.from +' ' + line.fromname" :disabled="true" ></el-input>
                  </el-form-item>
                  <el-form-item :label="this.localCaption.to"   >
                    <el-input :value="line.to + ' '+line.toname " :disabled="true" ></el-input>
                  </el-form-item>
                    <el-form-item :label="this.localCaption.pathtag"   >

                      <el-tooltip :manual="true" v-model="pathtag_tip" id="info_pathtag" class="item" effect="dark" content="为空表示所有标识可通过" placement="top-start">

                      <el-input  :disabled="readonly" v-model="line.pathtag" >
                      <i slot="suffix" class="el-icon-question" @click="info_pathtag" title="路径帮助"></i>
                      </el-input>

                        </el-tooltip>
                    </el-form-item>

                  <el-form-item :label="this.localCaption.pdmtype">
                    <el-select  :disabled="readonly" v-model="line.pdmtype" placeholder="请选择">
                      <el-option
                        v-for="item in pdmtypeList"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="    this.localCaption.pdmvalue"   >
                    <el-input  :disabled="readonly" v-model="line.pdmvalue" type="number" ></el-input>
                  </el-form-item>

                  <el-form-item :label="       this.localCaption.pdmperiod">
                    <el-select  :disabled="readonly" v-model="line.pdmperiod" placeholder="请选择">
                      <el-option
                        v-for="item in pdmperiodList"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>


                </el-form>
            <el-row  v-show="!readonly" style="margin-right: 20px;text-align: right;justify-content: right;">
              <el-col  >
              <el-button icon="el-icon-close" @click="resetLine">重置</el-button>
              <el-button type="primary" icon="el-icon-check" @click="saveLine">保存</el-button>
            </el-col></el-row>
          </div>
          <div class="ef-node-form-body" v-show="type === 'lane'">
              <el-form :model="lane"  ref="dataForm" label-width="80px"  size="mini">
                <el-form-item :label="this.localCaption.laneid"   >
                  <el-input :value="lane.id" :disabled="true" ></el-input>
                </el-form-item>
                <el-form-item :label="this.localCaption.lanetype"   >
                  <el-input :value="this.localCaption[lane.type]" :disabled="true" ></el-input>
                </el-form-item>
                <el-form-item :label="this.localCaption.lanename"   >
                  <el-input v-model="lane.text"  :disabled="readonly"  ></el-input>
                </el-form-item>

                <el-row  v-show="!readonly"  style="margin-right: 20px;text-align: right;justify-content: right;"><el-col  >
                  <el-button icon="el-icon-close" @click="resetLane" >重置</el-button>
                  <el-button type="primary" icon="el-icon-check" @click="saveLane"  >保存</el-button>
                </el-col></el-row>

              </el-form>


            </div>
            <!--            <div class="el-node-form-tag"></div>-->

        </div>
    </div>

</template>

<script>
    import lodash, { cloneDeep } from 'lodash'
    import { localDict } from '@/components/core/localdict.js'

    export default {
        data() {
            return {
                visible: true,
                // node 或 line
                type: 'node',
                node: {},
                line: {},
                lineBase:{},
              readonly:true,
              lane:{},
              laneBase:{},
                isBop:true,
                isOrder:true,
                pathtag_tip:false,
                timer_pathtag:null,
                data: {},
                pdmtypeList:[{code:'',name:''},{
                  code: 'SS',
                  name: 'SS 开始后开始'
                },{
                  code: 'FS',
                  name: 'FS 结束后开始'
                }],
                pdmperiodList:[{code:'',name:''},{
                  code: 'H',
                  name: 'H 小时'
                },{
                  code: 'M',
                  name: 'M 分钟'
                }]
              ,
                stateList: [{
                    state: 'success',
                    label: '成功'
                }, {
                    state: 'warning',
                    label: '警告'
                }, {
                    state: 'error',
                    label: '错误'
                }, {
                    state: 'running',
                    label: '运行中'
                }]
              ,
              rules:{
                pdmvalue:[
                  {pattern: /^[0-9]*$/, message: '必须为数字', trigger: 'blur'}
                ]
              }

            }
        },
        mixins: [localDict],
        methods: {
            close_pathtag(){
              this.pathtag_tip=false;
            },
            info_pathtag(evt){
              let _this = this;
              if(this.pathtag_tip){
                clearInterval(_this.timer_pathtag);
                _this.pathtag_tip=false;
                return;
              }
              this.pathtag_tip= true;
              this.timer_pathtag = setInterval(()=>{

                  _this.pathtag_tip=false;
                  clearInterval(_this.timer_pathtag);


              },1500);

            },
            /**
             * 表单修改，这里可以根据传入的ID进行业务信息获取
             * @param data
             * @param id
             */
            nodeInit(data, id) {
                this.type = 'node'
                this.data = data;

              this.readonly=data.readonly;
                data.nodeList.filter((node) => {
                    if (node.id === id) {

                      if(typeof node.require ==='undefined'){
                        node.require='';
                      }
                      if(typeof node.firstflag ==='undefined'){
                        node.firstflag=false;
                      }
                      if(typeof node.lastflag ==='undefined'){
                        node.lastflag=false;
                      }
                        this.node = cloneDeep(node)



                    }
                })
            },
          laneInit(data ,id) {
                this.type = 'lane'
              this.data = data;
            this.readonly=data.readonly;
              data.laneList.filter((nd) => {
                if (nd.id === id) {
                  this.lane = cloneDeep(nd)

                }
              })
            // console.log( id , this.lane);
              },
          lineInit(dat,line) {
              this.data = dat;
              this.readonly=dat.readonly;
            this.type = 'line'
            this.lineBase = line;

            this.line = cloneDeep(line);
          },
            resetData(){
              this.data.nodeList.filter((nd) => {
                if (nd.id === this.node.id) {
                  this.node = cloneDeep(nd)


                }
              })
            },
          resetLane(){
            this.data.laneList.filter((nd) => {
              if (nd.id === this.lane.id) {
                this.lane = cloneDeep(nd)
              }
            })
          },
          // 修改连线
          saveLane() {
              if(this.data.readonly){
                return;
              }
              if(!this.data.laneList){
                return;
              }
            this.data.laneList.filter(( nd ) => {
              if (nd.id === this.lane.id) {
                nd.name = this.lane.name
                nd.left = this.lane.left
                nd.top = this.lane.top
                nd.text = this.lane.text
                nd.resizable = this.lane.resizable
                nd.draggable = this.lane.draggable
                this.$emit('repaintLane',this.lane.id);
              }
            })
          },
            resetLine(){
              this.line = cloneDeep( this.lineBase);
            },
            // 修改连线
            saveLine() {

              if(this.data.readonly){
                return;
              }
                this.$emit('setLineLabel', this.line.from, this.line.to, this.line.pathtag,this.line.pdmtype,this.line.pdmvalue,this.line.pdmperiod)
            },
            saveNode() {

              if(this.data.readonly){
                return;
              }
                this.data.nodeList.filter(( nd ) => {
                    if (nd.id === this.node.id) {
                      nd.name = this.node.name
                      nd.left = this.node.left
                      nd.top = this.node.top
                      nd.ico = this.node.ico
                      nd.state = this.node.state
                      nd.firstflag = this.node.firstflag
                      nd.lastflag = this.node.lastflag
                      nd.require = this.node.require
                      nd.bopid = this.node.bopid
                      nd.subid = this.node.subid
                        this.$emit('repaintEverything')
                    }
                })
            }
        }
    }
</script>

<style>
    .el-node-form-tag {
        position: absolute;
        top: 50%;
        margin-left: -15px;
        height: 40px;
        width: 15px;
        background-color: #fbfbfb;
        border: 1px solid rgb(220, 227, 232);
        border-right: none;
        z-index: 0;
    }
</style>
