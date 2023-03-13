<template>
  <Content class="ordersBox">
    <Row>
      <Col span="11">
        <Card>
          <Form ref="formItem" :model="goodsChecked" inline :rules="ruleValidate">
            <FormItem label="商品" :label-width="60" prop="goodsName">
              <Select v-model="goodsChecked.goodsName" clearable style="width: 200px">
                <Option v-for="item in goodsList" :key="item.id" :value="item.name">
                  {{ item.name }}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="数量" :label-width="80">
              <InputNumber :min="1" v-model="goodsChecked.goodsNumber"></InputNumber>
            </FormItem>
            <FormItem :label-width="20">
              <Button type="primary" @click="addGoodsToOrder('formItem')">添加</Button>
            </FormItem>
          </Form>
        </Card>
      </Col>
      <Col span="11" offset="2">
        <Card style="height: 300px">
<!--          <Table border :columns="columns" :data="orderDetail" :height="tablesHeight"></Table>-->
          <Table border :columns="columns" :data="orderDetail" height="200"></Table>
          <Button type="primary" style="width: 100%;margin-top: 8px;" @click="addOrder">增加订单
          </Button>
        </Card>
      </Col>
    </Row>

    <div style="height: 32px"></div>
    <Divider/>
    <Table
        :columns="columns2"
        :data="orderList"
        border
    ></Table>
    <Page
        class="table_page_css"
        v-show="total"
        :total="total"
        :current="searchInfo.pageNo"
        :page-size="searchInfo.pageSize"
        :page-size-opts="pageSizeOpts"
        @on-change="pageNoChange"
        @on-page-size-change="pageSizeChange"
        show-sizer
        show-elevator
        show-total
    />

  </Content>
</template>
<script>
import {goodsAll} from '@/api/goods'
import {orderAdd, orderDetail, orderPage} from '@/api/order'

export default {
  name: 'Orders',
  data() {
    return {
      tablesHeight: 0,
      split: 0.5,
      goodsList: [],
      orderList: [],
      goodsChecked: {
        goodsName: '',
        goodsNumber: 1,
        goodsPrice: 0,
        totalPrice: 0,
      },
      orderDetail: [],
      ruleValidate: {
        goodsName: [{required: true, message: '请选择商品', trigger: 'blur'}]
      },
      columns: [
        {
          title: '商品',
          key: 'goodsName',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'person'
                }
              }),
              h('strong', params.row.goodsName)
            ]);
          }
        },
        {
          title: '数量',
          key: 'goodsNumber'
        },
        {
          title: '单价',
          key: 'goodsPrice'
        },
        {
          title: '总额',
          key: 'totalPrice'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            if (params.row.id) {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                    disabled: true
                  },
                  on: {
                    click: () => {
                      // console.log(params)
                      this.remove(params.row.goodsName)
                    }
                  }
                }, '删除')
              ]);
            }
            return h('div', [
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    // console.log(params)
                    this.remove(params.row.goodsName)
                  }
                }
              }, '删除')
            ]);
          }
        }
      ],
      columns2: [
        {
          title: '操作人',
          key: 'us'
        },
        {
          title: '订单总额',
          key: 'amount'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small'
                },
                on: {
                  click: () => {
                    // console.log(params)
                    this.show(params.row.id)
                  }
                }
              }, '查看')
            ]);
          }
        }
      ],
      total: 0,
      searchInfo: {
        pageNo: 1,
        pageSize: 5,
      },
      pageSizeOpts: [1, 2, 5, 10],
    }
  },
  methods: {
    setTablesHeight() {
      let aH = 0
      let oA = document.getElementById('app')
      let oH = oA.clientHeight || oA.offsetHeight
      let sA = document.getElementById('formItem')
      let sH = sA.clientHeight || sA.offsetHeight
      aH = oH - sH - 265
      this.tablesHeight = aH
    },
    show(id) {
      orderDetail({id})
          .then((res) => {
            if (res.data.code === 200) {
              this.resetOrderDetail()
              const data = res.data
              this.orderDetail = data.data
            } else {
              this.$Message.error(res.data.msg)
            }
          })
          .catch((err) => {
            this.$Message.error(err)
          })
    },
    pageNoChange(current) {
      this.searchInfo.pageNo = current
      this.getOrderList()
    },
    pageSizeChange(val) {
      this.searchInfo.pageNo = 1
      this.searchInfo.pageSize = val
      this.getOrderList()
    },
    resetOrderDetail() {
      this.orderDetail = []
    },
    addOrder() {
      // console.log("####")
      if (this.orderDetail.length === 0) {
        this.$Message.error('订单为空！')
      } else if (this.orderDetail.length > 0 && this.orderDetail[0].id) {
        this.$Message.error('不能增加已有的订单！')
      } else {
        // 增加订单
        orderAdd(this.orderDetail)
            .then((res) => {
              if (res.data.code === 200) {
                this.$Message.success('增加成功')
                this.resetOrderDetail()
                this.getOrderList()
              } else {
                this.$Message.error(res.data.msg)
              }
            })
            .catch((err) => {
              this.$Message.error(err)
            })
      }
    },
    remove(name) {
      console.log(name)
      this.orderDetail = this.orderDetail.filter(d => d.goodsName !== name)
    },
    addGoodsToOrder(name) {
      this.$refs[name].validate((valid) => {
        if (!valid) return
        if (this.orderDetail.length > 0) {
          if (this.orderDetail[0].id)
            this.resetOrderDetail()
        }
        if (this.orderDetail.filter(d => d.goodsName === this.goodsChecked.goodsName).length > 0) {
          this.$Message.error('请勿重复添加商品')
          this.goodsChecked = {
            goodsName: '',
            goodsNumber: 1,
            goodsPrice: 0,
            totalPrice: 0,
          }
        } else {
          this.goodsChecked.goodsPrice = this.goodsList.filter(goods => goods.name === this.goodsChecked.goodsName)[0].price
          this.goodsChecked.totalPrice = this.goodsChecked.goodsPrice * this.goodsChecked.goodsNumber
          this.orderDetail.push(this.goodsChecked)
          this.goodsChecked = {
            goodsName: '',
            goodsNumber: 1,
            goodsPrice: 0,
            totalPrice: 0,
          }
        }


      })
    },
    getGoodsList() {
      goodsAll()
          .then((res) => {
            if (res.data.code === 200) {
              const data = res.data
              this.goodsList = data.data
            } else {
              this.$Message.error(res.data.msg)
            }
          })
          .catch((err) => {
            this.$Message.error(err)
          })
    },
    getOrderList() {
      orderPage(this.searchInfo)
          .then((res) => {
            if (res.data.code === 200) {
              const data = res.data
              this.orderList = data.data
              this.total = data.total
            } else {
              this.$Message.error(res.data.msg)
            }
          })
          .catch((err) => {
            this.$Message.error(err)
          })
    }
  },
  created() {

  },
  mounted() {
    this.getGoodsList()
    this.getOrderList()
    // setTimeout(() => {
    //   this.setTablesHeight()
    // }, 50)
    // window.onresize = () => {
    //   this.setTablesHeight()
    // }
  },
}
</script>
<style lang="less" scoped>
//.ordersBox {
//  .ivu-form-inline .ivu-form-item {
//    width: 267px;
//  }
//}
</style>

