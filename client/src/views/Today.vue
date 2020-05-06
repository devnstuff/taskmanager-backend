<template>
  <div class="today-wrapper">
    <div class="today">
      <div class="data-wrapper">
        <h3>Today</h3>
        <span class="date">{{ date }}</span>
      </div>
      <div class="tooltip">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <span class="mdi mdi-help-circle-outline" v-on="on" />
          </template>
          <span>Double click on a task to complete it</span>
        </v-tooltip>
      </div>
    </div>
    <div v-if="projects.length > 0">
      <div v-if="todayTasks.length > 0" class="tasks">
        <div
          v-for="(task, index) in todayTasks"
          :key="index"
          @dblclick="handleComplete(task.project_id, task._id, false)"
          class="task"
        >
          <div class="task-left" :style="{ color: task.priority_color }">{{ task.body }}</div>
          <div class="project">
            <div class="color" :style="{ background: task.project_color }"></div>
            {{ task.project_name }}
          </div>
        </div>
      </div>
      <div v-if="!isAddOpen" class="add" @click="isAddOpen = !isAddOpen">
        <span class="mdi mdi-plus" />
        Add task
      </div>
      <div v-else class="form">
        <div class="form-inputs">
          <v-text-field
            class="input"
            v-model="taskName"
            outlined
            dense
            placeholder="e.g. Buy gift tomorrow at 5pm"
          />
          <div class="schedule">
            <v-menu
              min-width="220"
              transition="slide-y-transition"
              open-delay="300"
              :open-on-hover="openOnHover"
            >
              <template v-slot:activator="{on}">
                <span class="mdi mdi-format-list-bulleted" v-on="on" />
              </template>
              <ul class="project-picker">
                <li
                  v-for="(project, index) in projects"
                  :key="index"
                  @click="setProject({id: project._id, name: project.name, color: project.color})"
                >
                  <span class="color" :style="{background: project.color}"></span>
                  {{ project.name }}
                </li>
              </ul>
            </v-menu>
            <v-menu
              min-width="220"
              transition="slide-y-transition"
              open-delay="300"
              :open-on-hover="openOnHover"
            >
              <template v-slot:activator="{on}">
                <span class="mdi mdi-flag-variant-outline" v-on="on" />
              </template>
              <ul class="priority-picker">
                <li
                  v-for="(priority, index) in priorities"
                  :key="index"
                  @click="setPriority({name: priority.name, color:priority.color})"
                >
                  <span class="mdi mdi-flag-variant-outline" :style="{ color: priority.color }" />
                  {{ priority.name }}
                </li>
              </ul>
            </v-menu>
          </div>
        </div>
        <div class="buttons">
          <v-btn class="add" :disabled="!taskName" small @click="handleCreateTask">Add task</v-btn>
          <v-btn class="cancel" small @click="isAddOpen = false">Cancel</v-btn>
        </div>
      </div>
    </div>
    <div v-else>You need to have at least one project to add a task</div>
    <div v-if="todayTasks.length === 0" class="empty-holder">
      <img width="300" :src="imgSRC" :alt="attribution" />
      <h5>You're all done for today! #Relax</h5>
      <p>Enjoy your day off.</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { formatDate } from "../utils/format";

export default {
  name: "Inbox",
  data() {
    return {
      isAddOpen: false,
      openOnHover: true,
      taskName: "",
      project: null,
      priority: {
        name: "Priority 1",
        color: "rgb(209, 69, 59)"
      },
      date: formatDate(new Date().toISOString().substr(0, 10)),
      priorities: [
        { name: "Priority 1", color: "rgb(209, 69, 59)" },
        { name: "Priority 2", color: "rgb(235, 137, 9)" },
        { name: "Priority 3", color: "rgb(36, 111, 224)" },
        { name: "Priority 4", color: "rgb(0, 0, 0)" }
      ],
      imgSRC:
        "https://firebasestorage.googleapis.com/v0/b/vue-calendar-f0e17.appspot.com/o/1.svg?alt=media&token=235b833a-44fe-44ae-b9dd-027a0aa01591",
      attribution: "https://www.freepik.com/free-photos-vectors/home"
    };
  },
  mounted: function() {
    this.$store.dispatch("profile/getAllTasks");
  },
  computed: mapGetters("profile", ["projects", "todayTasks"]),

  methods: {
    ...mapActions("profile", [
      "createTask",
      "completeTask",
      "erchiveProject",
      "getAllTasks"
    ]),
    ...mapActions("feedback", ["setFeedback"]),
    setProject(project) {
      this.project = {
        id: project.id,
        name: project.name,
        color: project.color
      };
    },
    setPriority(priority) {
      this.priority = priority;
    },
    handleCreateTask() {
      if (this.project === null) {
        this.setFeedback({ msg: "Please select a project", type: "fail" });
      } else {
        this.createTask({
          body: this.taskName,
          due: this.date,
          priority: this.priority.name,
          priority_color: this.priority.color,
          id: this.project.id,
          project_name: this.project.name,
          project_color: this.project.color
        });
        this.isAddOpen = false;
        this.taskName = "";
        this.setFeedback({ msg: "Task added", type: "success" });
      }
    },
    handleComplete(id, task, status) {
      this.completeTask({ id: id, task: task, status: status });
      this.setFeedback({
        msg: "Congrats on completing a task!",
        type: "success"
      });
    }
  }
};
</script>

<style lang="scss">
.today-wrapper {
  width: 100%;

  .today {
    display: flex;
    justify-content: space-between;
    margin-bottom: 35px;
    .data-wrapper {
      display: flex;
      align-items: center;
      .date {
        margin-left: 10px;
        font-size: 10px;
        color: #666;
      }
    }

    .tooltip {
      font-size: 18px;
      cursor: pointer;
    }
  }
  font-size: 13px;

  .tasks {
    margin-bottom: 20px;
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

      .task-left {
        display: flex;
        align-items: center;
      }

      .project {
        font-size: 10px;
        display: flex;
        align-items: center;

        .color {
          height: 10px;
          width: 10px;
          border-radius: 50%;
          margin-right: 8px;
        }
      }

      .task-actions {
        visibility: hidden;

        span {
          cursor: pointer;

          &::before {
            font-size: 18px;
          }
        }
      }

      &:hover {
        .task-actions {
          visibility: visible;
        }
      }

      &:last-child {
        margin-bottom: 0px;
      }

      .check {
        margin-right: 12px;
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
          background: #db4c3f !important;
          color: #ffffff;
        }

        &:last-child {
          margin-right: 0px;
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
    h img {
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