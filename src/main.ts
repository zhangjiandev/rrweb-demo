import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/styles/index.css';
import router from './router'

Vue.use(ElementUI);
Vue.config.productionTip = false

if (process.env.NODE_ENV === 'development') {
    import('vconsole').then(({ default: VConsole }) => {
        new VConsole({
            onReady: function () {
                const el = document.getElementById('__vconsole');
                if (el) {
                    el.classList.add('rr-ignore', 'rr-block');
                }
            },
        });
    });
}

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
