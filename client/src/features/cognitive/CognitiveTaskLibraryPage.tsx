import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PortalPageHeader } from '../patient/portal/ui';
import { TaskLibraryView } from './TaskLibraryView';

export const CognitiveTaskLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-5">
      <PortalPageHeader
        eyebrow="Cognitive assessment · Task library"
        title="32 activities across eight thinking domains"
        description="Every activity is an interactive, scored prototype. Research-stage labels and accessibility requirements are shown for each one."
      />
      <TaskLibraryView onStart={() => navigate('/patient/cognitive')} />
    </div>
  );
};
