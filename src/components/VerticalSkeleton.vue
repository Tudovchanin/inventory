<script setup>


const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  }
})

console.log(props.isActive);

</script>
<template>

  <div class="horizontal-skeleton" :class="{'active-skeleton': props.isActive}">
    <div class="horizontal-skeleton__display">
      <img src="@assets/img-skeleton.png" alt="decor image">
    </div>
    <div class="horizontal-skeleton__container-line">
      <div class="horizontal-skeleton__line"></div>
      <div class="horizontal-skeleton__line"></div>
      <div class="horizontal-skeleton__line"></div>
      <div class="horizontal-skeleton__line"></div>
      <div class="horizontal-skeleton__line"></div>
      <div class="horizontal-skeleton__line"></div>
      <div class="horizontal-skeleton__line"></div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.horizontal-skeleton {
  max-width: 236px;
  width: 100%;
  padding: 18px 13px 8px 13px;
  border-radius: 12px;
  border: solid 1px rgb(77, 77, 77);
  background-color: rgb(36, 36, 36);



  &__display {
    height: 240px;
    border-radius: 8px;
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;

    &::before {
      display: block;
      content: '';
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('@assets/img-skeleton.png');
      background-repeat: no-repeat;

      animation: moveX 12s linear infinite;
      opacity: 0;
      filter: blur(10px);
      animation-play-state: paused;
   
    }

    & img {
      width: 100%;
      height: 100%;
      animation: imageAnimation 1s linear infinite alternate;
      animation-play-state: paused;
    }
  }

  &__line {
    height: 10px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 16px;
    border-radius: 8px;
    background: linear-gradient(90deg, #3C3C3C 0%, #444444 51.04%, #333333 100%);

    &:first-child {
      height: 26px;
      margin-bottom: 24px;
      max-width: 188px;
      animation: shadow 1s linear infinite alternate;
    }

    &:nth-last-child(2) {
      margin-bottom: 24px;
    }

    &:last-child {
      max-width: 80px;
      animation: shadow 1s linear infinite alternate;
    }

    &:nth-child(2) {
      animation: horizontalSize 1s linear infinite alternate, shadow 1s linear infinite alternate;
      animation-play-state: paused;
    }

    &:nth-child(3) {
      animation: horizontalSize 1s 1s linear infinite alternate, shadow 1s linear infinite alternate;
      animation-play-state: paused;
    }

    &:nth-child(4) {
      animation: horizontalSize 1s linear infinite alternate, shadow 1s linear infinite alternate;
      animation-play-state: paused;
    }

    &:nth-child(5) {
      animation: horizontalSize 1s 1s linear infinite alternate, shadow 1s linear infinite alternate;
      animation-play-state: paused;
    }

    &:nth-child(6) {
      animation: horizontalSize 1s linear infinite alternate, shadow 1s linear infinite alternate;
      animation-play-state: paused;
    }
  }
}


.active-skeleton {

  .horizontal-skeleton__display {
    &::before {
      animation-play-state: running;
      opacity: .5;
    }
    & img {
      animation-play-state: running;
    }
  }

  .horizontal-skeleton__line {
    animation-play-state: running;
  }
}


</style>