<script setup>

import { ref } from "vue";

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  }
})

const close = ref(false);


</script>
<template>
  <div v-show="!close" class="horizontal-skelton" :class="{'active-skeleton': props.isActive}">
    <div class="horizontal-skelton__decor"></div>
    <button @click="close = true" class="horizontal-skelton__close-btn">
      <img src="@assets/btn-close.svg" alt="button close skeleton" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.horizontal-skelton {
  position: relative;
  max-width: 785px;
  width: 100%;
  padding: 18px 35px 18px 18px;
  border-radius: 12px;
  background-color: rgba(38, 38, 38, 1);
 

  &__decor {
    position: relative;
    max-width: 699px;
    width: 100%;
    height: 36px;
    border-radius: 12px;
    background: linear-gradient(90deg, #3C3C3C 0%, #444444 51.04%, #333333 100%);
    background-repeat: no-repeat;
    overflow: hidden;

      // animation-play-state: paused;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        
        background: linear-gradient(0deg, #7c7575 0%, #444444 51.04%, #333333 100%);
        filter: blur(10px);

        animation: skeleton-bg 2s linear infinite alternate;
        animation-play-state: paused;

      }
  }

  &__close-btn {
    position: absolute;
    top: 7px;
    right: 8px;
    
    background-color: transparent;
    border: none;
    cursor: pointer;
  }
}

.active-skeleton {

  .horizontal-skelton__decor {

    &::before {
      animation-play-state: running;
    }
    
  }
}


@keyframes skeleton-bg {
  from {
    transform: translateY(-170%) rotate(5deg);
  }

  to {
    transform: translateY(150%) rotate(5deg);
  
  }
}

</style>
