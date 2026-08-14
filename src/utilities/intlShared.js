import React from 'react';

let boldId = 0;

export const bold = (chunks) => <b key={`b-${chunks.length}-${boldId++}}`}>{chunks}</b>;
