<template>
  <el-form ref="ytForm" :model="ytForm" label-width="80px">
    <el-form-item label="云台速度">
      <el-select v-model="iPTZSpeed">
        <el-option
          v-for="item in ytSpeed"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      ytForm: {
      },
      iPTZSpeed: 4,
      ytSpeed: [
        {
          value: 1,
          label: 1
        }, {
          value: 2,
          label: 2
        }, {
          value: 3,
          label: 3
        }, {
          value: 4,
          label: 4
        }, {
          value: 5,
          label: 5
        }, {
          value: 6,
          label: 6
        }, {
          value: 7,
          label: 7
        }
      ]
    }
  }
}
</script>

<style>

</style>
