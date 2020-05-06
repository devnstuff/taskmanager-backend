<template>
  <div class="project-editor">
    <div class="header">
      <h3 v-if="project" :style="{ color: project.color }">{{ project.name }}</h3>
      <ul class="tools">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <span class="mdi mdi-help-circle-outline" v-on="on" />
          </template>
          <span>Double click on a task to complete it</span>
        </v-tooltip>
        <v-menu transition="slide-y-transition" min-width="250" bottom open-delay="300">
          <template v-slot:activator="{ on }">
            <span class="mdi mdi-dots-horizontal" v-on="on" />
          </template>
          <ul class="action-holder">
            <li @click="showCompleted = !showCompleted">
              <span class="mdi mdi-check-circle-outline" :style="{ color: project.color }" />
              <span v-if="showCompleted">Hide completed tasks</span>
              <span v-else>Show completed tasks</span>
            </li>
            <li @click="showComments = !showComments">
              <span class="mdi mdi-comment-outline" :style="{ color: project.color }" />
              <span v-if="showComments">Hide comments</span>
              <span v-else>Show comments</span>
            </li>
            <li @click="handleArchive">
              <span class="mdi mdi-trash-can-outline" :style="{ color: project.color }" />
              Delete Project
            </li>
          </ul>
        </v-menu>
      </ul>
    </div>
    <div class="project-content">
      <div v-if="tasks.length > 0" class="tasks">
        <div
          v-for="(task, index) in tasks"
          :key="index"
          @dblclick="handleComplete(task._id, false)"
          class="task"
        >
          <div class="task-left" :style="{ color: task.priority_color }">{{ task.body }}</div>
          <span
            class="due"
            :class="[checkDue(task.due) === true ? 'due overdue' : 'due']"
          >Due: {{ formatDate(task.due) }}</span>
        </div>
      </div>
      <div v-if="!isAddOpen" class="add" @click="isAddOpen = !isAddOpen">
        <span class="mdi mdi-plus" />
        Add task
      </div>
      <div v-else class="form">
        <div class="form-inputs">
          <v-text-field
            v-model="taskName"
            class="input"
            outlined
            dense
            placeholder="e.g. Buy gift tomorrow at 5pm"
          />
          <div class="schedule">
            <v-menu
              min-width="220"
              transition="slide-y-transition"
              :open-on-hover="openOnHover"
              open-delay="300"
            >
              <template v-slot:activator="{on}">
                <span class="mdi mdi-flag-variant-outline" v-on="on" />
              </template>
              <ul class="priority-picker">
                <li
                  v-for="(priority, index) in priorities"
                  :key="index"
                  @click="grabPriority({name: priority.name, color:priority.color})"
                >
                  <span class="mdi mdi-flag-variant-outline" :style="{ color: priority.color }" />
                  {{ priority.name }}
                </li>
              </ul>
            </v-menu>
            <v-menu transition="slide-y-transition" :open-on-hover="openOnHover" open-delay="300">
              <template v-slot:activator="{ on }">
                <span class="mdi mdi-clock-outline" v-on="on" />
              </template>
              <v-date-picker v-model="due" no-title :color="project.color" />
            </v-menu>
          </div>
        </div>
        <div class="buttons">
          <v-btn class="add" :disabled="!taskName" small @click="handleCreateTask">Add task</v-btn>
          <v-btn class="cancel" small @click="isAddOpen = false">Cancel</v-btn>
        </div>
      </div>
      <div v-if="showCompleted" class="completed tasks">
        <div v-for="(task, index) in inactiveTasks" :key="index" class="completed-task">
          <span class="mdi mdi-check-circle-outline" />
          {{ task.body }}
        </div>
      </div>
      <div v-if="showComments" class="comment-wrapper">
        <div class="comments">
          <div v-for="(comment, index) in comments" :key="index" class="comment">
            <i class="fas fa-trash-alt" @click="deleteComment({ id: id, comment: comment._id })" />
            {{ comment.body }}
          </div>
        </div>
        <div v-if="!isAddCommentOpen" class="add" @click="isAddCommentOpen = !isAddCommentOpen">
          <span class="mdi mdi-plus" />
          Add comment
        </div>
        <div v-else class="form">
          <v-col cols="12" md="6">
            <v-textarea v-model="comment" solo placeholder="Type your comment" color="black" />
            <div class="buttons">
              <v-btn class="add" :disabled="!comment" small @click="handleCreateComment">Add comment</v-btn>
              <v-btn class="cancel" small @click="isAddCommentOpen = false">Cancel</v-btn>
            </div>
          </v-col>
        </div>
      </div>
    </div>
    <div v-if="tasks.length === 0" class="empty-holder">
      <img width="300" :src="imgURL" :alt="attribution" />
      <h5>Keep your tasks organized in projects</h5>
      <p>Group your tasks by goal or area of your life. Add comments to keep on track.</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { formatDate, overdue } from "../utils/format";

export default {
  name: "Project",
  props: ["id"],
  data() {
    return {
      isOpen: false,
      isAddOpen: false,
      isAddCommentOpen: false,
      openOnHover: true,
      showCompleted: true,
      showComments: true,
      taskName: "",
      isActive: false,
      due: new Date().toISOString().substr(0, 10),
      priority: {
        name: "Priority 1",
        color: "rgb(209, 69, 59)"
      },
      comment: "",
      priorities: [
        { name: "Priority 1", color: "rgb(209, 69, 59)" },
        { name: "Priority 2", color: "rgb(235, 137, 9)" },
        { name: "Priority 3", color: "rgb(36, 111, 224)" },
        { name: "Priority 4", color: "rgb(0, 0, 0)" }
      ],
      imgURL:
        "https://firebasestorage.googleapis.com/v0/b/vue-calendar-f0e17.appspot.com/o/2.svg?alt=media&token=781bcee0-f126-4047-9e16-44798a8699ce",
      attribution: "https://www.freepik.com/free-photos-vectors/design"
    };
  },
  mounted: function() {
    this.$store.dispatch("profile/getProjectById", this.id);
  },
  computed: mapGetters("profile", [
    "project",
    "tasks",
    "inactiveTasks",
    "comments"
  ]),
  watch: {
    $route(to, from) {
      this.$store.dispatch("profile/getProjectById", this.id);
    }
  },
  methods: {
    ...mapActions("profile", [
      "createTask",
      "completeTask",
      "erchiveProject",
      "createComment",
      "deleteComment"
    ]),
    ...mapActions("feedback", ["setFeedback"]),
    handleCreateTask() {
      this.createTask({
        body: this.taskName,
        due: formatDate(this.due),
        priority: this.priority.name,
        priority_color: this.priority.color,
        id: this.id,
        project_name: this.project.name,
        project_color: this.project.color
      });
      this.isAddOpen = false;
      this.taskName = "";
      this.setFeedback({ msg: "Task added", type: "success" });
    },
    checkDue: overdue,
    formatDate: formatDate,
    grabPriority(priority) {
      this.priority = priority;
    },
    handleComplete(task, status) {
      this.completeTask({ id: this.id, task: task, status: status });
      this.setFeedback({
        msg: "Congrats on completing a task!",
        type: "success"
      });
    },
    handleArchive() {
      this.erchiveProject(this.id);
      this.$router.push("/today");
      this.setFeedback({
        msg: "Project deleted",
        type: "success"
      });
    },
    handleCreateComment() {
      this.isAddCommentOpen = false;
      this.createComment({ id: this.id, body: this.comment });
      this.comment = "";
    }
  }
};
</script>

<style lang="scss">
.v-menu__content {
  .action-holder {
    background-color: #ffffff;
    li {
      font-size: 13px;
      padding: 8px 8px 8px 20px;
      display: flex;
      align-items: center;
      cursor: pointer;

      &:hover {
        background-color: #eee;
      }

      span {
        margin-right: 12px;

        &::before {
          font-size: 18px;
        }
      }
    }
  }

  .priority-picker,
  .project-picker {
    background-color: #ffffff;
    li {
      font-size: 13px;
      padding: 8px 8px 8px 20px;
      display: flex;
      align-items: center;
      cursor: pointer;

      &:hover {
        background-color: #eee;
      }

      span {
        margin-right: 12px;

        &::before {
          font-size: 18px;
        }

        &.color {
          height: 14px;
          width: 14px;
          margin-right: 12px;
          border-radius: 50%;
        }
      }
    }
  }
}

.v-application--is-ltr
  .v-textarea.v-text-field--enclosed
  .v-text-field__slot
  textarea {
  font-size: 13px !important;
}

.project-editor {
  width: 100%;

  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 35px;

    .tools {
      text-align: right;
      position: relative;
      z-index: 20000;

      span {
        margin-right: 15px;
        padding: 6px;
        cursor: pointer;

        &.mdi-dots-horizontal {
          margin-right: 0px;
        }

        &::before {
          font-size: 18px;
        }
      }
    }
  }

  .project-content {
    .tasks {
      margin-bottom: 25px;
      font-size: 13px;

      &.completed {
        margin-top: 50px;
      }

      .task {
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

        .due {
          visibility: visible;
        }

        .overdue {
          color: #db4c3f;
        }

        .task-left {
          display: flex;
          align-items: center;
        }

        .due {
          font-size: 10px;
        }

        &:last-child {
          margin-bottom: 0px;
        }

        .check {
          margin-right: 12px;
        }
      }

      .completed-task {
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        cursor: default;
        padding: 14px;
        border-radius: 5px;
        background-color: #fafafa;
        opacity: 0.5;

        .mdi-check-circle-outline {
          margin-right: 12px;

          &::before {
            font-size: 15px;
          }
        }
      }
    }
    .add {
      font-size: 13px;
      display: flex;
      align-items: center;
      cursor: pointer;

      &:hover {
        color: #db4c3f;
      }

      .mdi-plus {
        color: #db4c3f;
        margin-right: 12px;

        &::before {
          font-size: 20px;
        }
      }
    }

    .form {
      width: 100%;
      margin: 0 auto;

      .form-inputs {
        display: flex;
        justify-content: space-between;
        height: 40px;
        position: relative;
        margin-bottom: 15px;

        .schedule {
          position: relative;
          font-size: 13px;
          height: 40px;
          cursor: pointer;

          span {
            &::before {
              font-size: 18px;
              padding: 10px;
              margin: 0 5px;
            }

            &:hover {
              color: #db4c3f;
            }
          }
        }
      }

      .buttons {
        display: flex;

        button {
          margin-right: 20px;
          font-size: 12px;
          text-transform: none;

          &.add {
            background-color: #db4c3f;
            color: #ffffff;
          }

          &:last-child {
            margin-right: 0px;
          }
        }
      }
    }

    .comments {
      margin: 50px 0 25px 0;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
      gap: 20px;

      .comment {
        position: relative;
        padding: 20px;
        overflow-wrap: break-word;
        background: #fafafa;
        font-size: 13px;
        border-radius: 5px;
        transition: all 0.2s ease-in-out;
        cursor: default;

        &:hover {
          box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2);

          .fa-trash-alt {
            visibility: visible;
          }
        }

        .fa-trash-alt {
          position: absolute;
          top: -8px;
          right: -3px;
          cursor: pointer;
          visibility: hidden;
          font-size: 18px;
        }
      }
    }
  }
  .empty-holder {
    display: flex;
    justify-content: center;
    width: 100%;
    align-items: center;
    margin: 9vh auto 80px auto;
    flex-direction: column;

    img {
      margin-bottom: 30px;
    }

    p {
      font-size: 13px;
      color: #777;
      margin: 8px 0 20px 0;
      text-align: center;
    }
    h5 {
      font-size: 14px;
    }
  }
}
</style>