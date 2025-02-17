<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from "vue";
import getImage from "@utils/getImage.js";

const props = defineProps({
  stateInventory: {
    type: Object,
    required: true,
  },

  productId: {
    type: Object,
    default: null,
  },

  deleteProduct: {
    type: Object,
    default: null,
  },
});

const quantityCells = computed(() => {
  return props.stateInventory.column * props.stateInventory.row;
});

const inventoryRef = ref(null);
const inventory = ref(null);

const emit = defineEmits(["clickProduct", "dragOver", "dragEnd", "product-removed"]);

function clickProduct(product) {
  emit("clickProduct", product);
}


watch(
  () => props.productId,
  (newProductId) => {
    addProductInInventory(newProductId);
  }
);

watch(
  () => props.deleteProduct,
  (deleteProduct) => {
    for (let index = 0; index < inventory.value.length; index++) {
      if (inventory.value[index]?.id === deleteProduct.id) {
        inventory.value[index].quantity -= deleteProduct.quantityDelete;
        emit("product-removed", inventory.value[index].quantity);
        if (inventory.value[index].quantity <= 0) {
          inventory.value.splice(index, 1, null);
          console.log('продукт удален');
          emit("product-removed", 0);
        }
      }
    }

    saveState(props.stateInventory.localStorageKey, inventory.value);
  }
);

function addProductInInventory(clickProduct) {
  const productInInventory = inventory.value.find(
    (product) => product?.id === clickProduct.id
  );

  if (!productInInventory) {
    for (let index = 0; index < inventory.value.length; index++) {
      if (!inventory.value[index]) {
        inventory.value[index] = { ...clickProduct };
        saveState(props.stateInventory.localStorageKey, inventory.value);
        break;
      }
    }
  } else {
    ++productInInventory.quantity;
  }
  saveState(props.stateInventory.localStorageKey, inventory.value);
}

function loadState() {
  const savedState = localStorage.getItem(props.stateInventory.localStorageKey);
  if (savedState) {
    const parsedState = JSON.parse(savedState);
    return parsedState;
  }
}

function saveState(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function changePositionProductInInventory(oldIndex, newIndex) {
  [inventory.value[oldIndex], inventory.value[newIndex]] = [
    inventory.value[newIndex],
    inventory.value[oldIndex],
  ];
}


let selectedProduct = null;
let selectedProductClientX = null;
let selectedProductClientY = null;
let widthSelectProduct = null;
let heightSelectProduct = null;

let valueTransformX = 0;
let valueTransformY = 0;

let touchClientMoveX = 0;
let touchClientMoveY = 0;



let isDragging = false;

function handleTouchStart(e) {
  if (!e.target.closest(".cell__product")) return;
  e.preventDefault();

  selectedProduct = e.target.closest(".cell__product");

  selectedProductClientX = selectedProduct.getBoundingClientRect().left;
  selectedProductClientY = selectedProduct.getBoundingClientRect().top;

  widthSelectProduct = selectedProduct.offsetWidth;
  heightSelectProduct = selectedProduct.offsetHeight;
}

function handleTouchMove(e) {
  if (!selectedProduct) return;
  e.preventDefault();

  const clientX = e.type !== "mousemove" ? e.touches[0].clientX : e.clientX;
  const clientY = e.type !== "mousemove" ? e.touches[0].clientY : e.clientY;

  valueTransformX = clientX - selectedProductClientX - widthSelectProduct / 2;
  valueTransformY = clientY - selectedProductClientY - heightSelectProduct / 2;

  touchClientMoveX = clientX;
  touchClientMoveY = clientY;
  selectedProduct.style.transform = `translate(${valueTransformX}px, ${valueTransformY}px)`;
  selectedProduct.style.zIndex = "100";
  selectedProduct.classList.add(`selected`);
  isDragging = true;
  emit("dragOver");
}

function handleTouchEnd(e) {
  if (!selectedProduct) return;
  e.preventDefault();
  emit("dragEnd");

  if (!isDragging) {
    const indexClickProduct = selectedProduct.dataset.indexProduct;

    clickProduct(inventory.value[indexClickProduct]);
    resetValueDragDropTouch();
    return;
  }

  const elements = document.elementsFromPoint(
    touchClientMoveX,
    touchClientMoveY
  );
  const dropZone = elements.filter((element) =>
    element.classList.contains("cell")
  )[0];

  const oldIndexCell = selectedProduct?.dataset?.indexProduct;
  const newIndexCell = dropZone?.dataset?.indexCell;
  const dropZoneChild = dropZone?.querySelector(".cell__product");

  if (!oldIndexCell || !newIndexCell || dropZoneChild) {
    selectedProduct.style.transform = `translate(0px, 0px)`;
    resetValueDragDropTouch();
    return;
  }

  changePositionProductInInventory(oldIndexCell, newIndexCell);
  saveState(props.stateInventory.localStorageKey, inventory.value);
  resetValueDragDropTouch();

  nextTick(() => {
    if (inventoryRef.value.querySelector(".selected")) {
      dropZone.append(selectedProduct);
    }
  });
}

function resetValueDragDropTouch() {
  selectedProduct.classList.remove(`selected`);
  selectedProduct.style.zIndex = "initial";
  selectedProduct = null;
  selectedProductClientX = null;
  selectedProductClientY = null;
  valueTransformX = 0;
  valueTransformY = 0;
  touchClientMoveX = 0;
  touchClientMoveY = 0;
  isDragging = false;
}

onMounted(() => {
  if (!loadState()) {
    inventory.value = Array.from({ length: quantityCells.value }, () => null);

    localStorage.setItem(
      props.stateInventory.localStorageKey,
      JSON.stringify(inventory.value)
    );
  }

  inventory.value = loadState().map((obj) => obj && { ...obj });

  inventoryRef.value.addEventListener("touchstart", handleTouchStart, {
    passive: false,
  });
  inventoryRef.value.addEventListener("touchmove", handleTouchMove, {
    passive: false,
  });

  inventoryRef.value.addEventListener("mousedown", handleTouchStart, {
    passive: false,
  });
  inventoryRef.value.addEventListener("mousemove", handleTouchMove, {
    passive: false,
  });

  nextTick(() => {
    inventoryRef.value.querySelectorAll(".cell").forEach((cell) => {
      cell.addEventListener("touchend", handleTouchEnd, { passive: false });
      cell.addEventListener("mouseup", handleTouchEnd, { passive: false });
    });
  });
});

onUnmounted(() => {
  inventoryRef.value.removeEventListener("touchstart", handleTouchStart);
  inventoryRef.value.removeEventListener("touchmove", handleTouchMove);
  inventoryRef.value.removeEventListener("mousedown", handleTouchMove);
  inventoryRef.value.removeEventListener("mousemove", handleTouchMove);

  inventoryRef.value.querySelectorAll(".cell").forEach((cell) => {
    cell.removeEventListener("touchend", handleTouchEnd);
    cell.removeEventListener("mouseup", handleTouchEnd);
  });
});
</script>
<template>
  <div ref="inventoryRef" :style="{ '--column-count': props.stateInventory.column }" class="table">
    <div :key="index" :data-index-cell="index" class="cell" :class="'cell--' + index"
      v-for="(product, index) in inventory">
      <div v-if="product?.quantity > 0" class="cell__product" :data-index-product="index" :data-id="product.id">
        <img :src="getImage(
          stateInventory.imgProduct.pathImg +
          product.id +
          stateInventory.imgProduct.extension
        )
          " alt="product" />
      </div>
      <div class="cell__quantity" v-if="product?.quantity > 0">
        {{ product.quantity }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table {
  display: grid;
  grid-template-columns: repeat(var(--column-count), 1fr);
  grid-auto-rows: 1fr;
  gap: 1px;
  width: 100%;
  height: 100%;
  pointer-events: none;
  border-color: inherit;

}

.cell {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  pointer-events: initial;
  border: solid 1px;
  border-color: inherit;
  margin: -1px;
  line-height: 0;

  &__product {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
    overflow: hidden;


    & img {
      width: 54px;
      height: 54px;
      pointer-events: none;

      @media (max-width: 800px) {
        width: 34px;
        height: 34px;
      }
    }
  }

  &__quantity {
    position: absolute;
    width: 16px;
    height: 16px;
    right: 0;
    bottom: 0;
    border: solid 1px;
    border-color: inherit;
    border-top-left-radius: 6px;
    line-height: 16px;
    text-align: center;
    font-size: 10px;
    font-weight: 500;
    pointer-events: none;
    color: inherit;
  }
}

.selected {
  width: 120px;
  height: 120px;
  position: absolute;
  border: solid 1px;
  border-radius: 30px;
  background-color: rgba(240, 248, 255, 0.269);
}
</style>
