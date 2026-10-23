import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import { getEmployeeById, fetchAllBankPaymentsThunk, submitBankPayment }
 from "../../../Redux/employeeSlice";
import SyncLoader from "../../../Components/Loader/Loder";
import ViewBasicLayout from "../layout/ViewLayout";
import ViewTableBank from "./ViewTableBank";
import { Section } from "./ViewBankpayment.Styles";
import {
  getBankSubmissionDefaults,
  isIndiaCompany,
  isUaeCompany,
} from "../../../utils/employeeCountryFields";

const ViewBankPayment = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { employeeDetail, employeeBankPayments, loading } = useSelector(
    (state) => state.employees
  );

  const [bankProofImage, setBankProofImage] = useState(null);
  const [bankName, setBankName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [uanNumber, setUanNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [taxRegime, setTaxRegime] = useState("");
  const [tdsAmount, setTdsAmount] = useState("");
  const [declaration80C, setDeclaration80C] = useState("");
  const [basicSalary, setBasicSalary] = useState("");
  const [salaryIncrement, setSalaryIncrement] = useState("");
  const [housingAllowance, setHousingAllowance] = useState("");
  const [transportation, setTransportation] = useState("");
  const [errors, setErrors] = useState({});

  const user =
    JSON.parse(localStorage.getItem("user") || "null") ||
    JSON.parse(sessionStorage.getItem("user") || "null");
  const country = employeeDetail?.company?.country || user?.company?.country || "IN";

  // Fetch employee details and bank payments
  useEffect(() => {
    dispatch(getEmployeeById(id));
    dispatch(fetchAllBankPaymentsThunk(id));
  }, [id, dispatch]);

  // Populate form fields with latest bank payment
  useEffect(() => {
    const latest = employeeBankPayments?.results?.[0];
    if (!latest) return;

    setBankName(latest.bank_name || "");
    setAccountNumber(latest.account_number || "");
    setUanNumber(latest.uan_epf_number || "");
    setPanNumber(latest.pan_number || "");
    setTaxRegime(latest.tax_regime || "");
    setTdsAmount(latest.tds_deduction_amount || "");
    setDeclaration80C(String(latest.declaration_80c) || "");
    setBasicSalary(latest.basic_salary || "");
    setSalaryIncrement(latest.salary_increment || "");
    setHousingAllowance(latest.housing_allowance || "");
    setTransportation(latest.transportation || "");

    // ✅ Handle IFSC/Swift properly
    if (isIndiaCompany(country)) {
      setIfscCode(latest.swift_code || ""); // IFSC stored in swift_code
      setSwiftCode("");
    } else {
      setSwiftCode(latest.swift_code || "");
      setIfscCode("");
    }
  }, [employeeBankPayments, country]);

  const handleSave = () => {
    const existingPayment = employeeBankPayments?.results?.[0];
    const existingPaymentId = existingPayment?.id || null;
    const newErrors = {};

    if (!bankName) newErrors.bankName = "Bank Name is required";
    if (!accountNumber) newErrors.accountNumber = "Account Number is required";
    if (!basicSalary) newErrors.basicSalary = "Basic Salary is required";

    if (isIndiaCompany(country)) {
      if (!ifscCode.trim()) newErrors.ifscCode = "IFSC Code is required";
      else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode.trim().toUpperCase())) {
        newErrors.ifscCode = "Enter a valid IFSC Code";
      }

      if (!panNumber.trim()) newErrors.panNumber = "PAN Number is required";
      else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panNumber.trim().toUpperCase())) {
        newErrors.panNumber = "Enter a valid PAN Number";
      }

      if (!taxRegime) newErrors.taxRegime = "Tax Regime is required";
    } else if (!swiftCode.trim()) {
      newErrors.swiftCode = "SWIFT / BIC Code is required";
    }

    if (isUaeCompany(country) && accountNumber.trim() && !/^AE[0-9]{21}$/.test(accountNumber.trim().replace(/\s/g, "").toUpperCase())) {
      newErrors.accountNumber = "Enter a valid UAE IBAN";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    const countryDefaults = getBankSubmissionDefaults(country);
    const formData = new FormData();
    formData.append("bank_name", bankName);
    formData.append("swift_code", isIndiaCompany(country) ? ifscCode.trim().toUpperCase() : swiftCode.trim().toUpperCase());
    formData.append("account_number", accountNumber);
    formData.append("uan_epf_number", isIndiaCompany(country) ? uanNumber : "");
    formData.append("pan_number", countryDefaults.pan_number ?? panNumber.trim().toUpperCase());
    formData.append("tax_regime", countryDefaults.tax_regime ?? taxRegime);
formData.append("tds_deduction_amount", countryDefaults.tds_deduction_amount ?? tdsAmount);
formData.append("declaration_80c", countryDefaults.declaration_80c ?? declaration80C);
    formData.append("basic_salary", basicSalary);
    formData.append("salary_increment", salaryIncrement);
    formData.append("housing_allowance", housingAllowance);
    formData.append("transportation", transportation);

    if (bankProofImage) formData.append("bank_proof", bankProofImage);

    dispatch(
      submitBankPayment({
        employeeId: id,
        paymentId: existingPaymentId,
        data: formData,
        bankProofImage,
      })
    )
      .unwrap()
      .then(() => {
        Swal.fire({
          icon: "success",
          title: existingPaymentId ? "Updated!" : "Saved!",
          text: "Bank details saved successfully.",
          confirmButtonColor: "#304EB0",
        });
        dispatch(fetchAllBankPaymentsThunk(id));
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err?.detail || "Something went wrong.",
        });
      });
  };

  return (
    <>
      {loading && <SyncLoader />}

      <ViewBasicLayout
        id={id}
        handleSubmit={handleSave}
        formData={employeeDetail}
        handleChange={() => {}}
        handleImageChange={() => {}}
      >
        <Section>
          <ViewTableBank
           employeeId={id}
            country={country}
            isEditMode={true}
            setBankProofImage={setBankProofImage}
            bankName={bankName}
            setBankName={setBankName}
            ifscCode={ifscCode}
            setIfscCode={setIfscCode}
            swiftCode={swiftCode}
            setSwiftCode={setSwiftCode}
            accountNumber={accountNumber}
            setAccountNumber={setAccountNumber}
            uanNumber={uanNumber}
            setUanNumber={setUanNumber}
            panNumber={panNumber}
            setPanNumber={setPanNumber}
            taxRegime={taxRegime}
            setTaxRegime={setTaxRegime}
            tdsAmount={tdsAmount}
            setTdsAmount={setTdsAmount}
            declaration80C={declaration80C}
            setDeclaration80C={setDeclaration80C}
            basicSalary={basicSalary}
            setBasicSalary={setBasicSalary}
            salaryIncrement={salaryIncrement}
            setSalaryIncrement={setSalaryIncrement}
            housingAllowance={housingAllowance}
            setHousingAllowance={setHousingAllowance}
            transportation={transportation}
            setTransportation={setTransportation}
            errors={errors}
            showNextButton={false}
          />
        </Section>
      </ViewBasicLayout>
    </>
  );
};

export default ViewBankPayment;
