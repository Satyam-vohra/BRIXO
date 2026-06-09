import React, { useState, useContext } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BuilderProvider, BuilderContext } from './context/BuilderContext';
import AppHeader from './components/layout/AppHeader';
import LeftPanel from './components/layout/LeftPanel';
import Canvas from './components/layout/Canvas';
import RightPanel from './components/layout/RightPanel';
import PublishModal from './components/ui/PublishModal';

function BuilderApp() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { canvasBlocks, colorPalette, fontStyle } = useContext(BuilderContext);

  return (
    <div className="flex flex-col h-screen w-screen bg-brand-canvas overflow-hidden">
      {/* Upper header controls */}
      <AppHeader onPublishClick={() => setIsModalOpen(true)} />
      
      {/* 3 Panel Core Area */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        <LeftPanel />
        <Canvas />
        <RightPanel />
      </div>

      {/* Publish completion dialog overlay */}
      <PublishModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        canvasBlocks={canvasBlocks}
        colorPalette={colorPalette}
        fontStyle={fontStyle}
      />
    </div>
  );
}

export default function App() {
  return (
    <BuilderProvider>
      <DndProvider backend={HTML5Backend}>
        <BuilderApp />
      </DndProvider>
    </BuilderProvider>
  );
}
