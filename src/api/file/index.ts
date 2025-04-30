import request from '/@/utils/http';

/**
 * 文件相关的 API 接口集合
 * @methods readFilePath 获取目录下的文件列表
 */
export function useFileApi() {
  return {
    // 获取目录下的文件列表
    readFilePath: (filePath: string) => {
      return request({
        url: '/dir',
        method: 'post',
        data: { 'fileName': filePath },
      });
    },
  };
}
