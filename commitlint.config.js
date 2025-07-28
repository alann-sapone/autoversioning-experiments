export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "subject-case": [2, "always", ["sentence-case", "start-case"]],
    "body-max-line-length": [0, "never"]
  },
};