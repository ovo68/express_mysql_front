<template>
  <Modal v-model="open" :title="title">
    <Form
        ref="formItem"
        :model="formItem"
        :label-width="120"
        :rules="ruleValidate"
    >
      <FormItem label="商品类型名称" prop="name">
        <Input v-model="formItem.name" placeholder="请输入商品类型名称" clearable/>
      </FormItem>
    </Form>
    <div slot="footer" style="text-align: center">
      <Button @click="cancel('formItem')">关闭</Button>
      <Button type="primary" :loading="loading" @click="ok('formItem')">
        提交
      </Button>
    </div>
  </Modal>
</template>
<script>

import {goodstypeUpdate, goodstypeAdd, goodsTypePage} from '@/api/goodstype'

export default {
  name: 'Goods',
  data() {
    return {
      formItem: {
        name: '',
      },
      ruleValidate: {
        name: [{required: true, message: '请输入商品类型名称', trigger: 'blur'}],
      },
      typeList: [{id: 2, name: '凉菜1'}],
      open: false,
      title: '商品类型修改',
      loading: false,
      imgUrl: '',
    }
  },
  methods: {
    init(params) {
      this.getTypeList()
      if (params) {
        this.title = '商品类型修改'
        this.formItem = JSON.parse(JSON.stringify(params))
        this.imgUrl = process.env.VUE_APP_BASEURL + params.img
      } else {
        this.title = '商品类型添加'
      }
      this.open = true
    },
    getTypeList() {
      goodsTypePage()
          .then((res) => {
            if (res.data.code === 200) {
              this.typeList = res.data.data
            } else {
              this.$Message.error(res.data.msg)
            }
          })
          .catch((err) => {
            this.$Message.error(err)
          })
    },
    ok(name) {
      this.$refs[name].validate((valid) => {
        if (!valid) return
        if (this.formItem.id) {
          goodstypeUpdate(this.formItem)
              .then((res) => {
                if (res.data.code === 200) {
                  this.$Message.success('商品类型修改成功')
                  this.cancel('formItem')
                  this.$emit('reload')
                } else {
                  this.$Message.error(res.data.msg)
                }
              })
              .catch((err) => {
                this.$Message.error(err)
              })
        } else {
          goodstypeAdd(this.formItem)
              .then((res) => {
                if (res.data.code === 200) {
                  this.$Message.success('商品类型添加成功')
                  this.cancel('formItem')
                  this.$emit('reload')
                } else {
                  this.$Message.error(res.data.msg)
                }
              })
              .catch((err) => {
                this.$Message.error(err)
              })
        }
      })
    },
    cancel(name) {
      this.formItem = {
        name: '',
      }
      this.$refs[name].resetFields()
      this.open = false
    }
  },
  mounted() {
  },
}
</script>
<style lang="less" scoped>
.uploadImgUrl {
  width: 50px;
  height: 50px;
}
</style>
