<template>
  <div id="Home">
    <Layout>
      <hl-header
        @collapsedSider="collapsedSider"
        :isCollapsed="isCollapsed"
        @downMenuClick="downMenuClick"
      ></hl-header>
      <Layout class="ivu-layout-has-sider">
        <hl-sider
          :activeName="activeName"
          :openNames="openNames"
          :menuList="menuList"
          @onSelectMenu="onSelectMenu"
          ref="siderRef"
        ></hl-sider>
        <Layout :style="{ padding: '0 12px 24px' }">
          <!-- 面包屑导航 -->
          <Breadcrumb :style="{ margin: '12px 0' }">
            <BreadcrumbItem v-for="item in breadcrumbList" :key="item">
              {{ item }}
            </BreadcrumbItem>
          </Breadcrumb>
          <!-- 路由占位符 -->
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </Layout>
      </Layout>
    </Layout>
    <!-- 修改密码 -->
    <Modal
      v-model="updatePsModal"
      title="修改密码"
      @on-cancel="updatePsCancel('formValidate')"
    >
      <Form
        ref="formValidate"
        :model="formValidate"
        :rules="ruleValidate"
        :label-width="80"
      >
        <FormItem label="旧密码" prop="oldPs">
          <Input v-model="formValidate.oldPs" placeholder="旧密码" />
        </FormItem>
        <FormItem label="新密码" prop="newPs">
          <Input v-model="formValidate.newPs" placeholder="新密码" />
        </FormItem>
        <FormItem label="新密码" prop="newPsAgain">
          <Input v-model="formValidate.newPsAgain" placeholder="确认新密码" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="updatePsCancel('formValidate')">取消</Button>
        <Button type="primary" @click="updatePsOk('formValidate')">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { usersUpdatePs } from '@/api/user'
import hlHeader from './hl-Header.vue'
import hlSider from './hl-Siders.vue'
export default {
  name: 'Home',
  components: {
    hlHeader,
    hlSider,
  },
  data() {
    return {
      // menuList: [
      //   {
      //     id: 1,
      //     title: "首页",
      //     path: "welcome",
      //     icon: "md-home",
      //   },
      //   {
      //     id: 2,
      //     title: "用户管理",
      //     path: "users",
      //     icon: "md-basket",
      //   },
      //   {
      //     id: 6,
      //     title: "权限管理",
      //     icon: "md-basket",
      //     children: [
      //       { id: 61, path: "roles", title: "角色列表", icon: "md-more" },
      //       { id: 62, path: "permits", title: "权限列表", icon: "md-more" }
      //     ],
      //   },
      //   {
      //     id: 3,
      //     title: "商品管理",
      //     path: "goods",
      //     icon: "md-basket",
      //   },
      //   {
      //     id: 4,
      //     title: "国际化管理",
      //     path: "lang",
      //     icon: "md-basket",
      //   },
      //   {
      //     id: 5,
      //     title: "其他管理",
      //     icon: "md-more",
      //     children: [{ id: 51, path: "other", title: "其他", icon: "md-more" }],
      //   },
      // ],
      menuList: [],
      activeName: 'welcome',
      isCollapsed: false,
      updatePsModal: false,
      formValidate: {
        oldPs: '',
        newPs: '',
        newPsAgain: '',
      },
      ruleValidate: {
        oldPs: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        newPs: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        newPsAgain: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value !== this.formValidate.newPs) {
                callback(new Error('确认密码和新密码不一致'))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],
      },
      loading: true,
      openNames: [],
      breadcrumbList: [],
    }
  },

  methods: {
    getMenus() {
      const menus = this.$store.getters.menus
      this.menuList = JSON.parse(menus)
      // console.log(this.menuList)
      // {fid: 0
      // id: 1
      // level: 0
      // mark: "权限管理"
      // name: "权限管理"
      // path: "permits"
      // _showChildren: true}
    },
    // 获取当前选中菜单，二级菜单展开
    getActive() {
      this.activeName = this.$route.name
      const path = this.$route.path
      // console.log(path)
      const pathList = path.split('/')
      // console.log(pathList)
      this.openNames = [pathList[1]]
    },
    onSelectMenu(val) {
      if (this.$route.name === val) return
      this.$router.push({ name: val })
      this.activeName = val
      this.breadcrumbChange()
    },
    collapsedSider() {
      this.$refs.siderRef.toggleCollapse()
      this.isCollapsed = !this.isCollapsed
    },
    downMenuClick(val) {
      if (val === 'logOut') {
        this.$router.push({ name: 'login' }, () => {
          this.$Message.success('退出成功')
          this.$store.commit('removeToken')
        })
      } else if (val === 'updatePs') {
        this.updatePsModal = true
      }
    },
    updatePsOk(name) {
      this.$refs[name].validate((valid) => {
        if (!valid) return
        usersUpdatePs(this.formValidate)
          .then((res) => {
            if (res.data.code === 200) {
              this.$Message.success('密码修改成功')
              setTimeout(() => {
                this.$router.push({ name: 'login' }, () => {
                  this.$store.commit('removeToken')
                })
              }, 1000)
            } else {
              this.$Message.error(res.data.msg)
            }
          })
          .catch((err) => {
            this.$Message.error(err)
          })
      })
    },
    updatePsCancel(name) {
      this.formValidate = {
        oldPs: '',
        newPs: '',
        newPsAgain: '',
      }
      this.$refs[name].resetFields()
      this.updatePsModal = false
    },
    breadcrumbChange() {
      setTimeout(() => {
        const path = this.$route.path
        const pathList = path.split('/')
        pathList.shift()
        this.breadcrumbList = this.getBreadcrumbList(pathList, this.menuList)
      }, 100)
    },
    getBreadcrumbList(pathList, list) {
      let arr = []
      let ls = list
      // console.log("ls",ls)
      // console.log("pathList",pathList)
      pathList.map((child) => {
        if (child==='welcome'){
          arr.push('welcome')
        }else {
          const level = ls.find((item) => item.path === child)
          arr.push(level.name)
          ls = level.children
        }
      })
      return arr
    },
  },
  created() {
    this.getMenus()
    this.getActive()
    this.breadcrumbChange()
  },
}
</script>
<style lang="less">
#Home {
  height: 100%;
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  .ivu-layout {
    height: 100%;
    .ivu-layout-header {
      padding: 0;
      .log_out {
        margin: 0px 20px;
        color: #fff;
        float: right;
        cursor: pointer;
        .ivu-icon {
          vertical-align: middle;
        }
      }
    }
    .ivu-layout-content {
      height: 100%;
      padding: 24px;
      background-color: #fff;
    }
    .ivu-layout-sider {
      background: #515a6e !important;
    }
  }
  .layout-logo {
    font-size: 20px;
    text-align: center;
    width: 200px;
    height: 100%;
    color: #fff;
    background: #5b6270;
    border-radius: 3px;
    float: left;
  }
  .layout-nav {
    width: 420px;
    margin: 0 auto;
    /* margin-right: 20px; */
  }
}
</style>
