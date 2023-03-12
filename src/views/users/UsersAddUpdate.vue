<template>
  <Modal v-model="open" :title="title">
    <Form
        ref="formItem"
        :model="formItem"
        :label-width="80"
        :rules="ruleValidate"
    >
      <FormItem label="账号" prop="us">
        <Input v-model="formItem.us" placeholder="请输入账号" clearable/>
      </FormItem>
      <FormItem label="密码" prop="ps">
        <Input
            v-model="formItem.ps"
            type="password"
            placeholder="请输入密码"
            clearable
        />
      </FormItem>
      <FormItem label="性别">
        <RadioGroup v-model="formItem.sex">
          <Radio :label="1">男</Radio>
          <Radio :label="0">女</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="年龄" prop="age">
        <InputNumber :max="120" :min="1" v-model="formItem.age"></InputNumber>
      </FormItem>
      <FormItem label="状态">
        <i-switch v-model="formItem.state" :true-value="1" :false-value="0"/>
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
import {usersAdd} from '@/api/user'

export default {
  name: 'UsersAddUpdate',
  data() {
    return {
      formItem: {
        us: '',
        ps: '',
        sex: 1,
        age: 1,
        state: 1,
      },
      ruleValidate: {
        us: [{required: true, message: '请输入账号', trigger: 'blur'}],
        ps: [{required: true, message: '请输入密码', trigger: 'blur'}],
      },
      open: false,
      title: '用户添加',
      loading: false,
    }
  },
  methods: {
    init() {
      this.title = '用户添加'
      this.open = true
    },
    ok(name) {
      this.$refs[name].validate((valid) => {
        if (!valid) return
        this.loading = true
        const postData = JSON.parse(JSON.stringify(this.formItem))
        usersAdd(postData)
            .then((res) => {
              this.loading = false
              if (res.data.code === 200) {
                this.$Message.success('用户添加成功')
                this.cancel('formItem')
                this.$emit('reload')
              } else {
                this.$Message.error(res.data.msg)
              }
            })
            .catch((err) => {
              this.loading = false
              this.$Message.error(err)
            })
      })
    },
    cancel(name) {
      this.formItem = {
        us: '',
        ps: '',
        sex: 1,
        state: 1,
      }
      this.$refs[name].resetFields()
      this.open = false
    },
  },
  mounted() {
  },
}
</script>
