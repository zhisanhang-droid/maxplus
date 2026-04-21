<template>
  <div class="image-uploader">
    <div v-if="modelValue" class="image-uploader__preview">
      <img :src="modelValue" alt="preview" class="image-uploader__img" />
      <el-button size="small" type="danger" plain class="image-uploader__remove" @click="handleRemove">
        删除
      </el-button>
    </div>
    <el-upload
      v-else
      class="image-uploader__area"
      :action="uploadUrl"
      :headers="headers"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      accept="image/jpeg,image/png,image/webp,image/gif"
      name="file"
    >
      <div class="image-uploader__trigger">
        <el-icon v-if="!uploading" class="image-uploader__icon"><Plus /></el-icon>
        <el-icon v-else class="is-loading"><Loading /></el-icon>
        <span class="image-uploader__tip">{{ uploading ? '上传中...' : '点击上传图片' }}</span>
        <span class="image-uploader__sub">JPG / PNG / WebP，最大 5MB</span>
      </div>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Plus, Loading } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { API_BASE_URL } from "../../services/config";

const props = defineProps<{
  modelValue: string;
  token: string | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const uploading = ref(false);

const uploadUrl = computed(() => `${API_BASE_URL}/admin/upload`);

const headers = computed(() => ({
  Authorization: props.token ? `Bearer ${props.token}` : ""
}));

function beforeUpload(file: File) {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    ElMessage.error("只支持 JPG、PNG、WebP、GIF 格式");
    return false;
  }
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error("图片不能超过 5MB");
    return false;
  }
  uploading.value = true;
  return true;
}

function handleSuccess(response: { success: boolean; data: { url: string }; message: string }) {
  uploading.value = false;
  if (response.success && response.data?.url) {
    emit("update:modelValue", response.data.url);
    ElMessage.success("上传成功");
  } else {
    ElMessage.error(response.message || "上传失败");
  }
}

function handleError() {
  uploading.value = false;
  ElMessage.error("上传失败，请重试");
}

function handleRemove() {
  emit("update:modelValue", "");
}
</script>

<style scoped>
.image-uploader__preview {
  position: relative;
  display: inline-block;
}
.image-uploader__img {
  width: 160px;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #dcdfe6;
  display: block;
}
.image-uploader__remove {
  margin-top: 6px;
  width: 100%;
}
.image-uploader__area :deep(.el-upload) {
  width: 160px;
  height: 120px;
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  transition: border-color 0.2s;
}
.image-uploader__area :deep(.el-upload:hover) {
  border-color: #409eff;
}
.image-uploader__trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 4px;
  color: #909399;
}
.image-uploader__icon {
  font-size: 24px;
  color: #c0c4cc;
}
.image-uploader__tip {
  font-size: 13px;
}
.image-uploader__sub {
  font-size: 11px;
  color: #c0c4cc;
}
</style>
