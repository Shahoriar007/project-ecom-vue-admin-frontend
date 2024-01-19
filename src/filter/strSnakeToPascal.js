import Vue from "vue";

Vue.filter("strSnakeToPascal", function (value) {
  if (!value) return "";
  value = value.toString();

  return value
    .split("_")
    .map(function (item) {
      return item.charAt(0).toUpperCase() + item.substring(1);
    })
    .join(" ");
});
