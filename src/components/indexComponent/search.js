/**
 *  Name: search.js
 *  content: 搜索框组件
 */
const { ipcRenderer } = require('electron');

const parsingUrl = require('../../utils/parsingUrl');
const store = require('../../utils/store');
const getVideoList = require("../../API/getVideoList");

module.exports = Vue.component('m-search', {
  data(){
    return {
      searchUrl: "",
      type: {},
      modal: false,
      tabledata: [],
      isSelect: [],
      downloadList: []
    }
  },
  methods: {
    handlesearch () {
      this.type = parsingUrl(this.searchUrl);
      ipcRenderer.send('RTM-getVideoId', this.type);
      ipcRenderer.once('MTR-reVideoMsg', (event, data) => {
        this.$Message.success('获取数据成功');
        // 清空上一次搜索的结果
        this.tabledata = [];
        console.log(data);
        if (this.type.type === "ep" || this.type.type === "ss") {
          if (data['main_section'] !== null) {
            for(let i = 0; i < data['main_section'].episodes.length; i++) {
              let item = data['main_section'].episodes[i];
              this.tabledata.push({
                cover: item.cover,
                title: item.title + ' ' + item['long_title'],
                aid: item.aid,
                cid: item.cid,
                badge: item.badge
              });
            };
          };
        }
        if (this.type.type === "av") {
          if (data.data.length !== 0) {
            for(let i = 0; i < data.data.length; i++) {
              let item = data.data[i];
              this.tabledata.push({
                title: item.part,
                aid: this.type.id,
                cid: item.cid
              });
            };
          };
        }

        this.modal = true;
        // console.log(this.tabledata);
      });
    },
    async ok(){
      // console.log(this.isSelect);
      if (this.isSelect.length !== 0) {
        for (let i = 0; i < this.isSelect.length; i++) {
          for (let j = 0; j < this.tabledata.length; j++) {
            if (this.isSelect[i] === this.tabledata[j].title) {
              this.downloadList.push(this.tabledata[j]);
            }
          }
        }
      }
      else
      {
        console.log("未选中一集");
      }
      // console.log(this.downloadList);
      let vidioDownloadURLS = this.downloadList.map(async (item) => {
        let data = await getVideoList(item.aid, item.cid);
        item.url = data.durl;
        item.qn = data.quality;
        return item;
      });
      console.log(vidioDownloadURLS);
      for (let item of vidioDownloadURLS) {
        console.log(await item);
        ipcRenderer.send('RTM-videoDownload', await item);
      }
      ipcRenderer.on("MTR-videoDownloadMsg", (e, data)=> {
        console.log(data);
      });
    },
    cancel(){
      this.tabledata = [];
      this.modal = false;
    }
  },
  template:
  `<div id="m-search">
    <Input
      class="m-search-input"   
      type="url"
      size="large"
      search 
      enter-button
      v-model="searchUrl"
      @on-search="handlesearch"
      placeholder="输入视频URL" />
    <Modal
      v-model="modal"
      title="下载列表"
      @on-ok="ok"
      @on-cancel="cancel">
      <CheckboxGroup v-model="isSelect">
        <Checkbox 
          style="display: block; width: 80%; margin: 10px auto;"
          v-for="item in tabledata"
          :key="item.cid" 
          :label="item.title"
          border>
        </Checkbox>
      </CheckboxGroup>
    </Modal>
  </div>`,
})