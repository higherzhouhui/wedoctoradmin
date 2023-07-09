import type { IDomEditor, IEditorConfig } from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import type { FC } from 'react';
import React, { memo, useEffect, useState } from 'react';

import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { request } from 'umi';
interface EditorInterface {
  onChange: (str: string) => void;
  description: string;
}
const WangEditor: FC<EditorInterface> = memo(({ onChange, description }) => {
  const [editor, setEditor] = useState<IDomEditor | null>(null); // 存储 editor 实例
  const [html, setHtml] = useState(''); // 编辑器内容

  useEffect(() => {
    if (description) {
      setHtml(description);
    }
  }, [description]);

  useEffect(() => {
    if (html) {
      onChange(html);
    }
  }, [html]);

  const toolbarConfig = {};
  const editorConfig: Partial<IEditorConfig> | any = {
    placeholder: '请输入内容...',
    MENU_CONF: {},
  };
  editorConfig.MENU_CONF.uploadImage = {
    // 自定义上传
    async customUpload(file: File, insertFn: any) {
      // file 即选中的文件
      // 自己实现上传，并得到图片 url alt href
      // const url: string = await uploadToAliOss(file);
      const formData = new FormData();
      formData.append('file', file);
      request('/upload-service/upload/uploadImage', { method: 'POST', data: formData }).then((res) => {
        insertFn(res.data, file.name, res.data);
      })
      // 最后插入图片
    },
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <>
      <div
        style={{
          border: '1px solid #ccc',
          zIndex: 100,
          marginBottom: 20,
          maxHeight: 'calc(100% - 60px)',
          minHeight: '500px',
          overflow: 'auto',
        }}
      >
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: '1px solid #ccc' }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={(edite: any) => setHtml(edite.getHtml())}
          mode="default"
        />
      </div>
    </>
  );
});

export default WangEditor;