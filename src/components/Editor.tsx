import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

import { FileItem, setFiles } from "../store/files";
import { useDispatch } from "react-redux";
import { useMemo } from "react";
import { useFiles } from "../hook";
import { SwitchFile } from "./SwitchFile";

const defaultContent = {
  js: `const hi = (name)=>{
  console.log("hello!" + name);
};

hi("李明");`,
  json: `{
    "name": "李明",
    "age": 30,
}`,
  ts: `const hi = (name: string)=>{
  console.log("hello!" + name);
};

hi("李明");`,
  txt: `这是一个txt文本文件`,
} as { [key in string]: string };

// 编辑器
export const Editor = ({ showList }: { showList: FileItem[] }) => {
  const { selectID } = useFiles();
  const dispatch = useDispatch();

  const selectItem = useMemo(() => showList.find(item => item?.id === selectID), [selectID, showList]);
  const fileType = selectItem?.name?.split(".").pop() || "";
  const isShow = useMemo(() => Object.keys(defaultContent).includes(fileType), [fileType]);

  const onChange = (newValue: string) => dispatch(setFiles({ path: selectItem?.path, prop: "content", val: newValue }));
  const value = useMemo(() => {
    if (isShow) return selectItem?.content === undefined ? defaultContent[fileType] : selectItem?.content
    else return selectItem ? "内容不可查看" : "请选择文件";
  }, [isShow, selectItem, fileType])

  return (
    <div id="content">
      <SwitchFile showList={showList} />
      <AceEditor
        mode="javascript"
        theme="monokai"
        width="calc(100vw - 210px)"
        height={`calc(100vh - ${selectItem ? "40" : "0"}px)`}
        value={value}
        onChange={onChange}
        readOnly={!isShow}
        tabSize={2}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
      />
    </div>
  );
}