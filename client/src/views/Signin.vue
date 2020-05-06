<template>
  <div class="wrapper">
    <div class="backdrop">
      <div class="container">
        <div class="sign-up">
          <div class="top">
            <h6>Signin in seconds:</h6>
          </div>
          <div class="form">
            <v-text-field v-model="email" label="E-mail" outlined dense color="rgb(130, 189, 112)" />
            <v-text-field
              v-model="password"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              label="Password"
              counter
              outlined
              dense
              color="rgb(130, 189, 112)"
              @click:append="show = !show"
            />
            <div class="additional">
              <p>
                Don't have an account?
                <a class="link">
                  <router-link to="/signup" tag="span">Sign up in seconds</router-link>
                </a>
              </p>
            </div>
            <v-btn @click="onSubmit">Signin</v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "Signin",
  data() {
    return {
      email: "",
      password: "",
      show: false,
      validationFeedback: null
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    }
  },
  methods: {
    ...mapActions(["signin"]),
    encodeIMG() {
      let reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = () => {
        this.imageURL = reader.result;
      };
    },
    onSubmit() {
      if (this.email && this.password) {
        this.signin({
          email: this.email,
          password: this.password
        });
      } else {
        this.validationFeedback = "Please fill in both fields";
      }
    }
  },
  watch: {
    user(value) {
      if (value !== null) {
        this.$router.push({ name: "Today" });
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/style/form";
</style>
