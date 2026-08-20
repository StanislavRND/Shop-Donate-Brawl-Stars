import { LegalDocument } from '@/shared/ui/LegalDocument/LegalDocument';

import { TERMS_SECTIONS, TERMS_TITLE, TERMS_UPDATED_AT } from './constants';

export const TermsPage = () => {
  return (
    <main id="content">
      <LegalDocument
        title={TERMS_TITLE}
        updatedAt={TERMS_UPDATED_AT}
        sections={TERMS_SECTIONS}
      />
    </main>
  );
};
