<template>
  <div class="content" v-resize="onResize">
    <transition name="slide-fade">
      <div v-if="window >= 900" class="sidebar flex-column">
        <Sidebar />
      </div>
    </transition>

    <div :class="[ window <=900 ? 'editor center' : 'editor']">
      <div class="editor-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar";

export default {
  name: "Dashboard",
  components: {
    Sidebar
  },
  data() {
    return {
      window: 0
    };
  },
  mounted() {
    this.onResize();
  },
  methods: {
    onResize() {
      this.window = window.innerWidth;
    }
  }
};
</script>

<style lang="scss">
.content {
  .sidebar {
    position: fixed;
    left: 0;
    overflow: hidden;
    z-index: 200;
    background-color: #fafafa;
    border-right: 1px solid #f1f1f1;
    user-select: none;
    visibility: visible;

    &.hidden {
      visibility: hidden;
    }
  }
  .editor {
    display: flex;
    justify-content: center;
    background-color: #ffffff;
    border-right: 1px solid #f1f1f1;
    margin-left: 305px;
    min-height: 100vh;
    width: 100%;

    &.center {
      margin-left: 0px;
    }

    .editor-content {
      vertical-align: top;
      display: flex;
      padding: 80px 55px;
      height: 100vh;
      width: 100%;
      max-width: 1000px;
    }
  }
  .slide-fade-enter-active {
    transition: all 0.3s ease;
  }
  .slide-fade-leave-active {
    transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
  }
  .slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateX(-305px);
    opacity: 0;
  }
}
</style>