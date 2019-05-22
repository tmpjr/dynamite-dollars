<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
  props: ["chartdata", "options"],
  data: () => {
    return {};
  },
  mounted() {
    this.renderChart(this.chartdata, this.options);
  }
};
</script>
