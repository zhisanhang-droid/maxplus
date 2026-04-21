<template>
  <div class="image-uploader">
    <div v-if="modelValue" class="image-uploader__preview">
      <img :src="modelValue" alt="preview" class="image-uploader__img" />
      <el-button size="small" type="danger" plain style="width:100%;margin-top:6px" @click="emit('update:modelValue', '')">
        删除
      </el-button>
    </div>

    <div v-else class="image-uploader__trigger" :class="{ 'is-uploading': uploading }" @click="triggerInput">
      <el-icon v-if="!uploading" style="font-size:24px;color:#c0c4cc"><Plus /></el-icon>
      <el-icon v-else class="is-loading" style="font-size:24px;color:#409eff"><Loading /></el-icon>
      <span style="font-size:13px;color:#909399">{{ uploading ? '上传中...' : '点击上传图片' }}</span>
      <span style="font-size:11px;color:#c0c4cc">JPG / PNG / WebP，最大 5MB</span>
      <input
        ref="inputRef"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        style="display:none"
        @change="handleFileChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
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
const inputRef = ref<HTMLInputElement | null>(null);

function triggerInput() {
  if (!uploading.value) {
    inputRef.value?.click();
  }
}

async function handleFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!inputRef.value) return;
  inputRef.value.value = "";

  if (!file) return;

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    ElMessage.error("只支持 JPG、PNG、WebP、GIF 格式");
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error("图片不能超过 5MB");
    return;
  }

  uploading.value = true;

  try {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch(`${API_BASE_URL}/admin/upload`, {
      method: "POST",
      headers: {
        Authorization: props.token ? `Bearer ${props.token}` : ""
      },
      body: form
    });

    const data = await res.json();

    if (data.success && data.data?.url) {
      emit("update:modelValue", data.data.url);
      ElMessage.success("上传成功");
    } else {
      ElMessage.error(data.message || "上传失败");
    }
  } catch {
    ElMessage.error("上传失败，请检查网络后重试");
  } finally {
    uploading.value = false;
  }
}
</script>

<style scoped>
.image-uploader__preview {
  display: inline-flex;
  flex-direction: column;
}
.image-uploader__img {
  width: 160px;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #dcdfe6;
  display: block;
}
.image-uploader__trigger {
  width: 160px;
  height: 120px;
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: border-color 0.2s;
}
.image-uploader__trigger:hover {
  border-color: #409eff;
}
.image-uploader__trigger.is-uploading {
  cursor: not-allowed;
}
</style>
