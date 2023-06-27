<!--  lane 泳道 根据传参 lane.type 决定是  横道vertical （broadwise） 还是  水平horization (dirction)-->
<template>

  <div
    ref="lane"
    :id="lane.id"
    :key="lane.id"
    :style="laneContrainerStyle"
    :class="laneContrainerClass"

  >
    <div
      ref="laneLabel"
      :class="laneLabelDivClass"
      :id="'lanelabel_'+lane.id"
      :key="lane.id"
      :style="laneLabelStyle"
      @click="clickLane"
      v-html="labelHtml"
    >
    </div>


  </div>
</template>

<style>
</style>

<script>


import 'jquery-ui-dist/jquery-ui'
import 'jquery-ui-dist/jquery-ui.min.css'

import { flowMixin } from '@/components/core/mixins'

export default {

  props: {
    lane: Object
  },
  data() {
    return {

      bindresized:false,
      labelHtml:'',
      laneLabelId: 'lane_'+this.lane.id+"_title"
    }
  },
  mixins:[flowMixin],
  methods:{
    onResizeStart(event , ui){
      let id = this.$refs.lane.id;
      // console.log (id,'#'+id+' .ui-resizable-s', $('#'+id+' .ui-resizable-s'));
      if(this.lane.type == 'broadwise') {
        $('#'+id+' .ui-resizable-s')[0].style.backgroundColor = "#ccc";
      }
      if(this.lane.type == 'direction') {
        $('#'+id+' .ui-resizable-e')[0].style.backgroundColor = "#ccc";
      }

    },
    onResizeStop(event, ui) {

      let id = this.$refs.lane.id;
      // console.log(event,ui,this,ui.element[0].id );
      if(this.lane.type == 'broadwise') {
        $('#'+id+' .ui-resizable-s')[0].style.backgroundColor = "transparent";
      }
      if(this.lane.type == 'direction') {
        $('#'+id+' .ui-resizable-e')[0].style.backgroundColor = "transparent";
      }

      let laneid = ui.element[0].id;


      var _that = this;



      // 在停止缩放时改变 Vue 组件的 data 对象中的值
      // this.$data.resizableWidth = ui.size.width;
      // this.$data.resizableHeight = ui.size.height;

      setTimeout(function () {
        // console.log(_that.$refs.lane.style.height ,_that.$refs.lane.style.width);

          // if(_that.lane.type=='broadwise') {
          //   _that.lane.height= _that.$refs.lane.style.height;
          //   _that.$refs.laneLabel.style.height = _that.$refs.lane.style.height;
          // }
          // if(_that.lane.type=='direction'){
          //
          //   _that.lane.width= _that.$refs.lane.style.width;
          //   _that.$refs.laneLabel.style.width = _that.$refs.lane.style.width;
          // }
          _that.laneLabelHtml();

      }, 200);



    },
    onResize(event, ui) {
      // 在缩放过程中实现线的变化
      // 这里可以根据 ui.size.width 和 ui.size.height 的值进行相应的处理
      // 比如根据比例来改变线的长度等等

    },


    getJQSel(id){
      if (id.indexOf('#') != 0) {
        return '#' + id;
      }
      return id;
    },
    // 设置泳道可被缩放
    bindResize: function () {
      if(!this.laneSetting.resizable){
        return ;
      }
      let id = this.lane.id;
      id=this.getJQSel(id);
      let lr=200,bt=150;
      if(this.lane.type=='broadwise'){
        lr=0;
      }
      if(this.lane.type=='direction'){
        bt=0;
      }

      // console.log($(id));

      $(id).resizable({
        // 设置允许元素调整的最小高度
        minHeight: bt,
        // 设置允许元素调整的最小宽度
        minWidth: lr,
        // 设置允许元素调整的最大高度
        // maxHeight: 300,
        // 设置允许元素调整的最大宽度
        // maxWidth: 600,
        // 缩放时保持纵横比
        // aspectRatio: 1/1,
        // grid: [5,5],
        alsoResize:this.$refs.laneLabel,
        // 缩放时的动画
        animate: false,
        // 动画效果种类
        animateEasing: 'easeOutElastic',
        // 动画效果持续时间
        animateDuration: 200,
        // 缩放时的视觉反馈
        ghost: false,
        // 默认隐藏掉可调整大小的手柄，除非鼠标移至元素上
        autoHide: false,
        // 缩放开始时设置两个值防止缩放过程中出现多选框
        start: this.onResizeStart ,

        resize: this.onResize,

        // 缩放结束后需要重新设置节点文字样式、重绘流程图，这个地方需要用到计时器，等动画结束之后重绘。更新泳道对象
        stop: this.onResizeStop
      });

      // 设置节点可缩放后样式被改成了 relative，这里需要再次设置为 absolute
      $(id).css('position', 'absolute');
    },
    clickLane() {

      this.laneHeight = this.height;
      this.laneWidth = this.width;

      if(!this.bindresized){
        this.bindresized = true;
        this.bindResize();
      }

      this.$emit('clickLane', this.lane.id)
    },
   getUUID() {
      return Math.random().toString(36).substr(3, 10)
    },
    laneLabelHtml:function( ){

      let textArr = this.lane.text.split(''), i, tempText = '', a, b, c;
      if (this.lane.type == 'broadwise') {
        for (i = 0; i < textArr.length; i++) {
          tempText += '<span style="display: block;">' + textArr[i] + '</span>';
        }
      } else {
        tempText = '<span>' + this.lane.text + '</span>';
      }
      this.labelHtml = tempText;

      return tempText;
    },
    getLaneLineHeight: function( ) {
      let obj = this.$refs.lane;
      if(!obj ){
        return '30px';
      }
      // console.log('getLaneLineHeight:',obj,this.lane.id);
      if(this.lane.type=='broadwise') {
        let height = obj.style.height;
        let textArr = this.lane.text.split(''), i = textArr.length, h = parseInt(height);
        return h / (i * 15);
      }
      return '30px';
    },
    getLaneHeight: function(){
      if(this.lane.height){
        return this.lane.height;
      }
      if(this.lane.type =='broadwise'){
        return this.laneSetting.laneViewWidth;
      }
      if(this.lane.type =='direction'){
        return this.laneSetting.laneViewLength;
      }
    },
    getLaneWidth: function(){
      if(this.lane.height){
        return this.lane.height;
      }
      if(this.lane.type =='direction'){
        return this.laneSetting.laneViewWidth;
      }
      if(this.lane.type =='broadwise'){
        return this.laneSetting.laneViewLength;
      }
    }



  },
  computed:{
    laneContrainerClass(){
      return {
        'broadwiseLaneNodeOnContainer':this.lane.type==='broadwise'?true:false,
        'directionLaneNodeOnContainer': this.lane.type==='direction'?true:false,
        'laneNode':true,
        'ui-resizable':this.lane.resizable?this.lane.resizable:false,
        'ui-resizable-autohide':true
      }
    }
    ,
    laneLabelDivClass(){
      return{
        'laneLabelClass':true,
        'ui-draggable-handle': this.lane.draggable?this.lane.draggable:false,
      }
    },
    laneLabelStyle(){
      let stl = {} || this.lane.laneLabelStyle ;
      if( this.lane.type=='broadwise'){
        if(!stl.width){
          stl.width = '50px';
        }

        stl.height = this.lane.height;
        if(!stl.height){
          stl.height='300px';
        }

      }
      else{
        if(!stl.height){
          stl.height = '50px';
        }
        stl.width =this.lane.width;
        if(!stl.width){
          stl.width="300px";
        }

      }
      if(this.lane.draggable){
        stl.cursor= 'move';
      }
      return stl;
    },
    laneContrainerStyle(){
      return {
        top : this.lane.top,
        left : this.lane.left,
        height: this.getLaneHeight(),
        width: this.getLaneWidth(),
        lineHeight: this.getLaneLineHeight()
      }
    }

  },
  mounted() {
    this.getLaneLineHeight();
    this.laneLabelHtml();

  }
}
</script>
