<script>
import { Doughnut, mixins } from "vue-chartjs";
import "chartjs-plugin-labels";
const { reactiveProp } = mixins;

export default {
  mixins: [reactiveProp],
  extends: Doughnut,
  data: () => {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          labels: {
            render: args => {
              return "$" + args.value;
            }
          }
        }
      }
    };
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  }
};
</script>
