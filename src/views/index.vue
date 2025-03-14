<template>
<div class="main">
    <div class="interaction rr-block">
        <el-button v-if="!showReplay" type="primary" @click="record">录制</el-button>
        <el-button v-if="!showReplay" type="primary" @click="drawCanvas2D">draw</el-button>
        <el-button v-if="!showReplay" type="primary" @click="loadPdf">loadPdf</el-button>
        <el-button v-if="!showReplay" type="primary" @click="addImg">addImg</el-button>
        <el-button v-if="!showReplay" type="success" @click="replay">回放</el-button>
        <el-button v-if="showReplay" type="warning" @click="reset">返回演示</el-button>
    </div>
    <div v-if="!showReplay">
        <div class="form">
            <el-form ref="form" :rules="formRules" :model="form" label-width="80px">
<!--                <el-form-item label="活动名称" prop="name">-->
<!--                    <el-input v-model="form.name" name="name"></el-input>-->
<!--                </el-form-item>-->
<!--              <canvas id="test-canvas" width="200" heigth="100">-->
<!--                <p>你的浏览器不支持Canvas</p>-->
<!--              </canvas>-->
<!--              <iframe id="iframe2d" width="300" height="200" src="/draw2d.html"></iframe>-->
              <div id="pdf-container"></div>
              <img src="duck.jpeg" />
                <el-form-item label="活动区域" prop="region">
                    <el-select v-model="form.region" placeholder="请选择活动区域">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>

<!--              <el-form-item label="活动区域2" prop="region">-->
<!--                <el-select v-model="form.region" placeholder="请选择活动区域">-->
<!--                  <el-option label="区域一" value="shanghai"></el-option>-->
<!--                  <el-option label="区域二" value="beijing"></el-option>-->
<!--                </el-select>-->
<!--              </el-form-item>-->
<!--                <el-form-item label="活动时间">-->
<!--                    <el-col :span="11" prop="date1">-->
<!--                        <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>-->
<!--                    </el-col>-->
<!--                    <el-col class="line" :span="2">-</el-col>-->
<!--                    <el-col :span="11" prop="date2">-->
<!--                        <el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>-->
<!--                    </el-col>-->
<!--                </el-form-item>-->
                <el-form-item label="即时配送">
                    <el-switch v-model="form.delivery"></el-switch>
                </el-form-item>
<!--                <el-form-item label="活动性质" prop="type">-->
<!--                    <el-checkbox-group v-model="form.type">-->
<!--                        <el-checkbox label="美食/餐厅线上活动" name="type" gather="false"></el-checkbox>-->
<!--                        <el-checkbox label="地推活动" name="type"></el-checkbox>-->
<!--&lt;!&ndash;                        <el-checkbox label="线下主题活动" name="type"></el-checkbox>&ndash;&gt;-->
<!--&lt;!&ndash;                        <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>&ndash;&gt;-->
<!--                    </el-checkbox-group>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="特殊资源" prop="resource">-->
<!--                    <el-radio-group v-model="form.resource">-->
<!--                        <el-radio label="线上品牌商赞助"></el-radio>-->
<!--                        <el-radio label="线下场地免费"></el-radio>-->
<!--                    </el-radio-group>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="活动形式" prop="desc">-->
<!--                    <el-input type="textarea" v-model="form.desc"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item>-->
<!--                    <el-button type="primary" @click="onSubmit">打印表单数据</el-button>-->
<!--                    <el-button type="danger" @click="logError">手动抛错</el-button>-->
<!--                </el-form-item>-->
            </el-form>
        </div>
    </div>
    <div ref="replayer"></div>
</div>
</template>

<script>
const rrweb = require("rrweb")
//const mm = require("magic-mirror")
//import * as mm from 'magic-mirror'
//import VideoRecorder from 'magic-mirror'
import rrwebPlayer from 'rrweb-player'
import PDFH5 from "pdfh5";
import { modifyImgSrcPlugin } from '../modifyImgSrcPlugin.js';
export default {
    data() {
        return {
            eventsMatrix : [[]],  // 使用二维数组来存放多个 event 数组
            showReplay: false,
            form: {
                name: '123123123',
                // region: '',
                // date1: '',
                // date2: '',
                // delivery: false,
                type: [],
                // resource: '',
                //desc: '',
            },
            formRules: {
                name: [{
                    required: true,
                    message: '请输入活动名称',
                    trigger: 'blur'
                }, ],
                // region: [{
                //     required: true,
                //     message: '请选择活动区域',
                //     trigger: 'change'
                // }],
                // date1: [{
                //     required: true,
                //     message: '请选择日期',
                //     trigger: 'change'
                // }],
                // date2: [{
                //     required: true,
                //     message: '请选择时间',
                //     trigger: 'change'
                // }],
                // type: [{
                //     required: true,
                //     message: '请选择活动性质',
                //     trigger: 'change'
                // }],
                // resource: [{
                //     required: true,
                //     message: '请选择活动资源',
                //     trigger: 'change'
                // }],
                desc: [{
                    required: true,
                    message: '请填写活动形式',
                    trigger: 'blur'
                }],
            },
            stopFn: null,
        }
    },
    methods: {
        onSubmit() {
            //rrweb.takeFullSnapshot(false);
            console.log(JSON.stringify(this.form))
        },
        logError() {
            throw Error('模拟错误')
        },
        record() {
             const self = this
            // const mmm = new mm({
            //   collectorServer: 'https://ys2.8268805.club/recallcollect-api', // 存证后台服务地址
            //   proxyServer: 'https://ys2.8268805.club/recallstatic-api/proxy?url=', // 跨域时资源下 载代理服务地址
            //   resourceServer: 'https://ys2.8268805.club/resources-api', // 替代图片下载服务地址
            //   // collectorServer: 'http://127.0.0.1:80/recallcollect-api', // 存证后台服务地址
            //   // collectorServer: 'http://127.0.0.1:8888', // 存证后台服务地址
            //   // proxyServer:'http://127.0.0.1/recallstatic-api/proxy?url=', // 跨域时资源下载代理服务地址
            //   // resourceServer: 'http://127.0.0.1/resources-api', // 替代图片下载服务地址
            //   // collectorServer: 'http://49.232.146.118/recallcollect-api', // 存证后台服务地址
            //   // proxyServer: 'http://49.232.146vnpm.118/recallstatic-api/proxy?url=', // 跨域时资源下载代理服务地址
            //   // resourceServer: 'http://49.232.146.118/resources-api', // 替代图片下载服务地址
            //   systemCode: "9504",
            //   pageVersion: "1.1"
            // });
          //rrweb.record()
          //VideoRecorder.
          //mmm.startVideo();
          // mmm.init(
          //     function() {
          //       mmm.startVideo(function() {}, function() {})
          //     },
          // );
            this.stopFn = rrweb.record({
                //checkoutEveryNth: 100, // 每 100 个 event 重新制作快照
                emit(event, isCheckout) {
                    // isCheckout 是一个标识，告诉你重新制作了快照
                    //console.log('event', JSON.stringify(event));
                    if (isCheckout) {
                        self.eventsMatrix.push([]);
                    }
                    const lastEvents = self.eventsMatrix[self.eventsMatrix.length - 1];
                    lastEvents.push(event);
                },
                mutationCb: (mutation) => {
                  console.log("mutationCb------", mutation)
                  mutation.adds.forEach((node) => {
                    if (node.tagName?.toLowerCase() === "img") {
                      node.attributes.src = "https://example.com/placeholder.png"; // 修改 src
                    }
                  });
                },
                //plugins: [modifyImgSrcPlugin()], // 注册插件
                //recordCrossOriginIframes: true, // 启用 iframe 录制
                recordCanvas: true,
                sampling: {
                  canvas: 15,
                },
                // 图像的格式
                dataURLOptions: {
                  type: 'image/webp',
                  quality: 0.6,
                },
                //定制的选项
                // plugins: [rrweb.getRecordConsolePlugin({
                //         level: ["info", "log", "warn", "error"],
                //         lengthThreshold: 10000,
                //         stringifyOptions: {
                //         stringLengthLimit: 1000,
                //         numOfKeysLimit: 100,
                //         depthOfLimit: 1
                //     },
                //     logger: window.console,
                // })],
            });

            // window.addEventListener('message', function(event) {
            //   if (event.data.type === 'iframeEvent') {
            //     console.log('Iframe event:', JSON.stringify(event.data.data));
            //     //rrweb.add(event.data.data)
            //     self.eventsMatrix[self.eventsMatrix.length - 1].push(event.data.data);
            //   }
            // }, false);
        },
        replay() {
            console.log('最近的操作记录: ', JSON.stringify(this.eventsMatrix[this.eventsMatrix.length - 1]));
            if(this.eventsMatrix[this.eventsMatrix.length - 1].length<=0) return this.$message.error("请先点击录制按钮进行录制！");
            this.stopFn();
            this.showReplay = true
            new rrwebPlayer({
                target: this.$refs.replayer, // 可以自定义 DOM 元素
                // 配置项
                props: {
                    logConfig: true,
                    events: this.eventsMatrix[this.eventsMatrix.length - 1],
                    UNSAFE_replayCanvas: true,
                    // plugins: [
                    //     rrweb.getReplayConsolePlugin({
                    //     level: ['info', 'log', 'warn', 'error'],
                    //     }),
                    // ],
                },
            });
        },
        reset() {
            this.showReplay = false
            location.reload()
        },
        drawCanvas2D() {
          let
              canvas = document.getElementById('test-canvas'),
              ctx = canvas.getContext('2d');

          ctx.clearRect(0, 0, 200, 200); // 擦除(0,0)位置大小为200x200的矩形，擦除的意思是把该区域变为透明
          ctx.fillStyle = '#dddddd'; // 设置颜色
          ctx.fillRect(10, 10, 130, 130); // 把(10,10)位置大小为130x130的矩形涂色
          // 利用Path绘制复杂路径:
          let path=new Path2D();
          path.arc(75, 75, 50, 0, Math.PI*2, true);
          path.moveTo(110,75);
          path.arc(75, 75, 35, 0, Math.PI, false);
          path.moveTo(65, 65);
          path.arc(60, 65, 5, 0, Math.PI*2, true);
          path.moveTo(95, 65);
          path.arc(90, 65, 5, 0, Math.PI*2, true);
          ctx.strokeStyle = '#0000ff';
          ctx.stroke(path);
        },
        loadPdf() {
          const pdfh5 = new PDFH5("#pdf-container", {
            pdfurl: "http://127.0.0.1:8080/api.pdf",
            renderType: "svg"
          });

          // pdfh5.on("complete", () => {
          //   this.convertPdfToImages();
          // });
        },
        addImg() {
          const img = document.createElement('img');
          img.src = "http://120.120.121.20:8888/wukong.jpeg";
          document.body.appendChild(img);
        }
    }
}
</script>

<style lang="scss" scoped>
.main {
    padding: 20px;

    .interaction {
        padding: 10px;
    }

    .form {
        width: 600px;
        margin: 20px auto;

        ::v-deep .el-form-item__content {
            text-align: left;
        }
    }
}
</style>
