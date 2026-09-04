import emailjs from '@emailjs/browser'; // Use this for Vite

import { generateInvoiceHTML } from '../utlis/invoiceGenerator'; // adjust path as needed

export const sendInvoiceEmail = async (entry, toEmail, companyName = "Your Company Name") => {
const invoiceHtml = generateInvoiceHTML(entry, companyName);

  console.log('------------',entry);
  

  const templateParams = {
    to_email: toEmail,
    company_name: companyName,
    invoice_date: new Date().toLocaleDateString(),
    month: entry.month_display,
    year: entry.year,
    amount: entry.amount,
    status: entry.status,
    paid_date: entry.paid_date,
    currency: entry.currency
  };
  console.log("✅ Sending templateParams:", templateParams);

  

  try {
    const response = await emailjs.send(
      'service_tfb6mdh',
      'template_xzlubi8',
      templateParams,
      'wJYPZOGHsxr8loRuC'
    );
    console.log('✅ Email sent:', response.status, response.text);
  } catch (error) {
    console.error('❌ Email sending error:', error);
  }
};
