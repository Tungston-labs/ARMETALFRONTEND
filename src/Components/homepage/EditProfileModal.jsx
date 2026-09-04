import React, { useState, useEffect, useRef } from "react";
import {
  FormWrapper,
  BackHeader,
  FormSection,
  Input,
  ButtonGroup,
  Button,
  Select,
  FormField,
  Label,
  LogoUploadBox,
  LogoPreview,
} from "../../Pages/superAdmin/AddCompany.Styles";
import { GoArrowLeft } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import {
  getCompanySelf,
  patchCompanySelf,
} from "../../Redux/companySlice";
import { FiUpload } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";

const EditProfileModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef();

  const { company, loading } = useSelector((state) => state.company);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const countryDialCodes = [
    { code: "+91", label: "India (+91)" },
    { code: "+971", label: "UAE (+971)" },
    { code: "+966", label: "Saudi Arabia (+966)" },
    { code: "+965", label: "Kuwait (+965)" },
    { code: "+973", label: "Bahrain (+973)" },
    { code: "+968", label: "Oman (+968)" },
    { code: "+974", label: "Qatar (+974)" },
  ];

  const COUNTRY_CHOICES = [
    { code: "IN", name: "India" },
    { code: "AE", name: "United Arab Emirates" },
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "SG", name: "Singapore" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    location: "",
    country: "",
    country_code: "+91",
    contact_number: "",
    latitude: "",
    longitude: "",
    logo: null,
  });


  useEffect(() => {
    dispatch(getCompanySelf());
  }, [dispatch]);


  useEffect(() => {
    if (company) {
      const match = company.contact_number?.match(
        /^(\+\d{1,4})(\d{6,15})$/
      );

      setFormData({
        name: company.name || "",
        address: company.address || "",
        email: company.email || "",
        location: company.location || "",
        country: company.country || "",
        country_code: match ? match[1] : "+91",
        contact_number: match ? match[2] : "",
        latitude: company.latitude || "",
        longitude: company.longitude || "",
        logo: null,
      });

      if (company.logo) {
        setLogoPreview(company.logo);
      }
    }
  }, [company]);
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type === "image/png" || file.type === "image/svg+xml") {
      setFormData((prev) => ({ ...prev, logo: file }));
      setLogoPreview(URL.createObjectURL(file));
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid file type",
        text: "Only PNG or SVG files are allowed.",
        confirmButtonColor: "#3250B5",
      });
      fileInputRef.current.value = "";
    }
  };

  const removeLogo = () => {
    setFormData((prev) => ({ ...prev, logo: null }));
    setLogoPreview(null);
    fileInputRef.current.value = "";
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.name.trim()) errors.name = "Company name is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.location.trim()) errors.location = "Location is required";
    if (!formData.country) errors.country = "Country is required";
    if (!formData.latitude || formData.latitude < -90 || formData.latitude > 90)
      errors.latitude = "Latitude must be between -90 and 90";

    if (
      !formData.longitude ||
      formData.longitude < -180 ||
      formData.longitude > 180
    )
      errors.longitude = "Longitude must be between -180 and 180";

    if (!/^\d{7,12}$/.test(formData.contact_number))
      errors.contact_number = "Phone must be 7–12 digits";

    setFormErrors(errors);
    if (Object.keys(errors).length) return;

  const payload = {
  name: formData.name,
  address: formData.address,
  location: formData.location,
  country: formData.country,
  latitude: formData.latitude,
  longitude: formData.longitude,
  contact_number: `${formData.country_code}${formData.contact_number}`,
  logo: formData.logo || null,
};


    try {
      setIsSubmitting(true);

      await dispatch(patchCompanySelf(payload)).unwrap();

      Swal.fire({
        title: "Updated!",
        text: "Company profile updated successfully.",
        icon: "success",
        confirmButtonColor: "#3250B5",
      });

      onClose();
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: "Failed to update company profile.",
        icon: "error",
        confirmButtonColor: "#D33",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <FormWrapper>
      <BackHeader>
        <GoArrowLeft onClick={onClose} style={{ cursor: "pointer" }} />
        <span>Company Profile</span>
      </BackHeader>

      <form onSubmit={handleSubmit}>
        <FormSection>
          <div>
            <FormField>
              <Label>Company Name</Label>
              <Input name="name" value={formData.name} onChange={handleChange} disabled />
              {formErrors.name && <p style={{ color: "red" }}>{formErrors.name}</p>}
            </FormField>

            <FormField>
              <Label>Address</Label>
              <Input name="address" value={formData.address} onChange={handleChange} />
            </FormField>

            <FormField>
              <Label>Upload Logo</Label>
              <LogoUploadBox onClick={() => fileInputRef.current.click()}>
                <FiUpload size={22} />
                <p>PNG or SVG only</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".png,.svg"
                  hidden
                  onChange={handleLogoChange}
                      disabled
                />
              </LogoUploadBox>

              {logoPreview && (
                <LogoPreview>
                  <img src={logoPreview} alt="logo" />
                  <button type="button" onClick={removeLogo} disabled>
                    <AiOutlineClose />
                  </button>
                </LogoPreview>
              )}
            </FormField>
          </div>

          <div>
            <FormField>
              <Label>Location</Label>
              <Input name="location" value={formData.location} onChange={handleChange} />
            </FormField>

            <FormField>
              <Label>Contact Number</Label>
              <div style={{ display: "flex", gap: "8px" }}>
                <select
                  name="country_code"
                  value={formData.country_code}
                      disabled
                  onChange={handleChange}
                  style={{ width: "35%" }}
                >
                  {countryDialCodes.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>

                <Input
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleChange}
                      disabled
                />
              </div>
            </FormField>

            <FormField>
              <Label>Country</Label>
              <Select name="country" value={formData.country} onChange={handleChange} disabled>
                <option value="">Select country</option>
                {COUNTRY_CHOICES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField>
              <Label>Latitude</Label>
              <Input
                name="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={handleChange}
                    
              />
            </FormField>

            <FormField>
              <Label>Longitude</Label>
              <Input
                name="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={handleChange}   
              />
            </FormField>
          </div>
        </FormSection>

        <ButtonGroup>
          <Button type="button" cancel onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <ClipLoader size={16} color="#fff" />
                Updating...
              </>
            ) : (
              "Update"
            )}
          </Button>
        </ButtonGroup>
      </form>
    </FormWrapper>
  );
};

export default EditProfileModal;
