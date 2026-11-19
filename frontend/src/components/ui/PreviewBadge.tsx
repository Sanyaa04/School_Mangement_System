/**
 * @file PreviewBadge.tsx
 * @description Small "Preview" pill for pages that still run on sample data (no backend yet),
 * so demo data is never mistaken for live school records.
 */

import React from 'react';
import { FlaskConical } from 'lucide-react';
import { Badge } from './Badge';

export const PreviewBadge: React.FC<{ title?: string }> = ({
  title = 'Preview — this page uses sample data and is not saved to the server yet.',
}) => (
  <Badge variant="amber" size="sm" title={title} aria-label={title} className="uppercase tracking-wider font-bold">
    <FlaskConical className="w-3 h-3" aria-hidden="true" />
    Preview
  </Badge>
);
