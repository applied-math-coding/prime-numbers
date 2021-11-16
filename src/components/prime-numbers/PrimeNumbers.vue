<template>
  <div class="primes-container">
    <div class="text-center pb-2 mb-2 text-lg worker-title">
      Worker {{ workerId }}
    </div>
    <div class="numbers-container">
      <div class="grad-divider"></div>
      <div class="number" v-for="(p, index) in primes" :key="index">
        {{ p?.toLocaleString() }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./PrimeNumbers.ts"></script>
<style lang="scss" src="./PrimeNumbers.scss"></style>