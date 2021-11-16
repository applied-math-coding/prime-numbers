import { defineComponent, nextTick } from 'vue';
import { createSharedView, createWorker, terminateWorker, WorkerExec } from '@applied.math.coding/worker-utils';
import PrimeNumbers from '@/components/prime-numbers/PrimeNumbers.vue';
import Button from 'primevue/button';
import Divider from 'primevue/divider';

export default defineComponent({
  name: 'App',
  components: {
    PrimeNumbers,
    Button,
    Divider
  },
  data() {
    return {
      range: 1000000,
      historyLength: 10,
      currentGreatest: 2,
      workers: [] as WorkerExec<(start: number, end: number, upperBound: Int32Array, canSend: Int32Array) => void>[],
      primeCollections: [] as number[][],
      running: false
    }
  },
  computed: {
    nonEmptyPrimeCollections(): number[][] {
      return this.primeCollections.filter(e => e.length > 0);
    }
  },
  mounted() {
    document.addEventListener('visibilitychange', () => {
      document.visibilityState === 'hidden' && this.handleStop();
    });
  },
  methods: {
    handleStop() {
      this.workers?.forEach(w => terminateWorker(w));
      this.running = false;
    },
    handleStart() {
      this.running = true;
      this.currentGreatest = 2;
      const sharedUpperBound = createSharedView([0], Int32Array);
      const canSend = createSharedView([1], Int32Array); // avoiding to overflow event-queue with tasks
      const n_worker = window.navigator.hardwareConcurrency;
      this.primeCollections = [...Array(n_worker)].map(e => []);
      this.workers = [...Array(n_worker)]
        .map(
          (_, idx) => createWorker<(start: number, end: number, upperBound: Int32Array, canSend: Int32Array) => void>({
            fn: `(start, range, upperBound, canSend) => {
            while (true) {
              for (let n = start; n < start + range; n++) {
                if(isPrime(n)){
                  if(Atomics.compareExchange(canSend, 0, 1, 0) === 1) {
                    postMessage(n);
                  }
                }
              }
              start = Atomics.add(upperBound, 0, range);
            }
          }`,
            context: [this.createIsPrime()],
            subscription: prime => this.addPrime(prime, idx, canSend)
          })
        );
      this.workers.forEach((w, idx) => w(idx * this.range, this.range, sharedUpperBound, canSend));
    },
    async addPrime(n: number, idx: number, canSend: Int32Array) {
      if (this.primeCollections[idx].length >= this.historyLength) {
        this.primeCollections[idx].shift();
      }
      this.primeCollections[idx].push(n);
      this.currentGreatest = Math.max(this.currentGreatest, n);
      await nextTick();
      Atomics.store(canSend, 0, 1);  // only allow to send when last rendering finished.
    },
    createIsPrime(): string {
      return `function isPrime(n) {
        const nStrg = '' + n;
        const lastDigit = +nStrg.charAt(nStrg.length - 1);
        if (lastDigit % 2 === 0) {
          return false;
        } else {
          for (let t = 3; t <= Math.ceil(Math.sqrt(n)); t = t + 2) {
            if (n % t === 0) {
              return false;
            }
          }
          return true;
        }
      }`
    }
  }
});

