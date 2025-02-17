<script setup>
import { ref, markRaw } from "vue";
import getImage from "@utils/getImage.js";

import AppInventory from "@components/AppInventory.vue";
import PanelDelete from "@components/PanelDelete.vue";
import VerticalSkeleton from "@components/VerticalSkeleton.vue";
import HorizontalSkeleton from "@components/HorizontalSkeleton.vue";

// Первый инвентарь
const stateInventory_1 = markRaw({
  column: 5,
  row: 5,
  localStorageKey: "inventory_1",
  imgProduct: {
    pathImg: "../assets/product-id-",
    extension: ".png",
  },
});
const panelDeleteProductHidden_1 = ref(true);
const panelDeleteRef_1 = ref(null);
const deleteProduct_1 = ref(null);
const dragOverProduct_1 = ref(false);
// Кол-во уд-го продукта
const quantityModel_1 = ref("");
const productQuantityInPanelDelete_1 = ref(0);

//  Второй инвентарь
const stateInventory_2 = markRaw({
  column: 3,
  row: 5,
  localStorageKey: "inventory_2",
  imgProduct: {
    pathImg: "../assets/product-id-",
    extension: ".png",
  },
});
const panelDeleteProductHidden_2 = ref(true);
const panelDeleteRef_2 = ref(null);
const deleteProduct_2 = ref(null);
const dragOverProduct_2 = ref(false);
const quantityModel_2 = ref("");
const productQuantityInPanelDelete_2 = ref(0);

// Продукт на который кликнули для добавления в инвентарь 1 и инвентарь 2
const clickProductId = ref(null);

// Обработчики перетаскивания продукта инвентаря 1 и 2
const handleDragOverProduct_1 = () => {
  setTrue(dragOverProduct_1);
};
const handleDragOverProduct_2 = () => {
  setTrue(dragOverProduct_2);
};

// Обработчики завершения перетаскивания продукта инвентаря 1 и 2
const handleDragEndProduct_1 = () => {
  setFalse(dragOverProduct_1);
};
const handleDragEndProduct_2 = () => {
  setFalse(dragOverProduct_2);
};

// Обработчики клика на продукт в инвентаре 1 и 2
const handleClickInInventoryProduct_1 = (clickProduct) => {
  setProductDelete(clickProduct, deleteProduct_1);
  panelDeleteVisible(panelDeleteProductHidden_1);
  productQuantityInPanelDelete_1.value = clickProduct.quantity;
};
const handleClickInInventoryProduct_2 = (clickProduct) => {
  setProductDelete(clickProduct, deleteProduct_2);
  panelDeleteVisible(panelDeleteProductHidden_2);
  productQuantityInPanelDelete_2.value = clickProduct.quantity;
};

// закрытие инвентаря 1 и 2 при клике не на панель удаления
const handleClickInventory_1 = (e) => {
  panelDeleteHidden(e, panelDeleteProductHidden_1, panelDeleteRef_1);
};
const handleClickInventory_2 = (e) => {
  panelDeleteHidden(e, panelDeleteProductHidden_2, panelDeleteRef_2);
};

// удаление продукта в инвентаре 1 и 2
const handleDeleteProduct_1 = () => {
  deleteProduct(quantityModel_1, deleteProduct_1, getTypeNumber);
};
const handleDeleteProduct_2 = () => {
  console.log("handleDeleteProduct_2");
  deleteProduct(quantityModel_2, deleteProduct_2, getTypeNumber);
};

// установка количества продукта в PanelDelete 1 и 2
const setQuantityProductInPanelDelete_1 = (quantity) => {
  productQuantityInPanelDelete_1.value = quantity;
};
const setQuantityProductInPanelDelete_2 = (quantity) => {
  productQuantityInPanelDelete_2.value = quantity;
};

function deleteProduct(quantityModel, deleteProduct, callback) {
  const valueDelete = callback(quantityModel.value);
  console.log(quantityModel.value, "deleteProduct");
  if (!valueDelete) return;
  deleteProduct.value = { ...deleteProduct.value, quantityDelete: valueDelete };
  quantityModel.value = "";
}

function panelDeleteVisible(panelDeleteProductHidden) {
  panelDeleteProductHidden.value = false;
}

function setProductDelete(productInInventory, deleteProduct) {
  deleteProduct.value = {
    ...productInInventory,
    quantityDelete: 0,
    extensionImg: "png",
  };
}

// Функция скрытия панели удаления продукта при клике не на panelDeleteRef
function panelDeleteHidden(e, panelDeleteProductHidden, panelDeleteRef) {
  if (
    !panelDeleteProductHidden.value &&
    !panelDeleteRef.value.contains(e.target)
  ) {
    panelDeleteProductHidden.value = true;
  }
}

// Обработчик клика на  карточку продукта для добавления в инвентарь
function handleClickCard(e) {
  const id = e.currentTarget.getAttribute("data-id");
  clickProductId.value = { id: id, quantity: 1 };
}

// очистка localStorage
function resetInventory() {
  localStorage.clear();
  window.location.reload();
}

// Функция перевода в число
function getTypeNumber(string) {
  if (typeof string !== "string") return;
  return string === "" || isNaN(string) ? 0 : parseInt(string, 10);
}

function setTrue(reactiveValue) {
  reactiveValue.value = true;
}

function setFalse(reactiveValue) {
  reactiveValue.value = false;
}
</script>
3
<template>
  <div class="wrapper-content">
    <div class="container-card">
      <div data-id="1" @click="handleClickCard" class="card">
        <img src="./assets/product-id-1.png" alt="product" />
      </div>
      <div data-id="2" @click="handleClickCard" class="card">
        <img src="./assets/product-id-2.png" alt="product" />
      </div>
      <div data-id="3" @click="handleClickCard" class="card">
        <img src="./assets/product-id-3.png" alt="product" />
      </div>
    </div>

    <button class="reset-product" @click="resetInventory">Reset Product</button>

    <div class="container-inventory">
      <div class="container-inventory__skeleton-vertical">
        <VerticalSkeleton :isActive="dragOverProduct_1" />
      </div>

      <div class="container-inventory__inventory inventory">
        <AppInventory
          @click-product="handleClickInInventoryProduct_1"
          @drag-over="handleDragOverProduct_1"
          @drag-end="handleDragEndProduct_1"
          @product-removed="setQuantityProductInPanelDelete_1"
          :stateInventory="stateInventory_1"
          :productId="clickProductId"
          :deleteProduct="deleteProduct_1"
        />

        <div
          @click="handleClickInventory_1"
          :class="{
            'inventory__wrapper-panel-delete--hidden':
              panelDeleteProductHidden_1,
          }"
          class="inventory__wrapper-panel-delete"
        >
          <div ref="panelDeleteRef_1" class="inventory__panel-delete">
            <button
              @click="panelDeleteProductHidden_1 = true"
              class="inventory__panel-delete-close"
            >
              <img src="@assets/btn-close.svg" alt="close-btn" />
            </button>
            <PanelDelete
              v-model:quantityDelete="quantityModel_1"
              :isActive="dragOverProduct_1"
              :deleteIdProduct="deleteProduct_1"
              :productQuantity="productQuantityInPanelDelete_1"
              @delete-product="handleDeleteProduct_1"
            />
          </div>
        </div>
      </div>
      <div class="container-inventory__skeleton-horizontal">
        <HorizontalSkeleton :isActive="dragOverProduct_1" />
      </div>
    </div>

    <div class="container-inventory">
      <div class="container-inventory__skeleton-vertical">
        <VerticalSkeleton :isActive="dragOverProduct_2" />
      </div>

      <div class="container-inventory__inventory inventory">
        <AppInventory
          @click-product="handleClickInInventoryProduct_2"
          @drag-over="handleDragOverProduct_2"
          @drag-end="handleDragEndProduct_2"
          @product-removed="setQuantityProductInPanelDelete_2"
          :stateInventory="stateInventory_2"
          :productId="clickProductId"
          :deleteProduct="deleteProduct_2"
        />

        <div
          @click="handleClickInventory_2"
          :class="{
            'inventory__wrapper-panel-delete--hidden':
              panelDeleteProductHidden_2,
          }"
          class="inventory__wrapper-panel-delete"
        >
          <div ref="panelDeleteRef_2" class="inventory__panel-delete">
            <button
              @click="panelDeleteProductHidden_2 = true"
              class="inventory__panel-delete-close"
            >
              <img src="@assets/btn-close.svg" alt="close-btn" />
            </button>
            <PanelDelete
              v-model:quantityDelete="quantityModel_2"
              :isActive="dragOverProduct_2"
              :deleteIdProduct="deleteProduct_2"
              :productQuantity="productQuantityInPanelDelete_2"
              @delete-product="handleDeleteProduct_2"
            />
          </div>
        </div>
      </div>
      <div class="container-inventory__skeleton-horizontal">
        <HorizontalSkeleton :isActive="dragOverProduct_2" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.wrapper-content {
  padding: 20px;
}

.container-card {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  padding-top: 20px;
  padding-bottom: 20px;
  cursor: pointer;

  & img {
    pointer-events: none;
  }
}

.card {
  display: inline-block;
  overflow: hidden;
}

.container-inventory {
  position: relative;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  row-gap: 20px;
  max-width: 854px;
  margin-left: auto;
  margin-right: auto;
  background-color: rgb(29, 29, 29);
  padding: 35px;

  @media (max-width: 580px) {
    padding: 10px;
  }

  &__inventory {
    grid-column: 3/-1;
    @media (max-width: 580px) {
      grid-column: 1/-1;
    }
  }

  &__skeleton-vertical {
    grid-column: 1/3;
    padding-right: 20px;
    @media (max-width: 580px) {
    display: none;
    }
  }

  &__skeleton-horizontal {
    grid-column: 1/-1;
  }
}

.inventory {
  max-width: 525px;
  width: 100%;
  height: 500px;
  position: relative;
  overflow: hidden;
  background-color: rgb(38, 38, 38);
  border: solid 1px rgb(77, 77, 77);
  border-radius: 12px;
  color: rgb(131, 129, 129);
  @media (max-width: 580px) {
    height: 300px;
    }

  &__wrapper-panel-delete {
    display: flex;
    justify-content: flex-end;
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;

    transition: transform 0.3s;

    &--hidden {
      position: absolute;
      transform: translateX(100vw);
    }
  }

  &__panel-delete {
    width: 48.5%;
    height: 100%;
    border-left: solid 1px rgb(77, 77, 77);
    background-color: rgba(38, 38, 38, 0.5);
    backdrop-filter: blur(16px);
    @media (max-width: 580px) {
      width: 70%;
    }
  }

  &__panel-delete-close {
    position: absolute;
    background-color: transparent;
    width: 30px;
    height: 30px;
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1;
    border: none;
    cursor: pointer;
  }
}

.reset-product {
  background-color: rgba(0, 0, 0, 0.719);
  color: red;
  padding: 20px;
  cursor: pointer;
}
</style>
