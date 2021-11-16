<template>
  <h1 class="text-center mt-0">Calculating Prime Numbers in parallel</h1>
  <h4 class="text-center">
    An application intending to demonstrate the use of workers for scientific
    computations.
  </h4>

  <Divider></Divider>

  <div class="subheader">
    <div class="workers">
      <h2 class="text-center mb-2 mt-0">Workers</h2>
      <div class="text-center">
        <Button v-if="!running" label="Start" @click="handleStart()" />
        <Button
          v-if="running"
          label="Stop"
          class="p-button-danger"
          @click="handleStop()"
        />
      </div>
      <div class="text-xs text-color-secondary mt-2 text-center">
        Note, this action will use a considerable amount of CPU resources of
        your system!
      </div>
    </div>
    <div class="definition">
      <h2 class="text-center mb-2 mt-0">Definition</h2>
      <div class="text-color-secondary font-italic text-center">
        "A prime number is a natural number greater than 1 that is not a product
        of two smaller natural numbers."
      </div>
    </div>
    <div class="largest-prime">
      <h2 class="text-center mb-2 mt-0">Largest found Prime</h2>
      <div class="text-4xl text-center primary-color">
        {{ currentGreatest?.toLocaleString() }}
      </div>
    </div>
  </div>
  <template v-if="running">
    <div class="text-xs text-color-secondary mb-2 text-center">
      Workers are getting added when deemed beneficial.
    </div>
    <div class="worker-primes-positioner">
      <div
        class="worker-primes-container"
        v-for="(primes, index) in nonEmptyPrimeCollections"
        :key="index"
      >
        <PrimeNumbers :primes="primes" :workerId="index + 1"></PrimeNumbers>
      </div>
    </div>
  </template>
</template>

<script lang="ts" src="./App.ts"></script>
<style lang="scss" src="./App.scss"></style>
