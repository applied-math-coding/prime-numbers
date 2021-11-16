import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'PrimeNumbers',
  props: {
    primes: [] as PropType<number[]>,
    workerId: Number
  }
});