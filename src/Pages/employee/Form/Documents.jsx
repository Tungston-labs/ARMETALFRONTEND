import React, { useState, useRef } from 'react';
import {
  Container, Header, RoleInfo, SectionTitle,
  UploadSection, LabelRow, SizeHint, UploadButton, ImagePreviewRow,
  ImageBox, ButtonGroup, Button, Title, Subtitle, Hr, InlineUploadRow,
  FormCard
} from './Document.Styles';
import Multistep from '../../../Components/Employee/AddForm/Multistep';
import { LuCirclePlus } from "react-icons/lu";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import SuccessModal from '../../../Components/Employee/Succes';
import { useSelector, useDispatch } from 'react-redux';
import {
  submitDocumentsThunk,
  addDocumentUrl,
  uploadImageThunk
} from '../../../Redux/employeeSlice';
import EmployeeIcon from "../../../assets/employeeicon.svg";
import Loader from "../../../Components/Loader/Loader"
import { EmployeeImage } from './BasicLevel.Styles';
import ReusableHeader from '../../../Components/ReusableTable/ReusableHeader';
import FormStepper from '../AddEmployee/Formstepper';

export default function DocumentUploadForm() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const employeeId = useSelector((state) => state.employee.employeeId);
  const documentUrls = useSelector((state) => state.employee.documentUrls);

  // Profile photo picked in step 1 (Basic Details) — shown here read-only.
  const basicProfilePic = useSelector(
    (state) => state.employee.formData?.basic?.profile_pic
  );
  const profileImageSrc = basicProfilePic
    ? typeof basicProfilePic === "string"
      ? basicProfilePic
      : URL.createObjectURL(basicProfilePic)
    : null;

  const [uploadErrors, setUploadErrors] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({
    passport: [],
    workPermit: [],
    contract: [],
    insurance: [],
    certificate: [],
  });

  const fileInputRefs = {
    passport: useRef(),
    workPermit: useRef(),
    contract: useRef(),
    insurance: useRef(),
    certificate: useRef(),
  };

  const handleUploadClick = (type) => {
    fileInputRefs[type].current.click();
  };

  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);

    const validFiles = [];
    let error = "";

    files.forEach((file) => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        error = "Each image must be smaller than 1 MB.";
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        error = "Only image files are allowed.";
        return;
      }

      validFiles.push(file);
    });

    // Update error state
    setUploadErrors((prev) => ({
      ...prev,
      [type]: error,
    }));

    // Don't add invalid files
    if (validFiles.length === 0) {
      e.target.value = "";
      return;
    }

    setSelectedFiles((prev) => ({
      ...prev,
      [type]: [...prev[type], ...validFiles],
    }));

    // Reset input so the same file can be selected again
    e.target.value = "";
  };

  const handleDeleteImage = (type, index) => {
    setSelectedFiles(prev => {
      const updated = [...prev[type]];
      updated.splice(index, 1);
      return {
        ...prev,
        [type]: updated,
      };
    });
  };

  const handleSubmit = async () => {
    setUploadErrors({});
    setLoading(true);
    try {
      const uploadAndGetUrls = async (type) => {
        const files = selectedFiles[type] || [];
        if (files.length === 0) return documentUrls[type] || [];

        const uploadedUrls = await Promise.all(
          files.map(file => dispatch(uploadImageThunk(file)).unwrap())
        );
        setSelectedFiles(prev => ({ ...prev, [type]: [] }));
        uploadedUrls.forEach(url => {
          dispatch(addDocumentUrl({ type, url }));
        });

        return [...(documentUrls[type] || []), ...uploadedUrls];
      };

      const passportUrls = await uploadAndGetUrls('passport');
      const insuranceUrls = await uploadAndGetUrls('insurance');
      const workPermitUrls = await uploadAndGetUrls('workPermit');
      const contractUrls = await uploadAndGetUrls('contract');
      const certificateUrls = await uploadAndGetUrls('certificate');

      const payload = {
        passport_image1_url: passportUrls[0] || "",
        passport_image2_url: passportUrls[1] || "",
        insurance_image_url: insuranceUrls[0] || "",
        work_permit_urls: workPermitUrls,
        contract_urls: contractUrls,
        certificate_urls: certificateUrls
      };

      await dispatch(submitDocumentsThunk({ employeeId, documents: payload })).unwrap();
      setShowSuccessModal(true);
    } catch (err) {
      console.error("❌ Document submission failed:", err);
      alert("Final submission failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };


  const renderPreviewImages = (type) => {
    const localFiles = selectedFiles[type].map((file, index) => (
      <ImageBox key={`local-${index}`} style={{ position: 'relative' }}>
        <img
          src={URL.createObjectURL(file)}
          alt="Preview"
          onLoad={e => URL.revokeObjectURL(e.target.src)}
        />
        <FaTrash
          onClick={() => handleDeleteImage(type, index)}
          style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            cursor: 'pointer',
            color: 'red',
            background: 'white',
            borderRadius: '50%',
            padding: '5px',
            fontSize: '14px',
          }}
        />
      </ImageBox>
    ));

    const uploadedUrls = (documentUrls[type] || []).map((url, index) => (
      <ImageBox key={`uploaded-${index}`} style={{ position: 'relative' }}>
        <img src={url} alt="Uploaded" />
      </ImageBox>
    ));

    return [...uploadedUrls, ...localFiles];
  };

  const renderUploadBlock = (label, key) => (
    <UploadSection key={key}>

      <LabelRow>
        {label}
        <SizeHint>Max 1 MB per image</SizeHint>
        {uploadErrors[key] && (
          <span style={{ color: 'red', fontSize: '0.8rem', marginLeft: '1rem' }}>
            {uploadErrors[key]}
          </span>
        )}
      </LabelRow>

      <InlineUploadRow>
        <UploadButton onClick={() => handleUploadClick(key)}>
          <LuCirclePlus /> Upload images
        </UploadButton>
        <input
          type="file"
          multiple
          accept="image/*"
          ref={fileInputRefs[key]}
          style={{ display: 'none' }}
          onChange={(e) => handleFileChange(e, key)}
        />
        <ImagePreviewRow>{renderPreviewImages(key)}</ImagePreviewRow>
      </InlineUploadRow>
    </UploadSection>
  );

  return (
    <>
      {/* <Navbar/> */}
      {loading && <Loader />}
      <Container>

        <ReusableHeader
          title="Employees"
          breadcrumbs={["Employees", "Add Form"]}
          showBack
          onBack={() => navigate("/employee")}
        />
        <FormStepper
          steps={["Basic Details", "Bank Details", "Documents"]}
          activeStep={2}
          profileImageSrc={profileImageSrc}
          readOnly
        />
        <FormCard>
          <SectionTitle>Documents</SectionTitle>
          {renderUploadBlock("Passport-Front / Passport-Back", "passport")}
          {renderUploadBlock("Work Permit", "workPermit")}
          {renderUploadBlock("Employment Contract", "contract")}
          {renderUploadBlock("Insurance", "insurance")}
          <SectionTitle>Certificate</SectionTitle>
          {renderUploadBlock("Certificate", "certificate")}

          <ButtonGroup>
            <Button onClick={handleSubmit}>Save</Button>
          </ButtonGroup>

          {showSuccessModal && (
            <SuccessModal
              onClose={() => setShowSuccessModal(false)}
              onAddAnother={() => setShowSuccessModal(false)}
              navigate={navigate}
            />
          )}
        </FormCard>
      </Container>
    </>
  );
}