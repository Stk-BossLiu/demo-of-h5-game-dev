<script setup lang="ts">
import { getCardImage, userAuthenticate, removeCardInServer } from '@/api/home'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'

const props = defineProps({
  cardInfo: {
    type: Object,
    required: false,
    default() {
      return {
        id: 0,
        category: 'UNKONWN',
        name: 'Game Title',
        authorName: 'Author Name',
        uploadingDate: '2021-10-10',
        url: '/playables/bta/BTA_iOS_Applovin_SantaSnow_PA_20231213.html',
        imageUrl: '/playables/bta/BTA_iOS_Applovin_SantaSnow_PA_20231213.png'
      }
    }
  }
})

const emit = defineEmits(['transfer'])

const cardImage = ref('')

onMounted(() => {
  try {
    getCardImage({ id: props.cardInfo.key.id }).then((res) => {
      if (!res) {
        cardImage.value = 'https://via.placeholder.com/178x130'
        return
      }
      cardImage.value = res
    })
  } catch (e) {
    cardImage.value = 'https://via.placeholder.com/178x130'
  }
})
function jump2Game() {
  // 从服务端获取游戏的url
  const src = './' + props.cardInfo.key.url + '.html'
  emit('transfer', src)
}

function removeCard() {
  // 弹出密码框
  const password = prompt('请输入密码')
  console.log(password)
  userAuthenticate({ password: password }).then((res) => {
    const code: number = res.code
    const msg = res.msg
    if (code) {
      ElMessage.error(code + ':' + msg)
      return
    }
    removeCardInServer({
      id: props.cardInfo.key.id,
      imageUrl: props.cardInfo.key.imageUrl,
      playableUrl: props.cardInfo.key.url
    }).then((res: any) => {
      const code: number = res.code
      const msg = res.msg
      if (code) {
        ElMessage.error(code + ':' + msg)
        return
      }
      ElMessage.success('删除成功')
      emit('transfer', 'refresh')
    })
  })
}
</script>

<template>
  <div class="game-preview-card">
    <div
      class="card-image"
      :style="{ 'background-image': `url(${cardImage})` }"
      @click="jump2Game"
    ></div>
    <div class="category">{{ props.cardInfo.key.category }}</div>
    <div class="heading-text">
      {{ props.cardInfo.key.name }}
      <div class="author">
        by
        <span class="author-name">{{ props.cardInfo.key.authorName }}</span>
        {{ props.cardInfo.key.uploadingDate }}
      </div>
    </div>
    <div class="option" @click="removeCard"><i-carbon-delete /></div>
  </div>
</template>

<style scoped>
.game-preview-card {
  width: 190px;
  background: rgb(236, 236, 236);
  padding: 0.4em;
  border-radius: 6px;
}
.game-preview-card:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
}
.card-image {
  width: 100%;
  height: 130px;
  border-radius: 6px 6px 0 0;
}
.card-image:hover {
  transform: scale(0.98);
}
.option {
  float: right;
  margin-top: -25px;
  margin-right: 0px;
  color: red;
}
.category {
  text-transform: uppercase;
  font-size: 0.7em;
  font-weight: 600;
  color: rgb(63, 121, 230);
  padding: 10px 7px 0;
}
.category:hover {
  text-decoration: underline;
  cursor: pointer;
}
.heading-text {
  font-weight: 600;
  color: rgb(88, 87, 87);
  padding: 7px;
}
.heading-text:hover {
  cursor: pointer;
}
.author {
  color: gray;
  font-weight: 400;
  font-size: 11px;
  padding-top: 20px;
}
.author-name {
  font-weight: 600;
}
.name:hover {
  cursor: pointer;
}
</style>
