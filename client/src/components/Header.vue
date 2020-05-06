<template>
  <v-system-bar dark window fixed>
    <ul v-if="token === null || token === undefined" class="menu">
      <a v-for="(item, index) in menuItems" :key="index">
        <router-link :to="item.link" tag="span">{{item.title}}</router-link>
      </a>
    </ul>
    <div v-if="token" class="user-toolbar" v-resize="onResize">
      <ul v-if="window <= 900 && token" class="menu">
        <a v-for="(item, index) in authMenu" :key="index">
          <router-link :to="item.link" tag="span">{{item.title}}</router-link>
        </a>
      </ul>
      <span v-if="user && window >= 900">
        {{ user.name }}, wellcome to your task manager.
        <h5 v-if="activeTasks.length > 0">Active tasks: {{ activeTasks.length }}</h5>
      </span>
      <span @click="logout" class="mdi mdi-logout" />
    </div>
  </v-system-bar>
</template>

<script>
import Sidebar from "@/components/Sidebar";
import { mapGetters } from "vuex";

export default {
  name: "Navbar",
  components: {
    Sidebar
  },
  data() {
    return {
      showModal: false,
      menuItems: [
        {
          title: "Signin",
          link: "/signin"
        },
        {
          title: "Signup",
          link: "/signup"
        }
      ],
      authMenu: [
        {
          title: "Today",
          link: "/today"
        },
        {
          title: "User",
          link: "/user"
        }
      ],
      window: 0
    };
  },
  mounted() {
    this.onResize();
  },
  methods: {
    onResize() {
      this.window = window.innerWidth;
    },
    logout() {
      this.$store.dispatch("signout");
      this.$router.push({ name: "Signin" });
    }
  },
  computed: {
    ...mapGetters("profile", ["activeTasks"]),
    token() {
      return this.$store.getters.token;
    },
    user() {
      return this.$store.getters.user;
    }
  }
};
</script>

<style lang="scss">
$accent: linear-gradient(270deg, rgb(150, 201, 61), rgb(0, 176, 155));
$white: rgb(225, 225, 225);

.v-system-bar {
  background-image: $accent;
  height: 44px !important;
  width: 100vw;
  display: flex;
  justify-content: space-evenly;
  position: relative;
  z-index: 500000 !important;

  .mdi {
    font-size: 18px;
    cursor: pointer;

    &.first {
      margin-left: 10px;
    }

    &.last {
      margin-right: 10px;
    }
  }

  .menu {
    list-style-type: none;
    display: flex;
    justify-content: center;

    a {
      margin-right: 35px;
      color: $white;

      &:last-child {
        margin-right: 0px;
      }

      span {
        &.router-link-exact-active {
          text-decoration: underline $white;
        }
      }
    }
  }
  .header-holder {
    width: 922px;
  }
  .user-toolbar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 100%;
    width: 100%;

    span {
      padding: 1px 3px;
      border-radius: 3px;

      &:last-child {
        margin-right: 0px;
        padding: 0px;
      }

      &.mdi-logout {
        font-size: 18px;

        .logout {
          font-size: 13px;
        }
      }
    }

    .menu {
      span {
        margin-right: 25px;
        border-radius: 3px;

        &:last-child {
          margin-right: 0px;
        }
      }
    }
  }
}
</style>