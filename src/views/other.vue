<template>
  <div>
    <h1>Other Page</h1>
    <p>managerId: {{ managerId }}</p>
    <router-link to="/">⬅ Back</router-link>
    <van-button type="primary">按钮</van-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Button } from 'vant';

export default Vue.extend({
  components: {
    [Button.name]: Button,
  },
  computed: {
    managerId(): string {
      return this.$route.query.managerId?.toString() || '无'
    }
  },
  mounted() {
    console.log('OtherPage managerId:', this.$route.query.managerId)
  }
})
</script>
