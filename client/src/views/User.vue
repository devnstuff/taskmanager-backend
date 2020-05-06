<template>
  <div class="user-wrapper">
    <div class="top">
      <h4>Personal Information</h4>
    </div>
    <div v-if="user" class="user-wrapper">
      <div class="row">
        <span class="row-name">User name</span>
        <span>{{ user.name }}</span>
      </div>
      <div class="row">
        <span class="row-name">User email</span>
        <span>{{ user.email }}</span>
      </div>
      <div v-if="projects" class="row">
        <span class="row-name">Active projects</span>
        <span>{{ projects.length }}</span>
      </div>
      <div v-if="projects" class="row">
        <span class="row-name">Archived projects</span>
        <span>{{ archivedProjects.length }}</span>
      </div>
      <div v-if="activeTasks" class="row">
        <span class="row-name">Active tasks</span>
        <span>{{ activeTasks.length }}</span>
      </div>
      <div v-if="completedTasks" class="row">
        <span class="row-name">Total completed tasks</span>
        <span>{{ completedTasks.length }}</span>
      </div>
    </div>
    <div v-if="archivedProjects.length > 0" class="archived-projects">
      <h4>Archived projects</h4>
      <div class="projects">
        <div class="project" v-for="(project, index) in archivedProjects" :key="index">
          <div class="project-left">{{ project.name }}</div>
          <div class="actions">
            <a @click="restoreProject(project._id)">Restore</a>
            <a @click="deleteProject(project._id)">Delete</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "User",
  data() {
    return {};
  },
  mounted: function() {
    this.$store.dispatch("profile/getProjects");
  },
  computed: {
    ...mapGetters("profile", [
      "projects",
      "archivedProjects",
      "activeTasks",
      "completedTasks"
    ]),
    user() {
      return this.$store.getters.user;
    }
  },
  methods: {
    ...mapActions("profile", ["restoreProject", "deleteProject"])
  }
};
</script>

<style lang="scss">
.user-wrapper {
  width: 100%;

  .user-wrapper {
    margin: 60px auto 30px auto;
    padding: 20px 30px;
    width: 100%;
    background: #fafafa;
    border-radius: 4px;
    box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2);

    .row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0px;
      }

      span {
        font-size: 13px;

        &.row-name {
          font-weight: 600;
        }
      }
    }
  }
  .archived-projects {
    margin-top: 60px;
    .projects {
      margin: 30px 0;
      .project {
        font-size: 13px;
        margin-bottom: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        padding: 14px;
        border-radius: 5px;
        background-color: #fafafa;
        transition: all 200ms ease-in-out;

        &:hover {
          box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2);
        }

        &:last-child {
          margin-bottom: 0px;
        }
        .actions {
          a {
            margin-right: 9px;
            padding: 4px 10px;
            border-radius: 4px;
            color: #666;

            &:last-child {
              margin-right: 0px;
            }

            &:hover {
              background: rgb(0, 176, 155);
              color: #ffffff;
            }
          }
        }
      }
    }
  }
}
</style>