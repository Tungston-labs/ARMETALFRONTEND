export const printElement = (element) => {
  if (!element) return;

  const WinPrint = window.open("", "", "width=1400,height=1000");
  // Clone the element so we can modify it safely
  const clonedElement = element.cloneNode(true);

  // Fix all image paths to absolute URLs
  const images = clonedElement.querySelectorAll("img");
  images.forEach((img) => {
    if (img.src && img.src.startsWith("/")) {
      img.src = window.location.origin + img.getAttribute("src");
    }
  });

  const styles = Array.from(
    document.querySelectorAll('style, link[rel="stylesheet"]')
  )
    .map((node) => node.outerHTML)
    .join("\n");

  WinPrint.document.write(`
    <html>
      <head>
        <title>Payroll</title>

        <!-- FIX: Base URL -->
        <base href="${window.location.origin}/" />

        ${styles}

        <style>
          @media print {
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            .no-print {
              display: none !important;
            }

            table, th, td {
              page-break-inside: avoid;
              border-collapse: collapse;
            }

            .net-pay td {
              font-weight: bold;
              border: 1px solid #000;
            }
          }

          body {
            padding: 20px;
            font-family: Arial, sans-serif;
          }
            table {
  width: 100% !important;
  border-collapse: collapse !important;
  table-layout: fixed !important;
}
        </style>
      </head>
      <body>
        ${clonedElement.outerHTML}

        <div style="margin-top:50px; display:flex; justify-content:space-between; font-size:12px;">
          <div>Generated on: ${new Date().toLocaleDateString()}</div>
          <div>Authorized Signature</div>
        </div>
      </body>
    </html>
  `);

  WinPrint.document.close();
  WinPrint.focus();

  setTimeout(() => {
    WinPrint.print();
    WinPrint.close();
  }, 500);
};