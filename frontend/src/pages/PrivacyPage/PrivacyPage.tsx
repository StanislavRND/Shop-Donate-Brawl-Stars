import { LegalDocument } from '@/shared/ui/LegalDocument/LegalDocument';

import {
  PRIVACY_SECTIONS,
  PRIVACY_TITLE,
  PRIVACY_UPDATED_AT,
} from './constants';

export const PrivacyPage = () => {
  return (
    <main id="content">
      <LegalDocument
        title={PRIVACY_TITLE}
        updatedAt={PRIVACY_UPDATED_AT}
        sections={PRIVACY_SECTIONS}
      />
    </main>
  );
};
