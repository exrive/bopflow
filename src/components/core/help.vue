<template>
    <el-dialog
            title="帮助"
            :visible.sync="dialogVisible"
            width="70%"
            customClass="flowHelp"
    >
        <el-tabs tab-position="left">
            <el-tab-pane label="如何新增">
                <el-divider content-position="left">如何新增</el-divider>
                <div>按住鼠标拖拽左侧组件到中间画布中松开鼠标即可,画布中不能有相同重复的节点。</div>
            </el-tab-pane>
            <el-tab-pane label="如何删除">
                <el-divider content-position="left">页面删除</el-divider>
                <div>
                    鼠标点中需要删除的节点或连线，点击左上角的删除图标
                </div>
            </el-tab-pane>
            <el-tab-pane label="如何移动">
                <el-divider content-position="left">如何移动</el-divider>
                <div>鼠标移动到节点中，当鼠标变为可拖拽的图标时按下鼠标移动到新的位置松开鼠标。</div>
            </el-tab-pane>
            <el-tab-pane label="如何连线">
                <el-divider content-position="left">如何连线</el-divider>
                <div>鼠标移动到节点周围的圆点，按鼠标左键后拖动就可以把方向线移动到目标节点的圆点附近，达部分重叠后松开鼠标左键。<br/>源节点与目标节点同一方向只能有一条连线。</div>
            </el-tab-pane>
            <el-tab-pane label="如何设置连线属性">
                <el-divider content-position="left">如何设置连线属性</el-divider>
                <div>点击画布中的连线，在页面右侧会出现一个表单，输入属性，点击【保存】。<br/>在没有保存的情况下，点【重置】可恢复变更的内容。</div>
            </el-tab-pane>
            <el-tab-pane label="如何进行后端交互存储">
                <el-divider content-position="left">如何进行后端交互存储</el-divider>
                <div>读数据时写读数据的API，保存到服务端时写数据的API</div>
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>

<script>
    export default {
        data() {
            return {
                dialogVisible: false
            }
        },
        components: {},
        methods: {
            init() {
                this.dialogVisible = true
            }
        }
    }
</script>

<style>
    .flowHelp {
        height: 80%;
    }
</style>
