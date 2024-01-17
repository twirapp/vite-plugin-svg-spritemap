<script setup lang="ts">
import Flag1 from './icons/flags1/flag1.svg?use'
import Flag2 from './icons/flags1/flag2.svg?use'

import Flag3 from './icons/flags2/flag1.svg?view'
import Flag4 from './icons/flags2/flag2.svg?view'

import Flag5 from './icons/flag1.svg?use'
import Flag6 from './icons/flag2.svg?view'
</script>

<template>
  <div>
    <h4>/icons/flags1/*.svg (use)</h4>
    <Flag1 style="width: 32px; height: 24px;" />
    <Flag2 style="width: 32px; height: 24px;" />
  </div>

  <div>
    <h4>/icons/flags2/*.svg (view)</h4>
    <Flag3 />
    <Flag4 />
  </div>

  <div>
    <h4>/icons/*.svg (view)</h4>
    <Flag5 style="width: 32px; height: 24px;" />
    <Flag6 />
  </div>
</template>
