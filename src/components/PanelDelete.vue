<script setup>
import { ref, computed, watch } from "vue";
import getImage from "@utils/getImage.js";
const BASE_PATH = import.meta.env.BASE_URL;
const props = defineProps({
  isActive: {
    type: Boolean,
    default: false,
  },

  deleteIdProduct: {
    type: Object,
    default: null,
  },

  productQuantity: {
    type: Number,
    default: 0,
  },
});

const panelQuantityHidden = ref(true);
const pathImg = computed(() => {
  return `${BASE_PATH}product-id-${props.deleteIdProduct.id}.${props.deleteIdProduct.extensionImg}`;
});

const emit = defineEmits(["deleteProduct"]);

const quantityDelete = defineModel("quantityDelete");

function handleDelete() {
  panelQuantityHidden.value = true;
  emit("deleteProduct");
}
watch(()=> props.deleteIdProduct,(newValue)=> {
  panelQuantityHidden.value = true;
})

</script>
<template>
  <div class="panel" :class="{ 'active-skeleton': props.isActive }">
    <div class="panel__header">
      <div
        v-if="props.deleteIdProduct && props.productQuantity"
        class="panel__img-product"
      >
        <img :src="getImage(pathImg)" :alt="props.deleteIdProduct" />
        <div class="panel__product-quantity">{{ props.productQuantity }}</div>
      </div>
    </div>

    <div class="panel__container-line">
      <div class="panel__line"></div>
      <div class="panel__line"></div>
      <div class="panel__line"></div>
      <div class="panel__line"></div>
      <div class="panel__line"></div>
      <div class="panel__line"></div>
    </div>

    <div
      class="panel__quantity-delete quantity-delete"
      :class="{ 'panel__quantity-delete--hidden': panelQuantityHidden }"
    >
      <input
        v-model="quantityDelete"
        placeholder="Введите количество"
        class="quantity-delete__input base-input"
        type="text"
      />
      <div class="quantity-delete__buttons">
        <button
          @click="panelQuantityHidden = true"
          class="quantity-delete__btn-cancel"
        >
          Отмена
        </button>
        <button @click="handleDelete" class="quantity-delete__btn-confirm">
          Подтвердить
        </button>
      </div>
    </div>

    <button @click="panelQuantityHidden = false" class="panel__btn">
      Удалить предмет
    </button>
  </div>
</template>

<style lang="scss" scoped>
.panel {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  padding: 54px 10px 20px;
  height: 100%;
  @media (max-width: 580px) {
    padding: 20px;
  }

  &__header {
    display: flex;
    justify-content: center;
    padding-bottom: 20px;
    min-height: 140px;
    @media (max-width: 580px) {
      min-height: 50px;
      padding-bottom: 10px;
    }
  }

  &__img-product {
    width: 120px;
    height: 120px;
    position: relative;
    @media (max-width: 580px) {
      width: 40px;
      height: 40px;
    }

    & img {
      pointer-events: none;
      user-select: none;
    }
  }

  &__product-quantity {
    position: absolute;
    left: 0;
    bottom: -25px;
    font-size: 20px;
    font-weight: 600;
  }

  &__container-line {
    padding-top: 20px;
    padding-bottom: 20px;
    border-top: solid rgba(77, 77, 77, 1) 1px;
    border-bottom: solid rgba(77, 77, 77, 1) 1px;
    @media (max-width: 580px) {
      padding-top: 15px;
      padding-bottom: 15px;
    }
  }

  &__line {
    height: 10px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 16px;
    border-radius: 8px;
    background: linear-gradient(
      90deg,
      #3c3c3c 0%,
      #444444 51.04%,
      #333333 100%
    );

    @media (max-width: 580px) {
      height: 6px;
      margin-bottom: 12px;
    }

    &:first-child {
      height: 26px;
      margin-bottom: 24px;
      max-width: 188px;
      animation: shadow 1s linear infinite alternate;
      @media (max-width: 580px) {
        height: 13px;
        margin-bottom: 12px;
      }
    }

    &:last-child {
      margin-bottom: 0;
    }

    &:nth-child(2) {
      animation: horizontalSize 1s linear infinite alternate,
        shadow 1s linear infinite alternate;
      animation-play-state: paused;
    }

    &:nth-child(3) {
      animation: horizontalSize 1s 1s linear infinite alternate,
        shadow 1s linear infinite alternate;
      animation-play-state: paused;
    }

    &:nth-child(4) {
      animation: horizontalSize 1s linear infinite alternate,
        shadow 1s linear infinite alternate;
      animation-play-state: paused;
    }

    &:nth-child(5) {
      animation: horizontalSize 1s 1s linear infinite alternate,
        shadow 1s linear infinite alternate;
      animation-play-state: paused;
    }

    &:nth-child(6) {
      animation: horizontalSize 1s linear infinite alternate,
        shadow 1s linear infinite alternate;
      animation-play-state: paused;
    }
  }

  &__btn {
    background-color: rgba(255, 136, 136, 1);
    border-radius: 8px;
    border: none;
    color: white;
    padding-top: 12px;
    padding-bottom: 12px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.05em;
    transition: box-shadow 0.3s;
    cursor: pointer;
    @media (max-width: 580px) {
     font-size: 12px;
    }

    @media (hover: hover) {
      &:hover {
        box-shadow: 0 0 18px 1px rgb(255, 255, 255);
      }
    }
  }

  &__quantity-delete {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 20px;
    border-top: solid 1px rgb(77, 77, 77);
    transition: transform 0.5s;

    &--hidden {
      transform: translateY(100%);
    }
  }
}

.quantity-delete {
  display: grid;
  row-gap: 18px;
  background-color: rgba(38, 38, 38, 0.9);
  backdrop-filter: blur(16px);

  &__input {
    width: 100%;
    height: 40px;
    padding-left: 10px;
    border-radius: 4px;
    border: solid 1px rgb(77, 77, 77);
    background-color: transparent;
    color: white;
    outline: none;

    &::placeholder {
      font-size: 14px;
      font-weight: 600;
      @media (max-width: 580px) {
     font-size: 12px;
     font-weight: 500;
    }
    }

    &:focus {
      border: solid 1px rgb(111, 108, 108);
    }
  }

  &__buttons {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__btn-cancel {
    padding: 8px 19px;
    border-radius: 8px;
    border: none;
    background-color: rgba(255, 255, 255, 1);
    font-weight: 400;
    font-size: 14px;
    color: rgba(45, 45, 45, 1);
    box-shadow: 0 0 6px 1px rgb(255, 255, 255);
    cursor: pointer;
  }

  &__btn-confirm {
    padding: 8px 14px;
    border-radius: 8px;
    border: none;
    background-color: rgba(250, 114, 114, 1);
    font-weight: 400;
    font-size: 14px;
    color: rgba(255, 255, 255, 1);
    box-shadow: 0 0 6px 1px rgba(250, 114, 114, 1);
    outline: solid 1px rgb(255, 108, 108);
    cursor: pointer;
  }
}

.active-skeleton {
  .panel__line {
    animation-play-state: running;
  }
}
</style>
