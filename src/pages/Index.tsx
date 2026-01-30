import { Toolbar } from '@/toolbar';
import { PipelineUI } from '@/ui';
import { SubmitButton } from '@/submit';
import '@/App.css';

const Index = () => {
  return (
    <div className="app-layout">
      <Toolbar />
      <div className="main-content">
        <div className="header-bar">
          <SubmitButton />
        </div>
        <PipelineUI />
      </div>
    </div>
  );
};

export default Index;
