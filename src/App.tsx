import { useMemo } from 'react';
import './App.css';
import { ContextMenu } from './componets/ContextMenu';
import { Editor } from './componets/Editor';
import { Files, Sidebar } from './componets/Sidebar';
import { useFiles } from './hook';
import { FileItem } from './reducers/fileReducer';

function App() {
  const { files } = useFiles()

  //生成文件夹和文件树
  const { filesList, showList } = useMemo(() => {
    const showList: FileItem[] = []
    if (files.length === 0) return { filesList: null, showList: [] };

    const getData: any = (items: FileItem[], size: number, path: number[]) => {
      return items?.map((item: FileItem, i) => {
        if (item?.active && item?.type === "file") showList.push(item);
        return (
          <div key={`${item?.type}-${i}`}>
            <Files file={item} tabSize={size + 2} path={[...path, i]} />
            {item?.children?.length > 0 && item?.active && getData(item?.children, size + 2, [...path, i])}
          </div>
        )
      })
    }
    const data = getData(files, -2, []);

    return { filesList: data, showList }
  }, [files])

  return (
    <div className="App">
      <Sidebar filesList={filesList} />
      <Editor showList={showList} />
      <ContextMenu />
    </div>
  );
}

export default App;
