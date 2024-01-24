<script setup lang="ts">
import GamePreview from '@/components/GamePreview.vue'
import { getCardInfos } from '@/api/home'
import { ref, onMounted } from 'vue'

const cardInfos = ref<any>([])
const demoUrl = ref<string>()
const isGamePlay = ref<boolean>(true)
const contentSize = ref<{ width: number; height: number }>({ width: 375, height: 667 })
const searchInfo = ref<{ option: 'category' | 'name'; text: string }>({
  option: 'category',
  text: ''
})
const inputTips = ref<string[]>([])
let cardNames: string[] = []
let cardCategories: string[] = []
let rootCardInfos = cardInfos.value
onMounted(() => {
  getCardInfos().then((res) => {
    console.log('res' + res)
    cardInfos.value = res as unknown as []
    rootCardInfos = cardInfos.value
    for (let card of cardInfos.value) {
      cardNames.push(card.key.name)
      cardCategories.push(card.key.category)
    }
  })
})

const rotateScreen = function () {
  const mainEl = document.querySelector('main') as HTMLElement
  mainEl.style.setProperty('--game-play-width', `${contentSize.value.height}px`)
  mainEl.style.setProperty('--game-play-height', `${contentSize.value.width}px`)
  contentSize.value = {
    width: contentSize.value.height,
    height: contentSize.value.width
  }
}

const search = function () {
  const searchOption = searchInfo.value.option,
    searchText = searchInfo.value.text,
    cards = rootCardInfos,
    options = []
  if (searchText == '') {
    return
  }
  switch (searchOption) {
    case 'category':
      for (let card of cards) {
        if (card.key.category == searchText) {
          options.push(card)
        }
      }
      break
    case 'name':
      for (let card of cards) {
        let cardName: string = card.key.name
        if (cardName.includes(searchText)) {
          options.push(card)
        }
      }
      break
  }
  rerenderPage(options)
}

const rerenderPage = function (cards: any[]) {
  cardInfos.value = cards
}

const getDemoUrl = function (url: string) {
  demoUrl.value = url
  console.log(demoUrl.value)
  isGamePlay.value = false
}

const reloadGame = function () {
  const frameWindow = document.querySelector('iframe')
  window.open(frameWindow?.src, 're', '')
}

const querySearch = function (queryString: string, cb: any) {
  const curOption = searchInfo.value.option
  let tips: string[] = []
  tips = curOption == 'category' ? cardCategories : cardNames
  tips = Array.from(new Set(tips))
  const results = queryString ? tips.filter(createFilter(queryString)) : tips
  cb(results)
}

const createFilter = function (queryString: string) {
  return (str: string) => {
    return str.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  }
}
</script>

<template>
  <main>
    <div class="search-zone">
      <el-autocomplete
        v-model="searchInfo.text"
        placeholder="Search..."
        class="search"
        :fetchSuggestions="querySearch"
        :clearable="true"
        @select="search"
      >
        <template #prepend>
          <el-select v-model="searchInfo.option" placeholder="Select" style="width: 100px">
            <el-option label="Category" value="category"></el-option>
            <el-option label="Name" value="name"></el-option>
          </el-select>
        </template>
        <template #append>
          <el-button class="search-button" @click="search"><i-carbon-search /></el-button>
        </template>
      </el-autocomplete>
    </div>
    <div class="content">
      <GamePreview
        v-for="(cardInfo, index) in cardInfos"
        :key="index"
        :cardInfo="cardInfo"
        @transfer="getDemoUrl"
      ></GamePreview>
    </div>

    <div class="overlay" :hidden="isGamePlay"></div>
    <div class="game-play-box" :hidden="isGamePlay">
      <div class="game-play-component">
        <el-icon
          class="game-play-close-button interaction-icon"
          size="35"
          color="#696969"
          @click="isGamePlay = !isGamePlay"
          ><i-carbon-close-filled
        /></el-icon>
        <el-icon
          class="game-play-orientation-button interaction-icon"
          size="35"
          color="#696969"
          @click="rotateScreen"
        >
          <i-carbon-mobile-view-orientation
        /></el-icon>
        <el-icon
          class="game-play-reload-button interaction-icon"
          size="35"
          color="#696969"
          @click="reloadGame"
        >
          <i-carbon-renew
        /></el-icon>
      </div>
      <iframe
        class="game-play"
        :src="demoUrl"
        name="re"
        security="restricted"
        sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"
      ></iframe>
    </div>
  </main>
</template>

<style scoped>
main {
  position: relative;
  --game-play-width: 375px;
  --game-play-height: 667px;
  --game-play-component-height: 50px;
}

.overlay {
  /* 遮罩样式，可以根据需要调整透明度和颜色 */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色遮罩 */
  z-index: 9997; /* 低于 iframe 的 z-index，使其在 iframe 后面 */
}

.game-play-box {
  /* iframe 的容器，可以根据需要调整位置和大小 */
  position: absolute;
  top: 0;
  left: 0;
  width: var(--game-play-width);
  height: calc(var(--game-play-height) + var(--game-play-component-height));
}

.game-play-component {
  display: flex;
  align-items: center;
  position: relative;
  background-color: rgb(255, 248, 215);
  top: calc(var(--game-play-component-height) * -1 / 2);
  width: var(--game-play-width);
  height: var(--game-play-component-height);
  z-index: 9998;
}

.game-play-close-button {
  position: absolute;
  right: 2.5%;
  cursor: pointer;
}

.game-play-reload-button {
  position: absolute;
  left: 45%;
  cursor: pointer;
}

.game-play-orientation-button {
  position: absolute;
  left: 2.5%;
  cursor: pointer;
}

.search-button:hover {
  background-color: #41b883;
  transform: scale(1.1);
}

.interaction-icon:hover {
  color: #41b883;
  transform: scale(1.1);
}

.content {
  /* 其他内容的样式，可以根据需要调整 */
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1em;
  height: 100%; /* 让内容占据 main 的整个高度 */
}

.game-play {
  /* 可以根据需要调整宽度和高度 */
  width: var(--game-play-width);
  height: var(--game-play-height);
  z-index: 9999; /* 确保 iframe 在最上层 */
}

@media (max-width: 768px) {
  /* 在移动端，设置 iframe 覆盖整个窗口 */
  .game-play {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .content {
    display: none; /* 移动端隐藏其他内容 */
  }
}

@media (min-width: 769px) {
  /* 在桌面端，居中显示 iframe */
  .game-play {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
