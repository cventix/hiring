import { createContext, Dispatch, SetStateAction, useState } from 'react';

interface IWorkspaceContext {
  workspace: string;
  setWorkspace: Dispatch<SetStateAction<string>>;
}

export const WorkspaceContext = createContext<IWorkspaceContext>({
  workspace: '',
  setWorkspace: () => {},
});

const WorkspaceContextWrapper: React.FC = ({ children }) => {
  const [workspace, setWorkspace] = useState<string>('');

  return (
    <WorkspaceContext.Provider value={{ workspace, setWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export default WorkspaceContextWrapper;
