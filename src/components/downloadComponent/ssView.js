/**
 * Name: ssView.js
 * Content: 用于展示番剧可下载的的集数
*/

module.exports = Vue.component('ss-view',{
  props:{
    videoMsg: Object
  },
  data(){
    return {
      border:[]
    }
  },
  methods: {

  },
  template:
  `<div id="ssView">
    <div id="main-section" v-if="videoMsg['main_section'] !== null">
      <div id="main-title">{{ videoMsg['main_section'].title }}</div>
      <CheckboxGroup v-model="border">
        <Checkbox
          v-for="item in VideoMsg['main_section'].episodes"
          :key="item.cid" 
          label="item.title + item['long_title']" 
          border>
        </Checkbox>
      </CheckboxGroup>
    </div>
  </div>`
});