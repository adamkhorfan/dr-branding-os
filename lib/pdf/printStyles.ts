export const PRINT_STYLES = `
  @media print {
    body * { visibility: hidden; }
    .printable, .printable * { visibility: visible; }
    .printable { position: absolute; left: 0; top: 0; width: 100%; }
    .no-print { display: none !important; }
  }
`;
