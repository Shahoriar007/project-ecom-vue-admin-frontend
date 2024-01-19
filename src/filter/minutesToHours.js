import Vue from "vue";

Vue.filter("minutesToHours", function (value) {
  if (!value) return "";

  let hours = value / 60;
  hours = hours.toFixed(2);
  hours = hours.toString();
  return hours.split(".").join(":");
});
