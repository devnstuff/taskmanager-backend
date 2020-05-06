<template>
  <div class="add-container">
    <div class="add-project">
      <div class="container-top">
        <h3>Add project</h3>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <span class="mdi mdi-help-circle-outline" v-on="on" />
          </template>
          <span>Projects lets you organize your tasks into separate folders</span>
        </v-tooltip>
      </div>
      <div class="form">
        <v-text-field v-model="name" label="Project name" outlined dense />
        <div class="select" @click="select = !select">
          <span v-if="color" class="color" :style="{ background: color.value }" />
          <span v-if="color">{{ color.name }}</span>
          <span class="input" v-else>Select color:</span>
        </div>
        <div class="select-items" v-if="select">
          <ul>
            <li v-for="color in colors" :key="color.id" @click="grabColor(color.name, color.value)">
              <span class="color" :style="{ background: color.value }" />
              <span>{{ color.name }}</span>
            </li>
          </ul>
        </div>
        <div class="container-bottom">
          <v-btn class="cancel" small @click="redirect">Cancel</v-btn>
          <v-btn class="add" :disabled="!name" small @click="onSubmit">Add</v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      name: "",
      color: { name: "Grey", value: "#666" },
      select: false,
      colors: [
        { id: 1, name: "Berry Red", value: "rgb(184, 37, 95)" },
        { id: 2, name: "Red", value: "rgb(219, 64, 53)" },
        { id: 3, name: "Orange", value: "rgb(255, 153, 51)" },
        { id: 4, name: "Yellow", value: "rgb(250, 208, 0)" },
        { id: 5, name: "Olive Green", value: "rgb(175, 184, 59)" },
        { id: 6, name: "Lime Green", value: "rgb(126, 204, 73)" },
        { id: 7, name: "Green", value: "rgb(41, 148, 56)" },
        { id: 8, name: "Mint Green", value: "rgb(106, 204, 188)" },
        { id: 9, name: "Teal", value: "rgb(21, 143, 173)" },
        { id: 10, name: "Sky Blue", value: "rgb(20, 170, 245)" },
        { id: 11, name: "Light Blue", value: "rgb(150, 195, 235)" },
        { id: 12, name: "Blue", value: "rgb(64, 115, 255)" },
        { id: 13, name: "Grape", value: "rgb(136, 77, 255)" },
        { id: 14, name: "Violet", value: "rgb(175, 56, 235)" },
        { id: 15, name: "Magenta", value: "rgb(224, 81, 148)" },
        { id: 16, name: "Salmon", value: "rgb(255, 141, 133)" }
      ]
    };
  },
  methods: {
    ...mapActions("profile", ["createProject"]),
    ...mapActions("feedback", ["setFeedback"]),
    onSubmit() {
      let payload = {
        name: this.name,
        color: this.color.value
      };
      this.createProject(payload);
      this.setFeedback({ msg: "Project created", type: "success" });
      this.$router.push("today");
    },
    grabColor(name, value) {
      this.select = !this.select;
      this.color = {
        name,
        value
      };
    },
    redirect() {
      this.$router.push("/today");
    }
  }
};
</script>

<style lang="scss">
.add-container {
  width: 100%;
}
.container-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;

  span::before {
    font-size: 18px;
  }
}
.select {
  border: 1px solid rgba(0, 0, 0, 0.34);
  padding: 8px 10px;
  border-radius: 4px;
  text-align: left;
  position: relative;
  display: flex;
  align-items: center;

  .color {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 8px;
  }

  .input {
    color: rgba(0, 0, 0, 0.5);
  }

  &:hover {
    border: 1px solid rgba(0, 0, 0, 8.34);
    cursor: text;
    color: rgba(0, 0, 0, 0.87);

    .input {
      color: rgba(0, 0, 0, 0.87);
    }
  }

  &:focus {
    outline: none;
  }
}
.select-items {
  position: absolute;
  z-index: 200;
  top: 244px;
  background-color: #ffffff;
  width: 385px;
  overflow: scroll;
  height: 260px;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.16);
  box-shadow: 0 24px 16px -15px rgba(0, 0, 0, 0.1),
    0 2px 26px rgba(0, 0, 0, 0.16);

  ul {
    padding: 0px !important;
    list-style-type: none;
    text-align: left;

    li {
      padding: 5px 15px;
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 13px;

      &:hover {
        background-color: #eee;
      }

      .color {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-right: 12px;
      }
    }
  }
}
.container-bottom {
  margin: 40px 0 20px 0;
  button {
    margin: 0px 10px;
    text-transform: none;
    &.add {
      background: #db4c3f !important;
      color: #ffffff;
    }

    &.cancel {
      background: #eee !important;
      color: #666 !important;
    }
  }
}
</style>