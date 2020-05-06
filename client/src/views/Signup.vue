<template>
  <div class="wrapper">
    <div class="backdrop">
      <div class="container">
        <div class="sign-up">
          <div class="top">
            <h6>Signup in seconds:</h6>
          </div>
          <div class="form">
            <v-text-field
              v-model="email"
              :rules="[rules.email]"
              label="E-mail"
              outlined
              dense
              color="rgb(130, 189, 112)"
            />
            <v-text-field
              v-model="name"
              :rules="[rules.name]"
              label="Name"
              outlined
              dense
              color="rgb(130, 189, 112)"
            />
            <v-text-field
              v-model="password"
              :rules="[rules.password]"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              label="Password"
              hint="At least 8 characters"
              counter
              outlined
              dense
              color="rgb(130, 189, 112)"
              @click:append="show = !show"
            />
            <v-text-field
              v-model="confirmPassword"
              :rules="[rules.password, rules.match]"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              label="Confirm password"
              hint="At least 8 characters"
              counter
              outlined
              dense
              color="rgb(130, 189, 112)"
              @click:append="show1 = !show1"
            />
            <div class="additional">
              <p>
                Already have an account?
                <a class="link">
                  <router-link to="/signin" tag="span">Sign in in seconds</router-link>
                </a>
              </p>
            </div>
            <v-btn @click="onSubmit">Submit</v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "Signup",
  data() {
    return {
      email: "",
      name: "",
      slug: "",
      password: "",
      confirmPassword: "",
      isChecked: false,
      show: false,
      show1: false,
      validationFeedback: null,
      rules: {
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
        name: value => value.length >= 3 || "Min 3 characters",
        password: value => value.length >= 8 || "Min 8 characters",
        match: value => value === this.password || "Password doesn't match"
      }
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    }
  },
  methods: {
    ...mapActions(["signup"]),
    onSubmit() {
      if (!this.email && !this.password && !this.confirmPassword) {
      } else if (this.password.length < 8) {
      } else if (this.password !== this.confirmPassword) {
      } else if (!this.isChecked) {
      } else {
        this.signup({
          email: this.email,
          name: this.name,
          password: this.password
        });
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