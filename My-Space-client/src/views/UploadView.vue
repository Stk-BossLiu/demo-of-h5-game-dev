<script setup lang="ts">
import { ref } from 'vue'
import { userAuthenticate, uploadFile, uploadInfoSubmit } from '@/api/home'
import { UploadFilled } from '@element-plus/icons-vue'
import { type UploadProps, type UploadUserFile, ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'

const dateFormat = function (): string {
  var myDate = new Date()
  var time = {
    y: myDate.getFullYear(),
    m: myDate.getMonth() + 1,
    d: myDate.getDate()
  }
  return time.y + '-' + time.m + '-' + time.d
}

const uploadInfo = ref({
  name: '',
  category: '',
  authorName: 'Stk',
  folder: '',
  uploadingDate: dateFormat(),
  url: '/playables/',
  image: ''
})
const playableNames = ref(['bta', 'iv', 'ma', 'bs', 'cob', 'tb', 'nnpb', 'trm'])
const password = ref('')
const isHideLoading = ref<boolean>(true)
let file: File | null = null
const previewImage = ref()
const image = ref<UploadUserFile>({
  name: '',
  url: ''
})
const getFile = function (event: any) {
  file = event.target.files[0]
}

const fileUpload = async function (file: File): Promise<boolean> {
  let status = true
  let suffix = file.name.split('.')[1]
  let fileName = uploadInfo.value.name + '.' + suffix
  console.log(fileName)
  const formData = new FormData()
  formData.append('file', file, fileName)
  await uploadFile(formData).then((res) => {
    if (res.data.code) {
      ElMessage.error(res.data.msg)
      status = false
    }
  })
  return status
}

const onSubmitBtn = async function () {
  isHideLoading.value = false
  if (uploadInfo.value.name == '') {
    ElMessage.warning('缺少参数')
    isHideLoading.value = true
    return
  }
  if (uploadInfo.value.category == '') {
    ElMessage.warning('缺少参数')
    isHideLoading.value = true
    return
  }
  if (!file) {
    ElMessage.warning('缺少参数')
    isHideLoading.value = true
    return
  }
  if (password.value == '') {
    ElMessage.warning('缺少参数')
    isHideLoading.value = true
    return
  }
  let status: boolean = true
  // 密码校验
  await userAuthenticate({ password: password.value }).then((res) => {
    const code: number = res.code
    const msg = res.msg
    if (code) {
      ElMessage.error(code + ':' + msg)
      status = false
    }
  })
  if (!status) {
    return
  }
  // 上传信息
  uploadInfo.value.image =
    './assets/images/' + uploadInfo.value.name + '.' + image.value.name.split('.')[1]
  uploadInfo.value.url += uploadInfo.value.folder + '/' + uploadInfo.value.name
  await uploadInfoSubmit(uploadInfo.value).then((res) => {
    if (res.code) {
      ElMessage.error(res.code + ':' + res.msg)
      status = false
    }
  })
  if (!status) {
    return
  }
  // 上传图片
  const img: File = previewImage.value[0].raw
  await fileUpload(img).then((res) => {
    if (!res) {
      status = false
    }
  })
  if (!status) {
    return
  }

  file &&
    (await fileUpload(file).then((res) => {
      if (!res) {
        status = false
      } else {
        isHideLoading.value = true
        ElMessage.success('上传成功')
      }
    }))
  if (!status) {
    return
  }
}

const handleChange: UploadProps['onChange'] = (file, files) => {
  if (file) {
    image.value.name = file.name
    image.value.url = './assets/images/' + file.name
  } else {
    image.value.name = ''
    image.value.url = ''
  }
}
</script>
<template>
  <main>
    <form class="main" id="form" novalidate="true" style="max-width: 480px; margin: 40px auto">
      <div id="forminner">
        <div class="row">
          <div class="col sl2">
            <h5 class="center-align teal-text">Upload Demo to my Space</h5>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input
              type="text"
              id="name"
              name="Name"
              class="validate"
              required="true"
              aria-required="true"
              v-model="uploadInfo.name"
            />
            <label for="name">Name</label>
          </div>
          <div class="input-field col s12">
            <input
              type="text"
              id="category"
              name="Category"
              class="validate"
              required="true"
              aria-required="true"
              v-model="uploadInfo.category"
            />
            <label for="Category">Category</label>
          </div>
          <div class="col s12">
            <el-select
              popper-class="popDown"
              v-model="uploadInfo.folder"
              placeholder="选择Playabel类别"
              style="width: 100%"
            >
              <el-option
                v-for="name in playableNames"
                :key="name"
                :label="name"
                :value="name"
                style="text-align: center"
              >
              </el-option>
            </el-select>
          </div>
          <div class="file-field input-field col s12">
            <div class="btn">
              <span>Demo File</span>
              <input id="files" type="file" accept=".html" @change="getFile($event)" />
            </div>
            <div class="file-path-wrapper">
              <input class="file-path validate" type="text" placeholder="在这上传Demo.html" />
            </div>
          </div>
          <div class="file-field input-field col s12">
            <div class="image-upload">
              <el-upload
                class="upload-zone"
                drag
                action=""
                accept="image/*"
                v-model:file-list="previewImage"
                :auto-upload="false"
                :limit="1"
                :on-change="handleChange"
              >
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">预览图上传</div>
              </el-upload>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <input
                type="password"
                id="password"
                name="Password"
                class="validate"
                required="true"
                aria-required="true"
                v-model="password"
              />
              <label for="password">Password</label>
            </div>
          </div>
          <div class="row">
            <div class="submit-box input-field col s12">
              <button
                class="waves-effect waves-light btn submit-btn"
                type="submit"
                @click.prevent="onSubmitBtn"
              >
                <el-icon class="is-loading" :hidden="isHideLoading"><Loading /></el-icon>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </main>
</template>
<style scoped>
@import '../assets/upload.css';
#credit {
  display: none;
}
.btn {
  background-color: #41b883;
  display: flex;
  align-items: center;
}
.submit-box.input-field.col.s12 {
  margin-top: 50px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.selector {
  width: 200px;
}
</style>

<style>
.el-upload-dragger {
  border-width: 0.3cap;
}
.el-upload-dragger:hover {
  border-color: #41b883;
}
.el-input__icon {
  line-height: 64px;
}
.el-input__inner {
  text-align: center;
}
.popDown {
  border-radius: 4px;
  box-sizing: border-box;
  margin: 5px 0;
}
.el-select-dropdown__item {
  align-items: center;
  justify-content: center;
  color: #5c5c5c;
}
.el-select-dropdown__item.hover {
  background: #41b883;
  color: #fff;
}

.popper__arrow::after {
  border-bottom-color: #41b883 !important;
}
</style>
