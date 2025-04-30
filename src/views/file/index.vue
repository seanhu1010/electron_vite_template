<template>
  <div class="file-container">
    <div class="mb-4">
      <el-button type="primary" size="large" @click="onOpenFileBtnClick">
        <el-icon>
          <Folder />
        </el-icon>Open Folder
      </el-button>
    </div>
    <div class="mb-4">
      <el-table v-if="fileInfo.path" :data="fileInfo.info" style="width: 100%">
        <el-table-column prop="name" label="Name" min-width="180" show-overflow-tooltip>
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-icon v-if="scope.row.type == 'directory'">
                <Folder />
              </el-icon>
              <el-icon v-if="scope.row.type == 'file'">
                <Document />
              </el-icon>
              <span style="margin-left: 10px">{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="Size" min-width="100" />
        <el-table-column prop="created" label="Created" min-width="180" show-overflow-tooltip />
        <el-table-column prop="modified" label="Modified" min-width="180" show-overflow-tooltip />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { useFileApi } from "/@/api/file"; // 引入文件 API
import { Folder, Document } from '@element-plus/icons-vue'; // 导入图标组件

// 定义返回的文件信息
const fileInfo = ref({ path: '', info: [] });

// 引入 API 方法
const { readFilePath } = useFileApi();

async function onOpenFileBtnClick() {
  try {
    // 调用 Electron 的 openFile 方法，打开文件夹对话框
    const filePath = await window.ipcRenderer.invoke('dialog:openFile');

    console.log('filePath', filePath)

    if (filePath) {
      // 调用接口获取文件夹内容
      const response = await readFilePath(filePath);
      fileInfo.value = {
        path: filePath,
        info: response.fileInfo || [],
      };
    }
  } catch (error) {
    ElMessage.error("Failed to open folder or fetch file data");
  }
}
</script>
