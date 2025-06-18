<template>
  <div class="main">
    <div class="interaction txr-block">
      <el-button v-if="!showReplay" type="primary" @click="record">录制</el-button>
      <el-button v-if="!showReplay" type="primary" @click="drawCanvas2D">draw</el-button>
      <el-button v-if="!showReplay" type="primary" @click="jump">jump</el-button>
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
          <canvas id="test-canvas" width="200" height="100">
            <p>你的浏览器不支持Canvas</p>
          </canvas>
          <!--              <iframe id="iframe2d" width="300" height="200" src="/draw2d.html"></iframe>-->
<!--                        <iframe id="iframe2d" width="600" height="500" src="/draw2dnew.html"></iframe>-->
          <div id="pdf-container"></div>
          <img src="duck.jpeg" test="1"/>
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

<script lang="ts">
import Vue from 'vue';
//import { registerServiceWorker } from './utils/register-sw';
//const rrweb = require("rrweb")
//import rrweb from 'rrweb'
import {record} from "rrweb";
//const mm = require("magic-mirror")
//import * as mm from 'magic-mirror'
//import VideoRecorder from 'magic-mirror'
import rrwebPlayer from 'rrweb-player'
import PDFH5 from 'pdfh5';
import {ensureServiceWorkerReady} from "@/utils/sw-bridge";
import { SafeIndexedDBQueue } from '@/utils/SafeIndexedDBQueue';
import {flushQueueToServiceWorker,  handleBeforeUnload} from "@/utils/flush-to-sw";
//import { modifyImgSrcPlugin } from '../modifyImgSrcPlugin.js';
let queue: SafeIndexedDBQueue<any> | null = null;
let recorderStopFn: any//: (() => void) | null = null;
let flushTimer: any = null;
let beforeUnloadHandler: ((e: BeforeUnloadEvent) => void) | null = null;
export default Vue.extend({
  mounted() {
    console.log('[pagehide] triggered!');
    window.addEventListener('pagehide', () => {
      // 合并所有还没确认发送的数据
      debugger
      const dataToSend = [...(this.flushBuffer || [[]]), ...this.eventsMatrix];
      if (dataToSend[0].length > 0) {
        console('pagehide is working!');
        const blob = new Blob([JSON.stringify(dataToSend)], {
          type: 'application/json',
        });
        navigator.sendBeacon('http://127.0.0.1:8080/api/events/uploadBeacon', blob);
      }
    });
  },
  created() {
    // sw |-->
    // ensureServiceWorkerReady();
    // queue = new SafeIndexedDBQueue<any>('rrweb-events');
    // beforeUnloadHandler = (e) => {
    //   handleBeforeUnload(queue);
    // };
    // window.addEventListener('beforeunload', beforeUnloadHandler);
    // sw <--|

  },
  destroyed() {
    // if (beforeUnloadHandler) {
    //   window.removeEventListener('beforeunload', beforeUnloadHandler);
    // }
  },
  data() {
    return {
      eventsMatrix: [[]],  // 使用二维数组来存放多个 event 数组
      flushBuffer: [[]], // 等待发送的缓存副本
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
        },],
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
      /** mm
       const mmRecord = new magicMirror({
       collectorServer: 'https://ys1.8268805.club/recallcollect-api', // 存证后台服务地址
       proxyServer: 'https://ys1.8268805.club/recallstatic-api/proxy?url=', // 跨域时资源下载代理服务地址
       resourceServer: 'https://ys1.8268805.club/resources-api', // 替代图片下载服务地址
       systemCode: "5764", // 系统代码 填写集成时提供的数字
       pageVersion: "1.2",
       // workerScriptUrl:"../../js/mm-worker.min.js"
       });

       mmRecord.init(
       function() {
       mmRecord.startVideo(function(res) {}, function() {});
       },
       function(error) {
       console.log(error);
       },
       '12345dsafsd5f4a6f4f5a6s4df56ds4f'
       );
       **/
      //const queue = new SafeIndexedDBQueue<any>("rrweb-events");
      const FILTERED_ATTRS = new Set([
            'guaranteeplandatalist',
            'tabsval',
            'detailmagedatalist',
            'insureinfodatalist',
            'agreementlist',
            'productinfodatalist',
            'isvariablepremiumflag',
            'footerdatalist',
            'modularlist',
            'mesnumber',
            'healthyinfomation',
            'additionguaranteedatalist',
            'insuredpersoninfolist',
            'policyholdertype',
            'policyholdertypeoption',
            'insuredpersontypeoption',
            'autorenewaccredit',
            'scrolltop',
            'divheight',
            'test',
          ]);

// 模糊匹配的前缀（通配）
      const FILTERED_PREFIXES = [
        //'data-',
        // 'v-',
        // 'aria-',
        // 'x-',            // 如 x-show, x-data 等（Alpine.js）
        // 'test-',         // 常用于测试标签
      ];
      // 支持精确 + 模糊匹配
      function isFilteredAttr(attr: string): boolean {
        if (FILTERED_ATTRS.has(attr)) return true;

        return FILTERED_PREFIXES.some(prefix => attr.startsWith(prefix));
      }
      function cleanNodeAttributes(node: any) {
        if (node.attributes) {
          Object.keys(node.attributes).forEach((key) => {
            if (isFilteredAttr(key)) {
              delete node.attributes[key];
            }
          });
        }

        if (node.childNodes) {
          node.childNodes.forEach(cleanNodeAttributes);
        }
      }
      function filterEventAttributes(event: any) {
        // FullSnapshot 类型，递归清洗 node 属性
        if (event.type === 2 && event.data?.node) {
          cleanNodeAttributes(event.data.node);
          return;
        }

        // IncrementalSnapshot 的 attribute 变化事件（Mutation）
        //if (event.type === 3 && event.data?.source === 0 && event.data.attributes) {
        if (event.type === 3 && event.data.attributes) {
          Object.keys(event.data.attributes).forEach((key) => {
            if (isFilteredAttr(key)) {
              delete event.data.attributes[key];
            }
          });
        }
      }
      recorderStopFn = record({
        //checkoutEveryNth: 100, // 每 100 个 event 重新制作快照
        emit(event, isCheckout) {
          // snapshot 类型事件 & node 来源
          //filterEventAttributes(event);
          // isCheckout 是一个标识，告诉你重新制作了快照
          //console.log('event', JSON.stringify(event));
          if (isCheckout) {
            self.eventsMatrix.push([]);
          }
          const lastEvents = self.eventsMatrix[self.eventsMatrix.length - 1];
          lastEvents.push(event);
          //sw |-->
          // if(queue) {
          //   queue.add(event);
          // }
          // 开启定时 flush
          // flushTimer = setInterval(() => {
          //   if (queue) {
          //     flushQueueToServiceWorker(queue);
          //   }
          // }, 5000); // 每 5 秒 flush 一次
          //sw <--|
          //flushTimer = setInterval(self.flushEvents, 5000); // 每 5 秒上传一次
        },
        recordCanvas: true,
        ignoreClass: 'txr-ignore',
        blockClass: 'txr-block',
        inlineStylesheet: false,
        // maskAttributeFn(name, value) {
        //   // 除了 class，其它属性一律忽略
        //   return name !== 'class';
        // },
        // sampling: {
        //   canvas: 5,
        // },
        sampling:{
          canvas: 1,
        },
        // // 图像的格式
        // dataURLOptions: {
        //   type: 'image/webp',
        //   quality: 0.1,
        // },
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

      // 创建一个显示时间戳的元素
      const timestampOverlay = document.createElement('div');
      timestampOverlay.style.position = 'absolute';
      timestampOverlay.style.top = '10px';
      timestampOverlay.style.right = '10px';
      timestampOverlay.style.padding = '5px 10px';
      timestampOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
      timestampOverlay.style.color = 'white';
      timestampOverlay.style.fontFamily = 'monospace';
      timestampOverlay.style.zIndex = '9999';
      timestampOverlay.textContent = 'Timestamp: --';
      document.body.appendChild(timestampOverlay);
      //console.log('11111111111111111')
      console.log('最近的操作记录: ', JSON.stringify(this.eventsMatrix[this.eventsMatrix.length - 1]));
      if (this.eventsMatrix[this.eventsMatrix.length - 1].length <= 0) return this.$message.error("请先点击录制按钮进行录制！");

      //this.stopFn();
      recorderStopFn();
      if (flushTimer) {
        console.log("关闭定时任务！")
        clearInterval(flushTimer);
        flushTimer = null;
      }
      //sw |-->
      // if(queue) {
      //   flushQueueToServiceWorker(queue);
      // }
      //sw <--|
      this.showReplay = true
      const player = new rrwebPlayer({
        target: this.$refs.replayer as HTMLElement, // 可以自定义 DOM 元素
        // 配置项
        props: {
          //logConfig: true,
          events: this.eventsMatrix[this.eventsMatrix.length - 1],
          UNSAFE_replayCanvas: true,
          mouseTail: false
          // plugins: [
          //     rrweb.getReplayConsolePlugin({
          //     level: ['info', 'log', 'warn', 'error'],
          //     }),
          // ],
        },
      });

      function formatTimestamp(timestamp: number) {
        var date = new Date(timestamp);

        function pad(n: number) {
          return n < 10 ? '0' + n : n;
        }

        var Y = date.getFullYear();
        var M = pad(date.getMonth() + 1); // 月份是从 0 开始的
        var D = pad(date.getDate());
        var h = pad(date.getHours());
        var m = pad(date.getMinutes());
        var s = pad(date.getSeconds());

        return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
      }

      // 获取底层的 Replayer 实例
      const replayer = player.getReplayer();
      // 监听每个事件的播放
      replayer.on('event-cast', (event) => {
        //console.log('event:', event)
        const e = event as { timestamp: number };
        if (e.timestamp) {
          const time = formatTimestamp(e.timestamp);//new Date(event.timestamp).toLocaleTimeString();
          timestampOverlay.textContent = `时间: ${time}`;
        }
      });
      replayer.play();
    },
    reset() {
      this.showReplay = false
      location.reload()
    },
    drawCanvas2D() {
      let
          canvas = document.getElementById('test-canvas') as HTMLCanvasElement,
          ctx = canvas.getContext('2d');
      if(ctx) {
        ctx.clearRect(0, 0, 200, 200); // 擦除(0,0)位置大小为200x200的矩形，擦除的意思是把该区域变为透明
        ctx.fillStyle = '#dddddd'; // 设置颜色
        ctx.fillRect(10, 10, 130, 130); // 把(10,10)位置大小为130x130的矩形涂色
        // 利用Path绘制复杂路径:
        let path = new Path2D();
        path.arc(75, 75, 50, 0, Math.PI * 2, true);
        path.moveTo(110, 75);
        path.arc(75, 75, 35, 0, Math.PI, false);
        path.moveTo(65, 65);
        path.arc(60, 65, 5, 0, Math.PI * 2, true);
        path.moveTo(95, 65);
        path.arc(90, 65, 5, 0, Math.PI * 2, true);
        ctx.strokeStyle = '#0000ff';
        ctx.stroke(path);
      }
    },
    loadPdf() {
      const pdfh5 = new PDFH5("#pdf-container", {
        pdfurl: "https://mesbj-sit.chinalife-p.com.cn/mesci/elec/elecPDF/ncispElecPdf/specialPdf/renewPayAgreement.pdf",
        uploadUrl: "https://ys1.8268805.club/recallcollect-api/static/pdf/sync",
        //renderType: "svg"
        //scrollEnable: false,
        lazy: false,
        zoomEnable: true,
      });

      // pdfh5.on("complete", () => {
      //   this.convertPdfToImages();
      // });
    },
    addImg() {
      const img = document.createElement('img');
      img.src = "http://120.120.121.20:8888/wukong.jpeg";
      document.body.appendChild(img);
    },
    flushEvents(OK: Function) {
      console.log("this.eventsMatrix[0].length:", this.eventsMatrix[0].length);
      if (this.eventsMatrix[0].length === 0) return;

      // 副本缓存，避免直接清空主缓存
      this.flushBuffer = this.eventsMatrix.map(row => row.slice());  // 克隆
      this.eventsMatrix = [[]]; // 清空主缓存，准备接收新事件
      //console.log('body:', JSON.stringify(this.flushBuffer[0]));
      const data = {
        metaData: {
          sendDate: new Date().toISOString(), // 当前时间
        },
        payload: {
          // rrweb 事件内容，比如
          events: this.flushBuffer[0]
        }
      };
      // 异步上传（示例用 fetch；也可以是 sendBeacon）
      fetch('http://127.0.0.1:8080/api/events/upload', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
        //keepalive: true // 如果支持
      })
          .then(response => console.log(response.text()))
          .then(() => {
        this.flushBuffer = null; // 标记：已成功发送
            window.location.href = '/draw2dnew.html';
        //OK();
      }).catch((e) => {
        // 失败？可以将 flushBuffer 再次合并进 activeBuffer（可选）
        console.log("catch:", e)
        this.eventsMatrix = this.flushBuffer!.concat(this.eventsMatrix);
        this.flushBuffer = null;
      });
    },
    flushEventsXHR(OK: Function) {
      if (this.eventsMatrix[0].length === 0) return;

      // 副本缓存，避免直接清空主缓存
      this.flushBuffer = this.eventsMatrix.map(row => row.slice());  // 克隆
      this.eventsMatrix = [[]]; // 清空主缓存，准备接收新事件
      //console.log('body:', JSON.stringify(this.flushBuffer[0]));
      const data = {
        metaData: {
          sendDate: new Date().toISOString(), // 当前时间
        },
        payload: {
          // rrweb 事件内容，比如
          events: this.flushBuffer[0]
        }
      };
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://127.0.0.1:8080/api/events/upload', true); // 异步请求
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          OK();
        }
      };
      xhr.send(JSON.stringify(data));
    },
    jump() {
      //window.location.href = '/draw2dnew.html';
      const safeRedirect = () => {
        //setTimeout(() => window.location.href = '/draw2dnew.html', 0);
        window.location.href = '/draw2dnew.html';
      }
      this.flushEvents(safeRedirect);
    }
  }
})
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
