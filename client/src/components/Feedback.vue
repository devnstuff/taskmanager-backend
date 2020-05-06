<template>
  <div
    class="text-center"
    v-if="feedback !== null && feedback !== undefined && feedback.length > 0"
  >
    <div class="snackbar" v-for="item in feedback" :key="item.id">
      <i
        :class="[
          item.type == 'fail'
            ? 'fas fa-exclamation'
            : 'fas fa-check'
        ]"
      />
      <span>{{ item.msg }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Feedback",
  computed: {
    feedback() {
      return this.$store.getters["feedback/feedback"];
    }
  }
};
</script>

<style lang="scss" scoped>
.text-center {
  z-index: 2000000;
  display: flex;
  justify-content: center;

  .snackbar {
    position: fixed;
    width: 340px;
    height: 44px;
    bottom: 40px;
    background-color: #3f5963;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    color: white;

    i {
      margin-right: 20px;

      &.fa-check {
        color: rgb(150, 201, 61);
      }

      &.fa-exclamation {
        color: #e44232;
      }
    }
    span {
      font-size: 14px;
    }
  }
}
</style>