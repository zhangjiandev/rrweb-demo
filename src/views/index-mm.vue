<template>
  <div class="main">
    <div class="interaction rr-block">
      <router-link :to="{ path: '/other', query: { managerId: managerId } }">
        ➡ Go to Other Page
      </router-link>
      <el-button v-if="!showReplay" type="primary" @click="record">录制</el-button>
      <el-button v-if="!showReplay" type="primary" @click="drawCanvas2D">draw</el-button>
      <el-button v-if="!showReplay" type="primary" @click="loadPdf">loadPdf</el-button>
      <el-button v-if="!showReplay" type="primary" @click="addImg">addImg</el-button>
      <el-button v-if="!showReplay" type="primary" @click="stop">stop</el-button>
      <el-button v-if="!showReplay" type="success" @click="replay">回放</el-button>
      <el-button v-if="showReplay" type="warning" @click="reset">返回演示</el-button>
    </div>
    <div v-if="!showReplay">
      <div class="form">
        <el-form ref="form" :rules="formRules" :model="form" label-width="80px">
          <!--                <el-form-item label="活动名称" prop="name">-->
          <!--                    <el-input v-model="form.name" name="name"></el-input>-->
          <!--                </el-form-item>-->
          <canvas id="test-canvas" width="200" heigth="100">
            <p>你的浏览器不支持Canvas</p>
          </canvas>
          <!--              <iframe id="iframe2d" width="300" height="200" src="/draw2d.html"></iframe>-->
<!--                        <iframe id="iframe2d" width="600" height="500" src="/draw2dnew.html"></iframe>-->
<!--          <div id="pdf-container"></div>-->
<!--          <img src="duck.jpeg" test="1"/>-->
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
                          <el-form-item label="活动形式" prop="desc">
                              <el-input type="textarea" v-model="form.desc"></el-input>
                          </el-form-item>
          <!--                <el-form-item>-->
          <!--                    <el-button type="primary" @click="onSubmit">打印表单数据</el-button>-->
          <!--                    <el-button type="danger" @click="logError">手动抛错</el-button>-->
          <!--                </el-form-item>-->
          <img :class="showA ? 'RiskFactor:healthQuestionnaire:1' : 'RiskFactor:healthQuestionnaire:0'" v-show="showA" @click="toggle" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAOKADAAQAAAABAAAAOAAAAAANV2hTAAACJklEQVRoBe2bv0oDQRDGZ/cSGwOCnSC+gKCvIBaCtXJgEYgQC9FCUvgQFmphsEgggRTKobVgEXwFBV9AAnaCcDYmd+vO5ZKsF8m2s+dckczuTeD75nd/mi8CMke7fbfaV4OqULClAFYAVCnTQmwpQgHwpgQ8FkWhWansvpoC9bnhEQTB3OdXdA4KDvWOHO079h2DgOuFea/m+/43ak8MpuYetLlNxwz9LVdAV5vcRpMJqZRcPsyhZQ0q8aRLkdxzcf9F1+Zl2fOkPC16hadyeecdf0P16HTul/rRYCOK4zOtcdnQGRdlcU00WrcXoNSJcaInSt561fc/jD3yZTMIFlUYPWuhE5NCXEp8WprqkZxr5lA/akbtphf0Joevgsk2XpaTlVtVVjt60/fd7/cc9Xtu1sintauS+WCZ9Vtnz7FBZ9GlwpkgEyQ+Ab5EiQOyymOC1hERb2CCxAFZ5TFB64iINzBB4oCs8pigdUTEG5ggcUBWeUzQOiLiDUyQOCCrPCZoHRHxBiZIHJBVHhO0joh4AxMkDsgqjwlaR0S8gQkSB2SVxwStIyLe8B8IitCEgNkvc+1SPa1dhBLDpKYJDLaZa5fqrHb0JjEpa5rA1B4G28w9F2rUnCYOx3LRW/7jlGi30bq50iHSo7H1PBQC6gf7e8fJUxQzzjrc3M2Dr8TDMNJcwzoxiNlmzDhrk3W9FydNbn5gKL0+ymujhXHqfuQnb38r+AF+AbH0nYzk8wAAAABJRU5ErkJggg==" >
          <img v-show="!showA" @click="toggle" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAOKADAAQAAAABAAAAOAAAAAANV2hTAAAOa0lEQVRoBaVaXaydRRWdc7iArQWNCKLFQgGlpVUQFQMYDYU08CLUhB9r0iamMdEYH9pofG4TY2JC1YhNTF/gwQTig5SipDF9aEGjUoqSqigFUlGLta2Qegu03OP62XtmzrGUe3V6z5mZvddee+2Z+b7vnHs7KBPtrB9+a9nMzMl1pQxWljJaBPeCwWBQRhigwyvGQ4/xLnv6OSFOdmDUbFAs4GEKHH2djU7moI2deXPuvscMh8NjozI6AOyOqXLW1oO3fHGfEsQbItyWPfjgWX888ud7yszMl2AZOoHdTDgYujCiOVbPjiqiS2E20GUfMW0c9urCgD+cE4d/o8FIPe1szFfjY24HQxJETJkZDM/YcsHCd63ft+zO1xXLNxb3zOE//Ww0Gq2QkUH8iZ42RnPqof2e0MWtwlp3cYJSmD1wRTxDA6fdYSmxYH1Bk3kyRnbhzWxeLgp45cTuDIY7z1943q0sUoeIOzdZHLHZRB4TjimMLcnJ7FUO8XIK4iNGQfhRXI0fQIjt5hLExTvUBown89e1DF7lDy7rG6049Pcj94iX19wbJ0/8DhPko3gcD/R1VTNBJWCYmxJDY0vACQV1ouTn7jUf8WrMI7t3v2JSOEHBlb4WGzk6XmJ0KsRbZobDMz489A0F11yQ4aIVqebkJ4EE5b7ZowUIn49o2GljQ5fJOOXCiSf85E3Rg8zJVChOWAahJQYnzAaS8AeXRfp0EsJbxwCMRjPrpsC20gGIQssd5JgEEhnjxGUqojNJYsdsEhsiTS9xetN8PJ452XrOOo94r09qNVYa6cCPx4wS90pUqUcBLWpYV/QGu6BGgswIY6BttSiGsClUTs9pks1TCc+dMIkEVTAHCg8Oxnatz6dw+VDSWA4YIyluPIum4NRzLldNYFdvYAjKa1I4EOSqiVtCeOScS+uIiTmJJJWdWkCOqYvXmpzNzymPI32MyaNtLuICC5z8mjdbrx8MC3ztkdRUYqiJmS2ESVHOgaW5X7nen2IIJ9BzF+rAiBWAkChUcOCzcMEwx7+IFlbjzC+OcX/eE/jomCK5EtQcDLdNIxHZ2RJjLlE65zXppFAuQLVN5Gl2pbPMiUJpTG2SEYUTRnvqq2HVZl2Mr48GRHBeBbVg2mPHhCDGAyfPRA3HlatN48n4JIh8SGbBHNRIjzGnlppUboOoIwu1vxXmGH4kUywD7EzRKgJv9a6KsQkVwLCaVFjKCAA58hqSOgEc7zjGWpwKwpiCFMfY7kU8w79++cfL059eW75x+bWa207d9ueclozHqEyRuD07kIg3FcXxrRVNnFz1mJgcZjSM+aNCJBU29mGjHT/yCJNYQRwX8S3aI8I3LrmhfPmSqwXecNnHyvlnzy9fe2ZXZOj1d9eiqXkNUkWI57AvgD44LYxjCnOvgmSwjRiVAIA50VcQMQ5kZyzgHVdEV37hAd645PpaHDFsay66UrEscrLV3OTGhB8HhFFhGnreRHTXD7B6akSMMLSJS4y1EJLqFh++PBkV6zQVr2OVPOHbeMV/F0detjULryzf/OANNV51SEIECzWK0ynBeYGixy7S5KSK0orJph120XmdeXfaQiiO8cRmuHKYU7nxZhxzxdECNhdAx3Kxj2XiJ/svLFxe3j/vHBLJZR0xhY3zKQe5uAT0RE7IIN6PODMWloAJYVaRGkVnIjSmiDAoT+8klu7AbLwC19xbFEfOg69Pl4OvTXMY8RqOvanALMxHypULFYId4cJYDtmoT2NPYaPDthSavPLRH5g6J55fblkYx3htmmVx/0Bhdzy1vZwYzdT7hi8fygOf8mEHkzx7LYXS4S0E2Rflhxj6xmLGsEngvuJQgY5tuNOu5UL8bI4lQ1ncZ3+7vex/9eUqN2XJQG2RQ7+a4Dh3hiOCh/VuCicD4rrMyH73+puJmIivq+hMY/PMThfGjJ9TcU89XJ6dPjqmWVmiStLn9e8HfSe+X+E+SNtvPRLFZ2fwteco/bpWE8i5q2EROSavBdi3aeknZ3XNeedQ3PF/iSv5+pxZGHOw1SOKCFv4HuNG0Gz0JZK7KAwMecz6QjKeATnOnmm4d3MqDju3//jL1icRsWjB71PVFpK5hnnUnBDvLIDB+aJDhuwQIR9xHESLIW29uS+ODj0PEULcXIpbxWOJ4rSAjDexjynmrY4QHp0+pVkUQuK6y4e5CgDwgrfNLxuWXluue/dCVSk7KMURb8lBI5PVOcZsnqPX5cBPKLN7FPBYrtq7zTsXPFqoyukFrfmUXwq0CH4OUmSsAc8zd8ArMiqXLnhHefSmu8vC+edo9b+65+flvuefVqECViQLZjIEk885SKw5V54D3tX08WsWzzkXh2P56iuIRby4JdapyT3RciGlH1B8o6egPsiHgMDFKu4uFUce2r730Zups9z/wj6k9HmnXU2dC8nTYF9b5Y1L57BzvObwKDB3LB4nzNNr5lg/EuClDL++D/IDJueSFo7FC87FzrXilES8KPKam8vaS5arYBfgQoWJeO0Yk3KOhzkFzO1Yorhp3C1FytPRWi6oUkW+pqPhGMTfyaA53GJ40Er5wSduqTvXhWhI3HevuQnXUyn3YSe5OnU3GU0CdWHHZE43lL3tbumjRjKfgqpFOfiGxo43DhZLHE0as0AdMyi1j0i8Sjnv7Hnq3+yNBN+5+ia57z/we/Xk1M5hxjRZ9FyKu33vQ9i5V7R4JM1F55jKNO962k9lyzqiMsKiqfJB2bBnZ5k+eSKtp+yzyDUXL5M/BdCuF+6Ym5bM7iH+Eu6WLO654yiOW8AlCi2axQZ0JkKENV4Sqo0O3jDbl3mROoCBjx16sdzx2E9mV+RVK8rai5cHeRAh3yY+Ci49/VceyqqPAuycFcPYaGTyueKpoG/cqYXlI04/zccTpJtMxcfAO1DKbhR55+MPzarIzVfdqCLbsWRxH6Gc0zYWdzufc7yhSFvcmRFVP3bBkZq0q/SxmGpnoG+UStbZ/RykNYy5cloVmHcd+ku56xcPlQeuv63MnzpT8ad6Y7LNH7pRST/w9nfOqjgey1W65vitQIopww29dy2mcthi7ISKiJdVsbzz4t/8H317pAB4klx/DMl5GD91wUXlgetOX+REytNOuXO3PclrLoojmsUhX9UTn6zkkh1FA9MXqBDgtCGhtX8G+4iKV5E+FoRHstz6Xf98sdz9y21veVwp5q2abigo7nncULSqFA+RFJ7FKX8Q5VEdKwI+FyqhNa7GMxYufV3yxjuXxmOJonDYdh1Gkb96+P8qUjcUFLd/mh+cpQHv8XBBjlzQKpQmNM7l1oQoN9oiWhiNKTl2XwXqy62I4q+uESyuZA3G3Szy1/9bkblzLM47hgwUkzk4je+TaUqfhbciXbBE48u5n3baMY67hj9nj59frSrZ+SMfLDEWKSaPHf5r+dxvtpfpN07/nOzylFpcHstwZgHZa2+QXzpiFySnVewFgaYsmqOMpy3H7IdiSiUsBC8WlA1rpoDcevVwssjVsyzypdf+XW7f4xuKCwCBVTt95lNu71KapCWKo+D++2QWEodLkmUTN3PwGsQbjbLxTYy2mVxxwnBkAq/e7iMo8onT76SL21ae01eezMU8fm5xxOTWoFkUbRvdbJm34niwOt0ax477y4Pj/Usn8HoVIqkKNbHZY8z81uCEmO7GTn7+iUdOeVxrcfw1Q2RAoMfs9UpKK6gFAMWWsDw59OdpCoQIen/eYMiImrvVU3CERTEJdmKuh/EWSgG4Jo/+rax+8qdjRY4Vp0VBXL0BBAeLzgrQc5gLQV4upvoxjbbRnoVynHgvU2BUIEgSSHoTOg3C9I92JjOSojw2qRM9fhQ3nj2PlBfwefIPxw7jmsOxzF8QMTxiyOGxczmfbwwSR2fFOrDpC/nyt3h/U7Ixuc0FzLk/3uwo8sKbAA0miJzYOP9G2idcdmER3935Ek+u5GYyF4U+rxnm5poFjhProBURnV2wmiMDGUuY8xAjQszxW7XuugOIAlQxudEyiB+R0u4YAjiyADJaVGUYi+ekrbR3zIwYW53ixWfWyq0F6fSQKxcpx8b4NEknHWDw70WljOa2Ak4qkxLlvBETSxIms1SPmzH99GacbcAIFn2ESAEB/IngyhEYxyltcFBAzMfy2JiHhIxGsctXxGUyOqoIlW2sbREXMexoJxfjPUZfwXTal73Spg55440OxKUO9bShpc36lQxG5+ZpwA7i/1sORgt6cAb114j9YkRY7AjESM9EshYXDocFljaplTjX46PlvMndxNPuo2ub8qMK4Uknkjwl6FmhzMNj+E5fDnjigCwuMJSiVslqceEY85sjYyoC+SpvxFtCIizOOcY9icj8bXHTw77Fszjm94KMDuA2ONqRyWmUI3Ogr7/TQFAVgBXLhKTPeNPGSgoDny6CINRKY8xeY+1lzMnkpSFf/9JiK+TN7Y62fmcjtuzAF4mprSDA/5RtwQSnaIZIJKL4OdC6mpAwhGBzpFD7MsYSajwF15yRT4UR19rYgjMtMM7uGGQU2Ho5C/8AfxkdDbcOj3zmK/tg3GKUiXP1QAG+RiB72JykF6/cSdA941gJeKIYF23OzNkL1lghfGMoJYcOzbs8JICNjXEcakM4Hgy3PLts9T59eXrf5ReuB8VO2EXIXmj9RpphuSq2k4xHtxbPYygYbBx3LTG6e6adcC5cQBNDdx33vhgnXrjMyRjl9DKZd7Rz3ujM9cSpQP7f5vde9p5bMb8XL/zR24xO5l3yGHYVBlRNOo7VSk7EEysRisUiIDybBZGWIFudyzYdUZhpyxc1ZBMWScmKpwG13zuvnK3/r01MQ0bEhY9+f9nJUtZhxVcieBFi9d8tufkiU1S/U2GPpPxCTtxYobHCvV1cmR19cvf2HLM3n0VyXk/KoByD9QAAO/DtfSuPZZSi7j/PpNDz5f997gAAAABJRU5ErkJggg==" >
        </el-form>
      </div>
    </div>
    <div ref="replayer"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Route } from 'vue-router'
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
  created() {
    ensureServiceWorkerReady();
    queue = new SafeIndexedDBQueue<any>('rrweb-events');
    beforeUnloadHandler = (e) => {
      handleBeforeUnload(queue);
    };
    window.addEventListener('beforeunload', beforeUnloadHandler);
  },
  destroyed() {
    if (beforeUnloadHandler) {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    }
  },
  mounted() {
    //this.managerId = this.$route.query.managerId
    //this.record();
  },
  data() {
    return {
      eventsMatrix: [[]],  // 使用二维数组来存放多个 event 数组
      showReplay: false,
      showA: true,
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
      mmRecord: null,
      managerId: null
    }
  },
  methods: {
    toggle() {
      this.showA = !this.showA;
    },
    onSubmit() {
      //rrweb.takeFullSnapshot(false);
      console.log(JSON.stringify(this.form))
    },
    logError() {
      throw Error('模拟错误')
    },
    record() {
      const self = this
      //mm
       this.mmRecord = new magicMirror({
       collectorServer: 'https://ys1.8268805.club/recallcollect-api', // 存证后台服务地址
       //collectorServer: 'https://127.0.0.1:8080/api/events', // 存证后台服务地址
       proxyServer: 'https://ys1.8268805.club/recallstatic-api/proxy?url=', // 跨域时资源下载代理服务地址
       resourceServer: 'https://ys1.8268805.club/resources-api', // 替代图片下载服务地址
       systemCode: "5764", // 系统代码 填写集成时提供的数字
       pageVersion: "1.2",
       comCode: "12345", // 出单机构 新增
       productId: "1234567890", // 产品ID 新增
       inlineStylesheet: false,
       recordCanvas: true,
       blockFiltersOptions: 'link[rel="preload"]',
       sysKey: 'df55ec0acc746aba865b'
       // ignoreAttributes: [
       //   'guaranteeplandatalist',
       //   'detailmagedatalist',
       //   'insureinfodatalist',
       //   'agreementlist',
       //   'productinfodatalist',
       //   'morequestion',
       //   'footerdatalist',
       //   'modularlist',
       //   'healthyinfomation',
       //   'additionguaranteedatalist',
       //   'insuredpersoninfolist',
       //   'test'
       // ]
         //inlineStylesheet: false

       // workerScriptUrl:"../../js/mm-worker.min.js"
       });

      this.mmRecord.init(
          function () {
            self.mmRecord.startVideo(function (res) {
            }, function () {
            });
          },
          function (error) {
            console.log(error);
          },
          //self.$route.query.managerId,
          //self.$route.query.managerId,
          '12345dsafsd5f4a6f4f5a6s4df56ds4f'
      );

      // self.mmRecord.startVideo(function (res) {
      // }, function () {
      // });

      //const queue = new SafeIndexedDBQueue<any>("rrweb-events");

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
      if(queue) {
        flushQueueToServiceWorker(queue);
      }
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
    stop() {
      console.log("mmRecord:", this.mmRecord)
      this.mmRecord.stopVideo(()=>{
        window.location.href='/draw2d.html'
      }, ()=>{
        window.location.href='/draw2d.html'
      });
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
