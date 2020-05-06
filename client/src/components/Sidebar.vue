<template>
  <div class="sidebar-content">
    <ul>
      <router-link to="/today" tag="span">
        <i class="far fa-calendar-alt" />
        Today
      </router-link>
      <router-link v-if="user" to="/user" tag="span">
        <i class="fas fa-user" />
        {{ user.email }}
      </router-link>
    </ul>
    <div class="expansion_panel">
      <div class="top">
        <button @click="isProjects = !isProjects">
          <i :class="[isProjects === true > 0 ? 'fas fa-chevron-down' : 'fas fa-chevron-right']" />
          <span>Projects</span>
        </button>
      </div>
      <transition name="slide">
        <div v-if="isProjects" class="collapse">
          <div class="collapse_wrapper">
            <div class="collapse__wrapper_inner">
              <ul class="list">
                <span v-for="(project, index) in projects" :key="index">
                  <router-link :to="`/project/${project._id}`">
                    <div class="color" :style="{ background: project.color }"></div>
                    <a v-if="project.name.length > 30">{{project.name.slice(0, 24)}}...</a>
                    <a v-else>{{ project.name }}</a>
                  </router-link>
                </span>
                <span>
                  <router-link to="/add-project">
                    <div class="add">
                      <span class="mdi mdi-plus" />
                      Add project
                    </div>
                  </router-link>
                </span>
              </ul>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: "Comments",
  data() {
    dialog: false;
  }
};
</script>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Sidebar",
  data() {
    return {
      isProjects: true
    };
  },
  computed: {
    ...mapGetters("profile", ["projects", "archivedProjects"]),
    user() {
      return this.$store.getters.user;
    }
  }
};
</script>

<style lang="scss">
@mixin span {
  font-size: 14px;
  cursor: pointer;
  display: flex;
  border-radius: 3px;
  align-items: center;
  padding: 5px 16px 5px 5px;
  height: 35px;

  &:hover {
    background-color: #ffffff;
  }
}
.sidebar-content {
  width: 305px;
  padding: 30px 0 20px 50px;

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;

    span {
      @include span;

      &.router-link-exact-active {
        background-color: #ffffff;
      }

      a {
        color: #333;
      }

      i {
        margin-right: 12px;

        &.fa-user {
          color: #246fe0;
        }
        &.fa-calendar-alt {
          color: #058527;
        }
        &.fa-calendar-week {
          color: #692fc1;
        }
      }
      .index {
        color: #666;
        margin-left: 6px;
        font-size: 10px;
      }

      .v-badge__badge {
        margin-left: 10px;
      }

      &:last-child {
        margin-bottom: 0px;
      }

      .v-treeview-node__root {
        padding-left: 0px;
        padding-right: 0px;
        min-height: 30px;
      }
    }
  }
  .expansion_panel {
    margin-top: 30px;
    border-bottom: 1px solid #f1f1f1;

    .top {
      position: relative;
      display: flex;
      font-size: 13px;
      line-height: 1em;
      cursor: pointer;
      justify-content: space-between;
      align-items: center;

      button {
        display: flex;
        text-align: left;
        align-items: center;
        width: 100px;
        height: 25px;
        color: #333;
        position: relative;

        i {
          position: absolute;
        }

        span {
          margin-left: 30px;
        }

        &:focus {
          outline: none;
        }
      }
    }
    .collapse {
      margin-top: 10px;
      overflow: scroll;

      .collapse_wrapper {
        display: flex;

        .collapse__wrapper_inner {
          width: 100%;

          .list {
            user-select: none;

            span {
              @include span;

              a {
                display: flex;
                width: 100%;
                align-items: center;
                text-decoration: none;

                .color {
                  height: 14px;
                  width: 14px;
                  margin-right: 12px;
                  border-radius: 50%;
                }
              }
              .add {
                display: flex;
                align-items: center;

                span {
                  color: #db4c3f;
                  padding: 0px;
                  margin: 0px 12px 0px 0px;

                  &::before {
                    font-size: 18px;
                  }
                }

                &:hover {
                  color: #db4c3f;
                }
              }

              &:last-child {
                margin-top: 15px;
              }
            }
          }
        }
      }
    }
  }
}
.slide-enter-active {
  transition: all 0.3s ease;
}
.slide-leave-active {
  transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-enter,
.slide-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
