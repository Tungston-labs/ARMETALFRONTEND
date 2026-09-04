export const generateInvoiceHTML = (entry, companyName = "Company") => `
<div class="invoice-container" id="invoice-render">

  <div class="invoice-header">
  
    <div class="brand-text">
      <span class="brand-name">${companyName}</span>
      <span class="brand-sub">Payroll & Payments</span>
    </div>
  </div>

  <div class="blue-line"></div>

  <div class="invoice-title">INVOICE</div>

  <div class="invoice-top">
    <div class="invoice-left">
      <div class="section-heading">TO</div>
      <p class="bold">${companyName}</p>
      <p>${entry.company_address || ""}</p>
      <p>${entry.company_phone ? "Phone number: " + entry.company_phone : ""}</p>
    </div>

    <div class="invoice-right">
      <div class="section-heading">Invoice Details</div>
      <p>Invoice no: INV-${entry.id}</p>
      <p>Date: ${entry.paid_date || "-"}</p>
      <p>Year: ${entry.year}</p>
    </div>
  </div>

  <div class="section-heading" style="margin-top:24px;">DESCRIPTION</div>

  <table>
    <thead>
      <tr>
        <th class="col-sl">SL.NO</th>
        <th class="col-desc">DESCRIPTION</th>
        <th class="col-price">MONTH</th>
        <th class="col-total">TOTAL</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="col-sl">1</td>
        <td class="col-desc">HR App monthly subscription charge </td>
        <td class="col-price">${entry.month_display}</td>
        <td class="col-total">${entry.currency} ${entry.amount}</td>
      </tr>
      <tr class="total-row">
        <td colspan="3" class="grand-total-label">GRAND TOTAL</td>
        <td class="col-total"><strong>${entry.currency} ${entry.amount}</strong></td>
      </tr>
    </tbody>
  </table>

  <div class="notes">
    <div class="section-heading">NOTES</div>
    <ol>
      <li>Subscription charges are non-refundable.</li>
      <li>Payment confirms acceptance of our terms.</li>
      <li>Thank you for choosing our services.</li>
    </ol>
  </div>

  <div class="bank-details">
    <div class="section-heading">BANK DETAILS</div>
    <p>Account holder: TUNGSTON LABS</p>
    <p>Account number: XXXXXXXXXXXX</p>
    <p>IFSC: FDRL0000000</p>
    <p>Bank address: FEDERAL BANK KAKKANAD</p>
  </div>

  <div class="invoice-footer">
    <span>📞 +91 9778377526</span>
    <span>✉️ info@tungstonlabs.com</span>
    <span>📍 Kakkanad, Kochi</span>
  </div>

</div>
`;

export const invoiceStyles = `
  * { box-sizing: border-box; }
  body { font-family: 'Satoshi', Arial, sans-serif; margin: 0; background: #fff; }

  .invoice-container {
    width: 700px;
    padding: 40px;
    border: 2px solid #1e3a8a;
    border-radius: 10px;
    color: #222;
  }

  .invoice-header {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .logo-box {
    background: #182657;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 70px;
    height: 70px;
    border-radius: 10px;
    flex-shrink: 0;
  }

  .invoice-logo { width: 30px; height: 30px; object-fit: contain; }

  .brand-text { display: flex; flex-direction: column; }

  .brand-name {
    font-weight: 700;
    font-size: 1.3rem;
    color: #3352BA;
  }

  .brand-sub {
    font-size: 0.85rem;
    color: #3352BA;
  }

  .blue-line {
    border-bottom: 3px solid #1e3a8a;
    margin: 16px 0 20px;
  }

  .invoice-title {
    text-align: center;
    color: #1e3a8a;
    font-size: 26px;
    font-weight: bold;
    letter-spacing: 2px;
    margin-bottom: 24px;
  }

  .invoice-top {
    display: flex;
    justify-content: space-between;
    gap: 20px;
  }

  .invoice-left, .invoice-right { flex: 1; }
  .invoice-right { text-align: right; }

  .section-heading {
    color: #1e3a8a;
    font-weight: bold;
    font-size: 13px;
    margin-bottom: 6px;
    letter-spacing: 0.5px;
  }

  .bold { font-weight: bold; }
  p { margin: 2px 0; font-size: 13px; color: #333; }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    table-layout: fixed;
  }

  th {
    background: #1e3a8a;
    color: #fff;
    padding: 10px;
    font-size: 12px;
    text-align: center;
  }

  td {
    border: 1px solid #ccc;
    padding: 14px 10px;
    font-size: 13px;
    text-align: center;
    vertical-align: top;
    background: #FBFFF9;
  }

  .col-sl, .col-price, .col-total { width: 90px; }

  .grand-total-label {
    text-align: right;
    color: #1e3a8a;
    font-weight: bold;
    border: none;
    padding-right: 20px;
    background: #fff;
  }

  .total-row td { border-top: 2px solid #1e3a8a; }

  .notes, .bank-details { margin-top: 28px; }
  .notes ol { margin: 6px 0 0 18px; padding: 0; font-size: 13px; }
  .notes li { margin-bottom: 4px; }
  .bank-details p { font-size: 13px; }

  .invoice-footer {
    margin-top: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #182657;
    color: #fff;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 12px;
    gap: 12px;
  }
`;