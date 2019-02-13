export default {
  methods: {
    jump(to) {
      if (this.$router) {
        console.log(to);
        if (isNaN(to)) {
          this.$router.push(to);
        } else {
          this.$router.go(to);
        }
      }
    }
  }
};
